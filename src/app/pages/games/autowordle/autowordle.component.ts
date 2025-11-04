import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AutowordleService } from '../services/autowordle.service';

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
  ranking = [
    { name: 'Ana Souza', score: 50 },
    { name: 'Carlos Lima', score: 45 },
    { name: 'Marcos Silva', score: 40 },
  ];

  constructor(private autoWordleService: AutowordleService) {
    this.newGame();
  }

  newGame() {
    this.secretWord = this.autoWordleService.getRandomWord();
    this.wordLength = this.secretWord.length; // ✅ ajusta dinamicamente
    this.guesses = [];
    this.guessRows = Array.from({ length: this.maxAttempts }, () => Array(this.wordLength).fill(''));
    this.currentGuess = '';
    this.gameOver = false;
    this.endMessage = '';
    console.log('Palavra secreta:', this.secretWord);
  }

  submitGuess() {
    const guess = this.currentGuess.trim().toUpperCase();
    if (guess.length !== this.wordLength || this.gameOver) return;

    this.guesses.push(guess);
    this.guessRows[this.guesses.length - 1] = guess.split('');
    this.currentGuess = '';

    if (guess === this.secretWord) {
      this.gameOver = true;
      this.endMessage = `🎉 Parabéns! Você acertou em ${this.guesses.length} tentativas.`;
      this.updateRanking(this.guesses.length);
    } else if (this.guesses.length >= this.maxAttempts) {
      this.gameOver = true;
      this.endMessage = `❌ Suas chances acabaram! A palavra era: ${this.secretWord}`;
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

  updateRanking(attempts: number) {
    const points = (this.wordLength - attempts + 1) * 10;
    this.ranking.unshift({ name: 'Você', score: points });
    this.ranking.sort((a, b) => b.score - a.score);
    this.ranking = this.ranking.slice(0, 10);
  }
}
