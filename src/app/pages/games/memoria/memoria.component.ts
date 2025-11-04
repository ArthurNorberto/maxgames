import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { MemoriaService } from '../services/memoria.service'; // ✅ Import do service

@Component({
  selector: 'app-memory',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './memoria.component.html',
  styleUrls: ['./memoria.component.scss']
})
export class MemoriaComponent implements OnInit, OnDestroy {
  score = 0;
  timer = 0;
  timerInterval: any = null;
  currentGridIndex = 0;
  flippedCards: any[] = [];
  matchedCards = 0;
  attempts = 0;

  readonly gridSizes = [
    { rows: 4, cols: 4, label: 'Fácil' },
    { rows: 6, cols: 6, label: 'Médio' },
    { rows: 8, cols: 8, label: 'Difícil' }
  ];

  ranking = [
    { name: 'Ana Souza', score: 3200 },
    { name: 'Carlos Lima', score: 2900 },
    { name: 'Marcos Silva', score: 2700 },
    { name: 'Fernanda Rocha', score: 2500 },
    { name: 'Você', score: this.score }
  ];

  cards: { id: number; value: string; flipped: boolean; matched: boolean }[] = [];

  constructor(
    private toastr: ToastrService,
    private memoriaService: MemoriaService // ✅ Injeção do service
  ) {}

  ngOnInit() {
    this.startNewGame();
  }

  /** Reinicia o jogo completamente */
  startNewGame() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.score = 0;
    this.timer = 0;
    this.matchedCards = 0;
    this.flippedCards = [];
    this.attempts = 0;
    this.currentGridIndex = 0;

    this.loadGrid();
    this.startTimer();
    this.toastr.info('Novo jogo iniciado! Nível Fácil', '🆕 Jogo Reiniciado');
  }

  /** Inicia um nível mantendo a pontuação acumulada */
  private loadGrid() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.timer = 0;
    this.matchedCards = 0;
    this.flippedCards = [];
    this.attempts = 0;

    const { rows, cols } = this.gridSizes[this.currentGridIndex];
    const neededPairs = (rows * cols) / 2;

    // 🔹 Obtém palavras aleatórias do service
    const palavras = this.memoriaService.getPalavrasAleatorias(neededPairs);
    const todasCartas = [...palavras, ...palavras].sort(() => Math.random() - 0.5);

    this.cards = todasCartas.map((value, i) => ({
      id: i,
      value,
      flipped: false,
      matched: false
    }));

    this.startTimer();
  }

  private startTimer() {
    this.timerInterval = setInterval(() => {
      this.timer++;
    }, 1000);
  }

  flipCard(card: any) {
    if (card.flipped || card.matched || this.flippedCards.length >= 2) return;

    card.flipped = true;
    this.flippedCards.push(card);

    if (this.flippedCards.length === 2) {
      this.checkMatch();
    }
  }

  private checkMatch() {
    const [first, second] = this.flippedCards;
    this.attempts++;

    if (first.value === second.value) {
      first.matched = true;
      second.matched = true;
      this.matchedCards += 2;

      const baseScore = 100;
      const timeFactor = Math.max(1, 20 - this.timer / 10);
      const attemptFactor = Math.max(1, 10 - this.attempts / 2);
      this.score += Math.round(baseScore * timeFactor / attemptFactor);

      this.flippedCards = [];

      if (this.matchedCards === this.cards.length) {
        clearInterval(this.timerInterval);
        setTimeout(() => this.nextLevel(), 800);
      }
    } else {
      setTimeout(() => {
        first.flipped = false;
        second.flipped = false;
        this.flippedCards = [];
      }, 800);
    }
  }

  private nextLevel() {
    this.currentGridIndex++;

    if (this.currentGridIndex >= this.gridSizes.length) {
      this.toastr.success(
        `Pontuação final: ${this.score}`,
        '🎉 Parabéns! Você concluiu todos os níveis!'
      );
      this.currentGridIndex = 0;
      setTimeout(() => this.startNewGame(), 2500);
      return;
    }

    const nextLabel = this.gridSizes[this.currentGridIndex].label;
    this.toastr.success(`Avançando para o modo ${nextLabel}!`, '✅ Nível concluído!');
    this.loadGrid();
  }

  get currentLevelLabel(): string {
    return this.gridSizes[this.currentGridIndex].label;
  }

  ngOnDestroy(): void {
    if (this.timerInterval) clearInterval(this.timerInterval);
  }
}
