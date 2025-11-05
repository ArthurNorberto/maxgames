import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PalavrasCruzadasService } from '../services/palavras-cruzadas.service';

type Dir = 'across' | 'down';

interface PlacedWord {
  word: string;
  row: number;
  col: number;
  dr: number;
  dc: number;
  number: number;
  dir: Dir;
}

interface Cell {
  solution?: string;
  value?: string;
  number?: number;
  blocked?: boolean;
}

@Component({
  selector: 'app-palavras-cruzadas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './palavras-cruzadas.component.html',
  styleUrls: ['./palavras-cruzadas.component.scss'],
})
export class PalavrasCruzadasComponent implements OnInit, OnDestroy {
  gridSize = 12;
  grid: Cell[][] = [];
  placedWords: PlacedWord[] = [];
  allWords: string[] = [];
  wordsCount = 8;
  wordsToPlace: string[] = [];

  totalTime = 300;
  timeRemaining = this.totalTime;
  timerHandle: any = null;
  loading = false;
  gameOver = false;
  score: number | null = null;

  ranking = [
    { name: 'Ana Souza', score: 1200 },
    { name: 'Carlos Lima', score: 1100 },
    { name: 'Juliana Torres', score: 950 },
    { name: 'Rafael Nunes', score: 870 },
    { name: 'Marcos Silva', score: 820 },
  ];

  constructor(
    private cdr: ChangeDetectorRef,
    private palavrasService: PalavrasCruzadasService
  ) {}

  ngOnInit() {
    this.allWords = this.palavrasService.getPalavras();
    this.newGame();
  }

  ngOnDestroy() {
    if (this.timerHandle) clearInterval(this.timerHandle);
  }

  /** Novo jogo */
  newGame() {
    this.loading = true;
    this.gameOver = false;
    this.score = null;
    if (this.timerHandle) clearInterval(this.timerHandle);
    this.timeRemaining = this.totalTime;
    this.placedWords = [];

    this.wordsToPlace = this.shuffle(this.allWords)
      .slice(0, this.wordsCount)
      .map((w) => w.toUpperCase());

    // grid dinâmico com base na palavra mais longa
    const maxLen = Math.max(...this.wordsToPlace.map((w) => w.length));
    this.gridSize = Math.max(12, maxLen + 4);

    let success = false;
    let attempts = 0;
    let currentSize = this.gridSize;

    while (!success && attempts < 10) {
      attempts++;
      this.gridSize = currentSize;
      this.grid = Array.from({ length: this.gridSize }, () =>
        Array.from({ length: this.gridSize }, () => ({ blocked: true }))
      );
      success = this.generatePlacement();
      if (!success) currentSize++;
    }

    if (!success) {
      console.error('❌ Falha crítica ao gerar o jogo.');
      this.loading = false;
      return;
    }

    // 🔧 Nova verificação para evitar palavras soltas
    this.ensureAllWordsCross();

    this.assignNumbers();
    this.finalizeBlocks();
    this.startTimer();

    this.loading = false;
    this.cdr.detectChanges();
  }

  private shuffle<T>(arr: T[]): T[] {
    return arr.slice().sort(() => Math.random() - 0.5);
  }

  /** Gera grade base */
  private generatePlacement(): boolean {
    const grid: (string | undefined)[][] = Array.from({ length: this.gridSize }, () =>
      Array.from({ length: this.gridSize }, (): string | undefined => undefined)
    );

    const placed: PlacedWord[] = [];
    const wordsSorted = [...this.wordsToPlace].sort((a, b) => b.length - a.length);

    const first = wordsSorted[0];
    if (first.length > this.gridSize) return false;

    // primeira palavra centralizada
    const startRow = Math.floor(this.gridSize / 2);
    const startCol = Math.floor((this.gridSize - first.length) / 2);
    for (let i = 0; i < first.length; i++) grid[startRow][startCol + i] = first[i];
    placed.push({
      word: first,
      row: startRow,
      col: startCol,
      dr: 0,
      dc: 1,
      number: 0,
      dir: 'across',
    });

    // tenta cruzar as outras
    for (const word of wordsSorted.slice(1)) {
      const upperWord = word.toUpperCase();
      if (upperWord.length > this.gridSize) continue;
      let bestPos: { row: number; col: number; dr: number; dc: number } | null = null;

      for (const pw of placed) {
        for (let i = 0; i < pw.word.length; i++) {
          const ch = pw.word[i];
          const matchIndexes = [...upperWord]
            .map((c, j) => (c === ch ? j : -1))
            .filter((j) => j >= 0);

          for (const j of matchIndexes) {
            const row = pw.row + i * pw.dr;
            const col = pw.col + i * pw.dc;
            const dr = pw.dr === 0 ? 1 : 0;
            const dc = pw.dc === 0 ? 1 : 0;
            const startRow = row - j * dr;
            const startCol = col - j * dc;

            if (this.canPlaceCrossing(grid, upperWord, startRow, startCol, dr, dc)) {
              bestPos = { row: startRow, col: startCol, dr, dc };
              break;
            }
          }
          if (bestPos) break;
        }
        if (bestPos) break;
      }

      if (bestPos) {
        const { row, col, dr, dc } = bestPos;
        for (let i = 0; i < upperWord.length; i++) {
          const r = row + i * dr;
          const c = col + i * dc;
          grid[r][c] = upperWord[i];
        }
        placed.push({
          word: upperWord,
          row,
          col,
          dr,
          dc,
          number: 0,
          dir: dr === 1 ? 'down' : 'across',
        });
      } else {
        // fallback: tenta colocar aleatoriamente
        let tries = 0;
        while (tries++ < 300) {
          const vertical = Math.random() < 0.5;
          const dr = vertical ? 1 : 0;
          const dc = vertical ? 0 : 1;
          const maxRow = this.gridSize - (dr ? upperWord.length : 1);
          const maxCol = this.gridSize - (dc ? upperWord.length : 1);
          const row = Math.floor(Math.random() * (maxRow + 1));
          const col = Math.floor(Math.random() * (maxCol + 1));
          if (this.canPlaceCrossing(grid, upperWord, row, col, dr, dc)) {
            for (let i = 0; i < upperWord.length; i++) {
              const r = row + i * dr;
              const c = col + i * dc;
              grid[r][c] = upperWord[i];
            }
            placed.push({
              word: upperWord,
              row,
              col,
              dr,
              dc,
              number: 0,
              dir: dr === 1 ? 'down' : 'across',
            });
            break;
          }
        }
      }
    }

    // monta grid final
    for (let r = 0; r < this.gridSize; r++) {
      for (let c = 0; c < this.gridSize; c++) {
        const ch = grid[r][c];
        this.grid[r][c] = ch
          ? { solution: ch, value: '', blocked: false }
          : { blocked: true };
      }
    }

    this.placedWords = placed;
    return placed.length >= 3;
  }

  /** 🔧 Nova função — substitui palavras soltas por outras */
  private ensureAllWordsCross() {
    const intersecting = new Set<string>();

    for (const a of this.placedWords) {
      for (const b of this.placedWords) {
        if (a === b) continue;
        if (this.wordsIntersect(a, b)) {
          intersecting.add(a.word);
          intersecting.add(b.word);
        }
      }
    }

    const soltas = this.placedWords.filter((p) => !intersecting.has(p.word));
    if (soltas.length === 0) return;

    // tenta substituir por novas palavras compatíveis
    const usadas = new Set(this.placedWords.map((p) => p.word));
    const novas = this.allWords
      .map((w) => w.toUpperCase())
      .filter((w) => !usadas.has(w));

    let trocou = false;

    for (const solta of soltas) {
      const similar = novas.find(
        (w) => Math.abs(w.length - solta.word.length) <= 2
      );
      if (similar) {
        this.wordsToPlace = this.wordsToPlace.map((w) =>
          w === solta.word ? similar : w
        );
        trocou = true;
      }
    }

    if (trocou) {
      // regenera grade
      this.generatePlacement();
    }
  }

  private wordsIntersect(a: PlacedWord, b: PlacedWord): boolean {
    for (let i = 0; i < a.word.length; i++) {
      const ar = a.row + i * a.dr;
      const ac = a.col + i * a.dc;
      for (let j = 0; j < b.word.length; j++) {
        const br = b.row + j * b.dr;
        const bc = b.col + j * b.dc;
        if (ar === br && ac === bc && a.word[i] === b.word[j]) return true;
      }
    }
    return false;
  }

  private canPlaceCrossing(
    grid: (string | undefined)[][],
    word: string,
    row: number,
    col: number,
    dr: number,
    dc: number
  ): boolean {
    for (let i = 0; i < word.length; i++) {
      const r = row + i * dr;
      const c = col + i * dc;
      if (!this.inBounds(r, c)) return false;
      const existing = grid[r][c];
      if (existing && existing !== word[i]) return false;

      // evita encostar
      if (!existing) {
        if (dr === 1) {
          if (
            (this.inBounds(r, c - 1) && grid[r][c - 1]) ||
            (this.inBounds(r, c + 1) && grid[r][c + 1])
          )
            return false;
        } else {
          if (
            (this.inBounds(r - 1, c) && grid[r - 1][c]) ||
            (this.inBounds(r + 1, c) && grid[r + 1][c])
          )
            return false;
        }
      }
    }

    const beforeR = row - dr;
    const beforeC = col - dc;
    const afterR = row + dr * word.length;
    const afterC = col + dc * word.length;
    if (this.inBounds(beforeR, beforeC) && grid[beforeR][beforeC]) return false;
    if (this.inBounds(afterR, afterC) && grid[afterR][afterC]) return false;

    return true;
  }

  private inBounds(r: number, c: number) {
    return r >= 0 && c >= 0 && r < this.gridSize && c < this.gridSize;
  }

  private assignNumbers() {
    let num = 1;
    for (let r = 0; r < this.gridSize; r++) {
      for (let c = 0; c < this.gridSize; c++) {
        const cell = this.grid[r][c];
        if (!cell || cell.blocked || !cell.solution) continue;
        const left = this.inBounds(r, c - 1) ? this.grid[r][c - 1] : undefined;
        const up = this.inBounds(r - 1, c) ? this.grid[r - 1][c] : undefined;
        const startsAcross =
          (!left || left.blocked) &&
          this.inBounds(r, c + 1) &&
          this.grid[r][c + 1] &&
          !this.grid[r][c + 1].blocked;
        const startsDown =
          (!up || up.blocked) &&
          this.inBounds(r + 1, c) &&
          this.grid[r + 1][c] &&
          !this.grid[r + 1][c].blocked;
        if (startsAcross || startsDown) cell.number = num++;
      }
    }
    for (const pw of this.placedWords) {
      const c = this.grid[pw.row][pw.col];
      pw.number = c && c.number ? c.number : 0;
    }
  }

  private finalizeBlocks() {
    for (let r = 0; r < this.gridSize; r++) {
      for (let c = 0; c < this.gridSize; c++) {
        if (!this.grid[r][c] || !this.grid[r][c].solution) {
          this.grid[r][c] = { blocked: true };
        } else {
          this.grid[r][c].value = '';
          this.grid[r][c].blocked = false;
        }
      }
    }
  }

  private startTimer() {
    if (this.timerHandle) clearInterval(this.timerHandle);
    const start = Date.now();
    this.timerHandle = setInterval(() => {
      const elapsed = Math.floor((Date.now() - start) / 1000);
      this.timeRemaining = Math.max(this.totalTime - elapsed, 0);
      if (this.timeRemaining <= 0) {
        clearInterval(this.timerHandle);
        this.onTimeUp();
      }
      this.cdr.detectChanges();
    }, 500);
  }

  private onTimeUp() {
    this.gameOver = true;
    this.calculateScore(false);
  }

  onInput(r: number, c: number, $event: any) {
    const val = ($event.target.value || '').toUpperCase().slice(-1);
    this.grid[r][c].value = val;
    this.checkAllWords();
  }

  private checkAllWords() {
    const allOk = this.placedWords.every((pw) => {
      let s = '';
      for (let i = 0; i < pw.word.length; i++) {
        const r = pw.row + i * pw.dr;
        const c = pw.col + i * pw.dc;
        const ch = this.grid[r][c].value || '';
        s += ch;
      }
      return s.toUpperCase() === pw.word.toUpperCase();
    });

    if (allOk) {
      if (this.timerHandle) clearInterval(this.timerHandle);
      this.gameOver = true;
      this.calculateScore(true);
    }
  }

  private calculateScore(completed: boolean) {
    const totalLetters = this.placedWords.reduce(
      (sum, p) => sum + p.word.length,
      0
    );
    const base = totalLetters * 10;
    this.score = completed
      ? Math.round(base * (0.5 + 0.5 * (this.timeRemaining / this.totalTime)))
      : 0;
    this.cdr.detectChanges();
  }

  get acrossClues() {
    return this.placedWords
      .filter((p) => p.dir === 'across')
      .sort((a, b) => (a.number || 0) - (b.number || 0));
  }

  get downClues() {
    return this.placedWords
      .filter((p) => p.dir === 'down')
      .sort((a, b) => (a.number || 0) - (b.number || 0));
  }

  revealAll() {
    for (let r = 0; r < this.gridSize; r++) {
      for (let c = 0; c < this.gridSize; c++) {
        if (this.grid[r][c] && !this.grid[r][c].blocked)
          this.grid[r][c].value = this.grid[r][c].solution;
      }
    }
    if (this.timerHandle) clearInterval(this.timerHandle);
    this.gameOver = true;
    this.calculateScore(false);
  }
}
