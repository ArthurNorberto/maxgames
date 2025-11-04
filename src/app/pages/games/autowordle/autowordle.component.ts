import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AutowordleService } from '../services/autowordle.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-autowordle',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './autowordle.component.html',
  styleUrls: ['./autowordle.component.scss']
})
export class AutowordleComponent {
  wordLength = 5;
  maxAttempts = 6;
  secretWord = '';
  currentGuess = '';
  guesses: string[] = [];
  guessRows: string[][] = [];
  gameOver = false;
  endMessage = '';
  lastPoints: number | null = null;

  ranking = [
    { name: 'Ana Souza', score: 50 },
    { name: 'Carlos Lima', score: 45 },
    { name: 'Marcos Silva', score: 40 },
  ];

  constructor(
    private autoWordleService: AutowordleService,
    private toastr: ToastrService
  ) {
    this.newGame();
  }

  newGame() {
    this.secretWord = this.autoWordleService.getRandomWord();
    this.wordLength = this.secretWord.length;
    this.guesses = [];
    this.guessRows = Array.from({ length: this.maxAttempts }, () => Array(this.wordLength).fill(''));
    this.currentGuess = '';
    this.gameOver = false;
    this.endMessage = '';
    this.lastPoints = null;
    console.log('Palavra secreta:', this.secretWord);
  }

  nextWord() {
    this.toastr.info('Nova palavra gerada! Boa sorte!', 'AutoWordle');
    this.newGame();
  }

  submitGuess() {
    const guess = this.currentGuess.trim().toUpperCase();
    if (guess.length !== this.wordLength || this.gameOver) return;

    this.guesses.push(guess);
    this.guessRows[this.guesses.length - 1] = guess.split('');
    this.currentGuess = '';

    if (guess === this.secretWord) {
      this.gameOver = true;
      this.lastPoints = this.calculatePoints(this.guesses.length);
      this.endMessage = `🎉 Parabéns! Você acertou em ${this.guesses.length} tentativas.`;
      this.updateRanking(this.guesses.length);
      this.toastr.success(`Você ganhou ${this.lastPoints} pontos!`, 'Parabéns!');
    } else if (this.guesses.length >= this.maxAttempts) {
      this.gameOver = true;
      this.lastPoints = 0;
      this.endMessage = `❌ Suas chances acabaram! A palavra era: ${this.secretWord}`;
      this.toastr.error('Que pena! Tente novamente.', 'Fim de jogo');
    }
  }

  getCellClass(rowIndex: number, colIndex: number): string {
    const guess = this.guesses[rowIndex];
    if (!guess) return '';
    const letter = guess[colIndex];
    if (this.secretWord[colIndex] === letter) {
      return 'correct-position';
    } else if (this.secretWord.includes(letter)) {
      return 'wrong-position';
    } else {
      return 'not-in-word';
    }
  }

  calculatePoints(attempts: number): number {
    return Math.max((this.wordLength - attempts + 1) * 10, 0);
  }

  updateRanking(attempts: number) {
    const points = this.calculatePoints(attempts);
    this.ranking.unshift({ name: 'Você', score: points });
    this.ranking.sort((a, b) => b.score - a.score);
    this.ranking = this.ranking.slice(0, 10);
  }
}
