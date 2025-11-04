import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuizService, Question } from '../services/quiz.service';

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss'],
})
export class QuizComponent {
  score = 0;
  currentQuestionIndex = 0;
  helps = { skip: 1, removeTwo: 1, hint: 1 };
  questions: Question[] = [];
  usedQuestions = new Set<Question>();

  currentQuestion: Question | null = null;
  optionDisabled = false;
  hintText = '';
  gameOver = false;
  endMessage = '';
  letters = ['A', 'B', 'C', 'D'];

  // ✅ Nova tabela de pontuação por nível
  private levelPoints: Record<string, number> = {
    'Fácil': 5,
    'Médio': 10,
    'Difícil': 15,
    'Muito Difícil': 25,
    'Especialista': 50
  };

  constructor(private questionService: QuizService) {
    this.prepareQuestions();
    this.loadQuestion();
  }

  private shuffle<T>(arr: T[]): T[] {
    return arr
      .map((a): [number, T] => [Math.random(), a])
      .sort((a, b) => a[0] - b[0])
      .map(a => a[1]);
  }

  /** 
   * Seleciona 25 perguntas: 5 de cada nível
   */
  private prepareQuestions() {
    const all = this.questionService.getQuestions();

    const byLevel = {
      Fácil: this.shuffle(all.filter(q => q.level === 'Fácil')).slice(0, 5),
      Médio: this.shuffle(all.filter(q => q.level === 'Médio')).slice(0, 5),
      Difícil: this.shuffle(all.filter(q => q.level === 'Difícil')).slice(0, 5),
      'Muito Difícil': this.shuffle(all.filter(q => q.level === 'Muito Difícil')).slice(0, 5),
      Especialista: this.shuffle(all.filter(q => q.level === 'Especialista')).slice(0, 5),
    };

    // Junta todas as perguntas em ordem de nível
    this.questions = [
      ...byLevel.Fácil,
      ...byLevel.Médio,
      ...byLevel.Difícil,
      ...byLevel['Muito Difícil'],
      ...byLevel.Especialista,
    ].map(q => ({
      ...q,
      options: this.shuffle(q.options)
    }));
  }

  loadQuestion() {
    this.hintText = '';
    this.optionDisabled = false;
    this.currentQuestion = this.questions[this.currentQuestionIndex];
  }

  chooseOption(option: string) {
    this.optionDisabled = true;
    const q = this.currentQuestion!;

    if (option === q.answer) {
      // ✅ Soma pontos com base na dificuldade
      this.score += this.levelPoints[q.level] ?? 0;
      this.currentQuestionIndex++;

      if (this.currentQuestionIndex >= this.questions.length) {
        this.endGame(`🎉 Parabéns! Você completou o quiz com ${this.score} pontos!`);
      } else {
        setTimeout(() => this.loadQuestion(), 700);
      }
    } else {
      this.endGame(`❌ Resposta errada! Você terminou com ${this.score} pontos.`);
    }
  }

  useHelp(type: 'skip' | 'removeTwo' | 'hint') {
    if (this.helps[type] <= 0 || !this.currentQuestion) return;
    this.helps[type]--;

    const q = this.currentQuestion;

    if (type === 'skip') {
      this.currentQuestionIndex++;
      if (this.currentQuestionIndex >= this.questions.length) {
        this.endGame(`🎉 Você concluiu com ${this.score} pontos!`);
      } else {
        this.loadQuestion();
      }
    }

    if (type === 'removeTwo') {
      const wrongs = q.options.filter(opt => opt !== q.answer);
      const remove = this.shuffle(wrongs).slice(0, 2);
      q.options = q.options.filter(opt => !remove.includes(opt));
    }

    if (type === 'hint' && q.hint) {
      this.hintText = q.hint;
    }
  }

  newGame() {
    this.score = 0;
    this.currentQuestionIndex = 0;
    this.helps = { skip: 1, removeTwo: 1, hint: 1 };
    this.usedQuestions.clear();
    this.gameOver = false;
    this.prepareQuestions();
    this.loadQuestion();
  }

  private endGame(msg: string) {
    this.endMessage = msg;
    this.gameOver = true;
  }
}
