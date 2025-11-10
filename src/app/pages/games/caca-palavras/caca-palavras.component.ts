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
  difficulty: 'facil' | 'medio' | 'dificil' = 'facil';

  score = 0;
  timer = 0;
  private timerInterval: any = null;

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
    this.clearTimer();
  }

  /** Define o número de palavras conforme a dificuldade escolhida */
  setDifficulty(level: 'facil' | 'medio' | 'dificil') {
    this.difficulty = level;
    this.toastr.info(`Nível ${level.toUpperCase()} selecionado!`, 'Dificuldade', {
      timeOut: 1500,
      positionClass: 'toast-top-center'
    });
    this.startByDifficulty();
  }

  private startByDifficulty() {
    let numWords = 8;
    if (this.difficulty === 'facil') numWords = 5;
    if (this.difficulty === 'dificil') numWords = 10;

    this.words = this.cacaService.getPalavrasAleatorias(numWords).map(w => w.toUpperCase());
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

    this.clearTimer();

    this.toastr.info('Novo jogo iniciado!', 'Boa sorte!', {
      timeOut: 1200,
      positionClass: 'toast-bottom-right'
    });

    this.generateGame();
  }

  /** Gera o caça-palavras (sincrono — sem detectChanges / waits) */
  generateGame() {
    this.loading = true;

    // ajuste de tamanho baseado na maior palavra
    const maxWordLength = this.words.length ? Math.max(...this.words.map(w => w.length)) : 0;
    let currentSize = Math.max(12, maxWordLength + 2);

    let success = false;
    let attempts = 0;

    // tentamos gerar aumentando levemente o grid se necessário (até 6 tentativas)
    while (!success && attempts < 6) {
      attempts++;
      this.rows = this.cols = currentSize;
      success = this.buildGrid();
      if (!success) currentSize++;
    }

    this.loading = false;

    if (success) {
      this.toastr.success('Caça-palavras pronto!', 'Boa sorte!', {
        timeOut: 1100,
        positionClass: 'toast-top-center'
      });
      this.startTimer();
    } else {
      this.toastr.error('Erro ao gerar o jogo 😞', 'Tente novamente');
      this.gameOver = true;
    }
  }

  /** (Re)inicia o timer — limpa o anterior primeiro */
  startTimer() {
    this.clearTimer();
    const startTime = Date.now();
    this.timerInterval = setInterval(() => {
      this.timer = Math.floor((Date.now() - startTime) / 1000);
      // proteções
      if (this.timer > 10000) {
        // safety fallback
        this.clearTimer();
      }
    }, 1000);
  }

  private clearTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  /** Monta o grid. Retirado loops gigantescos; limites reduzidos. */
  private buildGrid(): boolean {
    const dirs = [
      { dr: 0, dc: 1 }, { dr: 1, dc: 0 }, { dr: 1, dc: 1 },
      { dr: 0, dc: -1 }, { dr: -1, dc: 0 }, { dr: -1, dc: -1 },
      { dr: 1, dc: -1 }, { dr: -1, dc: 1 },
    ];

    // matriz temporária
    const grid: (string | null)[][] = Array.from({ length: this.rows }, () => Array(this.cols).fill(null));
    const placed: string[] = [];

    // ordenar por tamanho (maiores primeiro)
    const sortedWords = [...this.words].sort((a, b) => b.length - a.length);

    for (const rawWord of sortedWords) {
      const word = rawWord.toUpperCase();

      // se maior que grid — abort early
      if (word.length > this.rows && word.length > this.cols) {
        console.warn(`Palavra muito grande para o grid: ${word}`);
        return false;
      }

      let placedFlag = false;
      let tries = 0;
      const maxTries = 200; // reduzir de 800 para 200

      while (!placedFlag && tries < maxTries) {
        tries++;
        const dir = dirs[Math.floor(Math.random() * dirs.length)];
        const dr = dir.dr;
        const dc = dir.dc;

        // escolher posição inicial dentro dos limites
        const maxRow = this.rows - (dr ? word.length : 1);
        const maxCol = this.cols - (dc ? word.length : 1);
        if (maxRow < 0 || maxCol < 0) break;

        const r = Math.floor(Math.random() * (maxRow + 1));
        const c = Math.floor(Math.random() * (maxCol + 1));

        if (this.canPlaceWord(grid, word, r, c, dr, dc)) {
          for (let j = 0; j < word.length; j++) {
            grid[r + j * dr][c + j * dc] = word[j];
          }
          placedFlag = true;
          placed.push(word);
        }
      }

      if (!placedFlag) {
        // não conseguimos posicionar essa palavra nesta configuração
        console.warn(`Não foi possível posicionar: ${word} (tentativas: ${Math.min(maxTries, tries)})`);
        return false; // falha essa geração — sinalize para aumentar grid
      }
    }

    // preencher espaços vazios com letras aleatórias
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const ch = grid[r][c];
        if (ch === null || ch === undefined) {
          grid[r][c] = letters.charAt(Math.floor(Math.random() * letters.length));
        }
      }
    }

    // converte para this.grid (array linear)
    this.grid = grid.flat().map(letter => ({ letter: letter as string, isFound: false }));
    return true;
  }

  /** Verifica se cabe a palavra (permite sobrepor letras iguais) */
  private canPlaceWord(grid: (string | null)[][], word: string, row: number, col: number, dr: number, dc: number): boolean {
    for (let i = 0; i < word.length; i++) {
      const r = row + i * dr;
      const c = col + i * dc;
      if (r < 0 || c < 0 || r >= this.rows || c >= this.cols) return false;
      const existing = grid[r][c];
      if (existing && existing !== word[i]) return false;
    }
    return true;
  }

  // === Interações ===

  // trackBy para listagem de células no template (use no *ngFor)
  trackByIndex(index: number) {
    return index;
  }

  cellMouseDown(idx: number) {
    // iniciar seleção
    this.selectedCells = [idx];
  }

  cellMouseEnter(idx: number) {
    // append somente se tiver seleção ativa
    if (this.selectedCells.length > 0) {
      const last = this.selectedCells[this.selectedCells.length - 1];
      if (idx !== last && !this.selectedCells.includes(idx)) {
        this.selectedCells.push(idx);
      }
    }
  }

  cellMouseUp() {
    if (!this.selectedCells.length) return;

    const guess = this.selectedCells.map(i => this.grid[i].letter).join('');
    const rev = guess.split('').reverse().join('');
    const found = this.words.find(w => w === guess || w === rev);

    if (found && !this.foundWords.includes(found)) {
      this.foundWords.push(found);
      // marca células como encontradas
      for (const i of this.selectedCells) {
        if (this.grid[i]) this.grid[i].isFound = true;
      }

      const timePenalty = Math.min(this.timer * 2, 800);
      const gained = Math.max(100 - timePenalty / 10, 10);
      this.score += Math.floor(gained);

      this.toastr.success(`Palavra encontrada: ${found}!`, 'Boa!', { timeOut: 900 });

      if (this.foundWords.length === this.words.length) {
        this.gameOver = true;
        this.endMessage = `🎉 Parabéns! Você encontrou todas as palavras!`;
        this.toastr.success('Você completou o jogo!', '🏁 Fim de jogo!');
        this.clearTimer();
      }
    }

    // reset seleção
    this.selectedCells = [];
  }
}
