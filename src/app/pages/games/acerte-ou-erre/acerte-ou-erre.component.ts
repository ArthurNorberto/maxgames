import {
  Component,
  ElementRef,
  ViewChild,
  OnDestroy,
  AfterViewInit,
  HostListener
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AcerteOuErreService, PerguntaAcerteOuErre } from '../services/acerte-ou-erre.service';

type Difficulty = 'facil' | 'medio' | 'dificil' | 'muito' | 'especialista';

@Component({
  selector: 'app-acerte-ou-erre',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './acerte-ou-erre.component.html',
  styleUrls: ['./acerte-ou-erre.component.scss']
})
export class AcerteOuErreComponent implements AfterViewInit, OnDestroy {
  @ViewChild('answerInput') answerInput!: ElementRef<HTMLInputElement>;

  activeTab: 'jogo' | 'rank' = 'jogo';
  difficulty: Difficulty = 'facil';
  readonly Math = Math;
  lives = 3;

  totalSeconds = 30;
  timeLeft = this.totalSeconds;
  progressPercent = 100;
  private rafHandle: number | null = null;

  questions: PerguntaAcerteOuErre[] = [];
  filteredQuestions: PerguntaAcerteOuErre[] = [];
  currentIndex = -1;
  currentQ: PerguntaAcerteOuErre | null = null;

  revealedMask: string = '';
  private targetWord: string = '';

  revealedAnswer: string | null = null;
  answer = '';
  answeredCount = 0;
  score = 0;
  streak = 0;
  gameOver = false;
  msgClass = '';

  inputDisabled = false;

  constructor(
    private toastr: ToastrService,
    private gameService: AcerteOuErreService
  ) {
    this.questions = this.gameService.getAll();
  }

  ngAfterViewInit() {}
  ngOnDestroy() {
    this.clearTimers();
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(ev: KeyboardEvent) {
    if (ev.key === 'Enter' && !this.gameOver && !this.inputDisabled && this.currentQ)
      this.submitAnswer();
    else if (ev.key === 'Escape' && !this.gameOver && !this.inputDisabled)
      this.giveUp();
  }

  startNewSession() {
    this.resetState();
    this.filterQuestionsByDifficulty();
    this.shuffleQuestions();
    this.nextQuestion();
  }

  private resetState() {
    this.clearTimers();

    this.timeLeft = this.totalSeconds;
    this.progressPercent = 100;
    this.answeredCount = 0;
    this.score = 0;
    this.streak = 0;
    this.difficulty = 'facil';
    this.lives = 3;
    this.gameOver = false;
    this.currentIndex = -1;
    this.currentQ = null;
    this.answer = '';
    this.revealedAnswer = null;
    this.inputDisabled = false;
  }

  private shuffleQuestions() {
    for (let i = this.filteredQuestions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.filteredQuestions[i], this.filteredQuestions[j]] = [
        this.filteredQuestions[j],
        this.filteredQuestions[i]
      ];
    }
  }

  private filterQuestionsByDifficulty() {
    const levelMap: Record<Difficulty, PerguntaAcerteOuErre['level']> = {
      facil: 'Fácil',
      medio: 'Médio',
      dificil: 'Difícil',
      muito: 'Muito Difícil',
      especialista: 'Especialista'
    };
    const targetLevel = levelMap[this.difficulty];
    this.filteredQuestions = this.questions.filter(
      q => q.level === targetLevel
    );
  }

  nextQuestion() {
    this.clearTimers();
    this.answer = '';
    this.msgClass = '';
    this.revealedAnswer = null;
    this.inputDisabled = false;

    if (this.filteredQuestions.length === 0) {
      this.filterQuestionsByDifficulty();
      this.shuffleQuestions();
    }

    this.currentIndex++;
    if (this.currentIndex >= this.filteredQuestions.length) {
      this.currentIndex = 0;
      this.shuffleQuestions();
    }

    this.currentQ = this.filteredQuestions[this.currentIndex];
    this.targetWord = this.currentQ.palavra.toUpperCase();

    // cria máscara inicial (1–2 letras reveladas)
    this.revealedMask = this.prepareMask(this.targetWord);

    this.timeLeft = this.totalSeconds;
    this.progressPercent = 100;
    this.startTimer();

    setTimeout(() => this.answerInput?.nativeElement?.focus(), 50);
  }

  /** Cria a máscara com 1 ou 2 letras reveladas aleatoriamente */
  private prepareMask(word: string): string {
    const chars = word.split('');
    const totalRevealed = Math.min(2, Math.floor(word.length / 3));
    const revealedIndexes = new Set<number>();

    while (revealedIndexes.size < totalRevealed) {
      revealedIndexes.add(Math.floor(Math.random() * word.length));
    }

    return chars
      .map((ch, idx) => (revealedIndexes.has(idx) ? ch : '_'))
      .join('');
  }

  submitAnswer() {
    if (!this.currentQ || this.gameOver || this.inputDisabled) return;
    const guess = this.answer.trim().toUpperCase();
    if (!guess) return;

    this.inputDisabled = true;
    this.clearTimers();

    if (guess === this.targetWord) this.onCorrect();
    else this.onWrong();
  }

  private onCorrect() {
    const base = 100;
    const mult = this.getDifficultyMultiplier(this.difficulty);
    const timeFactor = Math.max(0.1, this.timeLeft / this.totalSeconds);
    const points = Math.round(
      base * mult * timeFactor + this.streak * 5
    );

    this.score += points;
    this.streak++;
    this.answeredCount++;
    this.revealedAnswer = this.currentQ?.palavra || null;
    this.revealedMask = this.targetWord; // revela a palavra completa
    this.msgClass = 'pulse-correct';
    this.toastr.success(
      `Correto! +${points} pontos`,
      `Nível: ${this.currentQ?.level}`,
      { timeOut: 1200 }
    );

    this.updateDifficulty();

    setTimeout(() => this.nextQuestion(), 2500);
  }

  private onWrong() {
    this.lives--;
    this.streak = 0;
    this.answeredCount++;
    this.revealedAnswer = this.currentQ?.palavra || null;
    this.revealedMask = this.targetWord; // revela a palavra completa
    this.msgClass = 'shake-wrong';
    this.toastr.error(
      `Errado! Resposta: ${this.currentQ?.palavra}`,
      `Nível: ${this.currentQ?.level}`,
      { timeOut: 1500 }
    );

    if (this.lives <= 0) {
      setTimeout(() => this.endGame(), 2500);
    } else {
      setTimeout(() => this.nextQuestion(), 2500);
    }
  }

  giveUp() {
    if (!this.currentQ || this.gameOver || this.inputDisabled) return;
    this.inputDisabled = true;
    this.clearTimers();

    this.lives--;
    this.streak = 0;
    this.answeredCount++;
    this.revealedAnswer = this.currentQ.palavra;
    this.revealedMask = this.targetWord; // revela a palavra completa
    this.msgClass = 'shake-wrong';
    this.toastr.info(
      `Desistiu — resposta: ${this.currentQ.palavra}`,
      `Nível: ${this.currentQ.level}`,
      { timeOut: 1500 }
    );

    if (this.lives <= 0) {
      setTimeout(() => this.endGame(), 2500);
    } else {
      setTimeout(() => this.nextQuestion(), 2500);
    }
  }

  private updateDifficulty() {
    if (this.answeredCount >= 40) this.difficulty = 'especialista';
    else if (this.answeredCount >= 30) this.difficulty = 'muito';
    else if (this.answeredCount >= 20) this.difficulty = 'dificil';
    else if (this.answeredCount >= 10) this.difficulty = 'medio';
    else this.difficulty = 'facil';

    this.filterQuestionsByDifficulty();
    this.shuffleQuestions();
    this.currentIndex = -1;
  }

  private getDifficultyMultiplier(diff: Difficulty): number {
    return {
      facil: 0.8,
      medio: 1,
      dificil: 1.3,
      muito: 1.7,
      especialista: 2.2
    }[diff];
  }

  private endGame() {
    this.clearTimers();
    this.gameOver = true;
    this.inputDisabled = true;
    this.toastr.info(`Fim de jogo! Pontos: ${this.score}`, 'Game Over');
  }

  private startTimer() {
    this.clearTimers();
    const start = performance.now();
    const total = this.totalSeconds * 1000;

    const tick = (now: number) => {
      const elapsed = now - start;
      const remaining = Math.max(0, total - elapsed);
      this.timeLeft = Math.ceil(remaining / 1000);
      this.progressPercent = (remaining / total) * 100;

      if (remaining <= 0) {
        this.inputDisabled = true;
        this.onWrong();
        return;
      }
      this.rafHandle = requestAnimationFrame(tick);
    };
    this.rafHandle = requestAnimationFrame(tick);
  }

  private clearTimers() {
    if (this.rafHandle !== null) {
      cancelAnimationFrame(this.rafHandle);
      this.rafHandle = null;
    }
  }

  get timeColorClass() {
    if (this.progressPercent > 60) return 'bar-green';
    if (this.progressPercent > 30) return 'bar-yellow';
    return 'bar-red blinking';
  }

  get displayedMasked() {
    return this.revealedMask.split('').join(' ');
  }

  startDefault() {
    this.startNewSession();
  }
}
