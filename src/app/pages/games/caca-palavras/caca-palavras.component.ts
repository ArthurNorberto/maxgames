import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CacaPalavrasService } from '../services/caca-palavras.service';

interface Cell {
  letter: string;
  isFound?: boolean;
}

@Component({
  selector: 'app-caca-palavras',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './caca-palavras.component.html',
  styleUrls: ['./caca-palavras.component.scss']
})
export class CacaPalavrasComponent implements OnInit, OnDestroy {
  rows = 12;
  cols = 12;
  grid: Cell[] = [];
  words: string[] = [];
  foundWords: string[] = [];
  selectedCells: number[] = [];
  gameOver = false;
  endMessage = '';

  score = 0;
  timer = 0;
  timerInterval: any;
  maxPoints = 1000;

  ranking = [
    { name: 'Ana Souza', score: 100 },
    { name: 'Carlos Lima', score: 90 },
    { name: 'Marcos Silva', score: 80 },
  ];

  constructor(private cacaService: CacaPalavrasService) {}

  ngOnInit() {
    this.words = this.cacaService.getPalavrasAleatorias(10); // 🔹 Pega 10 palavras aleatórias
    this.newGame();
  }

  ngOnDestroy() {
    clearInterval(this.timerInterval);
  }

  newGame() {
    this.gameOver = false;
    this.endMessage = '';
    this.foundWords = [];
    this.selectedCells = [];
    this.score = 0;
    this.timer = 0;
    this.words = this.cacaService.getPalavrasAleatorias(10); // 🔹 Atualiza as palavras a cada nova partida
    this.buildGrid();
    clearInterval(this.timerInterval);
    this.startTimer();
  }

  startTimer() {
    const startTime = Date.now();
    this.timerInterval = setInterval(() => {
      this.timer = Math.floor((Date.now() - startTime) / 1000);
      if (this.timer > 1000) clearInterval(this.timerInterval);
    }, 1000);
  }

  buildGrid() {
    const grid: string[][] = Array.from({ length: this.rows }, () =>
      Array(this.cols).fill('')
    );

    // 🔹 8 direções possíveis
    const directions = [
      { dr: 0, dc: 1 },   // →
      { dr: 0, dc: -1 },  // ←
      { dr: 1, dc: 0 },   // ↓
      { dr: -1, dc: 0 },  // ↑
      { dr: 1, dc: 1 },   // ↘
      { dr: -1, dc: -1 }, // ↖
      { dr: 1, dc: -1 },  // ↙
      { dr: -1, dc: 1 },  // ↗
    ];

    const shuffledDirections = [...directions].sort(() => Math.random() - 0.5);

    // 🔹 insere palavras
    for (let i = 0; i < this.words.length; i++) {
      const word = this.words[i];
      const dir = shuffledDirections[i % shuffledDirections.length];
      let placed = false;
      let attempts = 0;

      while (!placed && attempts < 200) {
        attempts++;
        const startRow = Math.floor(Math.random() * this.rows);
        const startCol = Math.floor(Math.random() * this.cols);

        if (this.canPlaceWord(grid, word, startRow, startCol, dir.dr, dir.dc)) {
          for (let j = 0; j < word.length; j++) {
            const r = startRow + j * dir.dr;
            const c = startCol + j * dir.dc;
            grid[r][c] = word[j];
          }
          placed = true;
        }
      }

      if (!placed) {
        console.warn(`⚠️ Palavra não coube na grade: ${word}`);
      }
    }

    // 🔹 preenche com letras aleatórias
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        if (!grid[r][c]) {
          grid[r][c] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
        }
      }
    }

    this.grid = grid.flat().map(letter => ({ letter, isFound: false }));
  }

  private canPlaceWord(
    grid: string[][],
    word: string,
    row: number,
    col: number,
    dr: number,
    dc: number
  ): boolean {
    const rows = grid.length;
    const cols = grid[0].length;

    for (let i = 0; i < word.length; i++) {
      const r = row + i * dr;
      const c = col + i * dc;
      if (r < 0 || c < 0 || r >= rows || c >= cols) return false;
      if (grid[r][c] && grid[r][c] !== word[i]) return false;
    }
    return true;
  }

  // === Interação do jogador ===

  cellMouseDown(idx: number) {
    this.selectedCells = [idx];
  }

  cellMouseEnter(idx: number) {
    if (this.selectedCells.length > 0 && !this.selectedCells.includes(idx)) {
      this.selectedCells.push(idx);
    }
  }

  cellMouseUp() {
    const guess = this.selectedCells.map(i => this.grid[i].letter).join('');
    const reversed = guess.split('').reverse().join('');

    const found = this.words.find(w => w === guess || w === reversed);
    if (found && !this.foundWords.includes(found)) {
      this.foundWords.push(found);
      this.selectedCells.forEach(i => (this.grid[i].isFound = true));

      const timePenalty = Math.min(this.timer * 2, 800);
      const gained = Math.max(100 - timePenalty / 10, 10);
      this.score += Math.floor(gained);

      if (this.foundWords.length === this.words.length) {
        this.gameOver = true;
        this.endMessage = `🎉 Você encontrou todas as palavras! Pontuação final: ${this.score}`;
        clearInterval(this.timerInterval);
      }
    }

    this.selectedCells = [];
  }
}
