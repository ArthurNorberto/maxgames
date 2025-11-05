import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
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
  difficulty: 'facil' | 'medio' | 'dificil' = 'medio';

  score = 0;
  timer = 0;
  timerInterval: any;

  ranking = [
    { name: 'Ana Souza', score: 100 },
    { name: 'Carlos Lima', score: 90 },
    { name: 'Marcos Silva', score: 80 },
  ];

  loading = false;

  constructor(
    private cacaService: CacaPalavrasService,
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.startByDifficulty();
  }

  ngOnDestroy() {
    clearInterval(this.timerInterval);
  }

  /** Define o número de palavras conforme a dificuldade escolhida */
  setDifficulty(level: 'facil' | 'medio' | 'dificil') {
    this.difficulty = level;
    this.toastr.info(`Nível ${level.toUpperCase()} selecionado!`, 'Dificuldade', {
      timeOut: 2000,
      positionClass: 'toast-top-center'
    });
    this.startByDifficulty();
  }

  private startByDifficulty() {
    let numWords = 8;
    if (this.difficulty === 'facil') numWords = 5;
    if (this.difficulty === 'dificil') numWords = 10;

    this.words = this.cacaService.getPalavrasAleatorias(numWords);
    this.newGame();
  }

  /** Reinicia o jogo */
  newGame() {
    this.gameOver = false;
    this.endMessage = '';
    this.foundWords = [];
    this.selectedCells = [];
    this.score = 0;
    this.timer = 0;
    clearInterval(this.timerInterval);

    this.toastr.info('Novo jogo iniciado!', 'Boa sorte!', {
      timeOut: 1500,
      positionClass: 'toast-bottom-right'
    });

    this.generateGame();
  }

  /** Gera o caça-palavras */
  async generateGame() {
    this.loading = true;
    this.cdr.detectChanges();
    await new Promise(r => setTimeout(r, 150));

    let success = false;
    let attempts = 0;
    let currentSize = 12;
    const maxWordLength = Math.max(...this.words.map(w => w.length));
    currentSize = Math.max(currentSize, maxWordLength + 2);

    while (!success && attempts < 10) {
      this.rows = this.cols = currentSize;
      attempts++;
      success = this.buildGrid();
      if (!success) currentSize++;
    }

    this.loading = false;
    this.cdr.detectChanges();

    if (success) {
      this.toastr.success('Caça-palavras pronto!', 'Boa sorte!', {
        timeOut: 1500,
        positionClass: 'toast-top-center'
      });
      this.startTimer();
    } else {
      this.toastr.error('Erro ao gerar o jogo 😞', 'Tente novamente');
      this.gameOver = true;
    }
  }

  startTimer() {
    const startTime = Date.now();
    this.timerInterval = setInterval(() => {
      this.timer = Math.floor((Date.now() - startTime) / 1000);
      if (this.timer > 1000) clearInterval(this.timerInterval);
    }, 1000);
  }

  /** Monta o grid */
  private buildGrid(): boolean {
    const dirs = [
      { dr: 0, dc: 1 }, { dr: 1, dc: 0 }, { dr: 1, dc: 1 },
      { dr: 0, dc: -1 }, { dr: -1, dc: 0 }, { dr: -1, dc: -1 },
      { dr: 1, dc: -1 }, { dr: -1, dc: 1 },
    ];

    const grid: string[][] = Array.from({ length: this.rows }, () => Array(this.cols).fill(''));
    const placed: string[] = [];

    const sortedWords = [...this.words].sort((a, b) => b.length - a.length);

    for (const word of sortedWords) {
      let placedFlag = false;
      let tries = 0;

      while (!placedFlag && tries < 800) {
        tries++;
        const dir = dirs[Math.floor(Math.random() * dirs.length)];
        const r = Math.floor(Math.random() * this.rows);
        const c = Math.floor(Math.random() * this.cols);

        if (this.canPlaceWord(grid, word, r, c, dir.dr, dir.dc)) {
          for (let j = 0; j < word.length; j++) {
            grid[r + j * dir.dr][c + j * dir.dc] = word[j];
          }
          placedFlag = true;
          placed.push(word);
        }
      }
    }

    if (placed.length === sortedWords.length) {
      for (let r = 0; r < this.rows; r++) {
        for (let c = 0; c < this.cols; c++) {
          if (!grid[r][c]) grid[r][c] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
        }
      }
      this.grid = grid.flat().map(letter => ({ letter, isFound: false }));
      return true;
    }

    return false;
  }

  private canPlaceWord(grid: string[][], word: string, row: number, col: number, dr: number, dc: number): boolean {
    const rows = grid.length, cols = grid[0].length;
    for (let i = 0; i < word.length; i++) {
      const r = row + i * dr, c = col + i * dc;
      if (r < 0 || c < 0 || r >= rows || c >= cols) return false;
      if (grid[r][c] && grid[r][c] !== word[i]) return false;
    }
    return true;
  }

  // === Interações ===
  cellMouseDown(idx: number) { this.selectedCells = [idx]; }
  cellMouseEnter(idx: number) {
    if (this.selectedCells.length > 0 && !this.selectedCells.includes(idx))
      this.selectedCells.push(idx);
  }

  cellMouseUp() {
    const guess = this.selectedCells.map(i => this.grid[i].letter).join('');
    const rev = guess.split('').reverse().join('');
    const found = this.words.find(w => w === guess || w === rev);

    if (found && !this.foundWords.includes(found)) {
      this.foundWords.push(found);
      this.selectedCells.forEach(i => this.grid[i].isFound = true);
      const timePenalty = Math.min(this.timer * 2, 800);
      const gained = Math.max(100 - timePenalty / 10, 10);
      this.score += Math.floor(gained);
      this.toastr.success(`Palavra encontrada: ${found}!`, 'Boa!', { timeOut: 1200 });

      if (this.foundWords.length === this.words.length) {
        this.gameOver = true;
        this.endMessage = `🎉 Parabéns! Você encontrou todas as palavras!`;
        this.toastr.success('Você completou o jogo!', '🏁 Fim de jogo!');
        clearInterval(this.timerInterval);
      }
    }

    this.selectedCells = [];
  }
}
