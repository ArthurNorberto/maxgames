import { Component, AfterViewInit, OnDestroy, ViewChild, ElementRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import type PhaserType from 'phaser';
import { MilhaoQuestionsService, Question } from '../services/milhao-questions.service';

@Component({
  selector: 'app-milhao',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './milhao.component.html',
  styleUrls: ['./milhao.component.scss'],
})
export class MilhaoComponent implements AfterViewInit, OnDestroy {
  @ViewChild('gameContainer', { static: true }) gameContainer!: ElementRef<HTMLDivElement>;
  private phaserGame: PhaserType.Game | null = null;

  score = 0;
  currentQuestionIndex = 0;
  helps = { skip: 1, removeTwo: 1, hint: 1 };

  private prizes = [
    100, 200, 300, 500, 1000,          // Fácil
    2000, 4000, 8000, 16000, 32000,   // Médio
    64000, 125000, 250000,            // Difícil
    500000, 750000, 900000,           // Muito Difícil
    1000000                           // Especialista
  ];

  questions: Question[] = [];
  private usedQuestions: Set<Question> = new Set();

  constructor(private ngZone: NgZone, private questionService: MilhaoQuestionsService) {}

  async ngAfterViewInit(): Promise<void> {
    this.prepareQuestions();
    this.initGame();
  }

  private shuffleArray<T>(array: T[]): T[] {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  private prepareQuestions() {
    const allQuestions = this.questionService.getQuestions();

    const easyQuestions = allQuestions.filter(q => q.level === 'Fácil');
    const mediumQuestions = allQuestions.filter(q => q.level === 'Médio');
    const hardQuestions = allQuestions.filter(q => q.level === 'Difícil');
    const veryHardQuestions = allQuestions.filter(q => q.level === 'Muito Difícil');
    const expertQuestions = allQuestions.filter(q => q.level === 'Especialista');

    this.questions = [];

    for (let i = 0; i < this.prizes.length; i++) {
      let pool: Question[];

      if (i < 5) pool = easyQuestions;
      else if (i < 10) pool = mediumQuestions;
      else if (i < 13) pool = hardQuestions;
      else if (i < 16) pool = veryHardQuestions;
      else pool = expertQuestions;

      const available = pool.filter(q => !this.usedQuestions.has(q));
      if (!available.length) throw new Error('Sem perguntas disponíveis para esse nível');

      const chosen = available[Math.floor(Math.random() * available.length)];
      const shuffledOptions = this.shuffleArray(chosen.options);
      this.questions.push({ ...chosen, options: shuffledOptions });
      this.usedQuestions.add(chosen);
    }
  }

  private async initGame() {
    const Phaser: typeof PhaserType = (await import('phaser')).default ?? (await import('phaser'));
    const WIDTH = 800;
    const HEIGHT = 500;

    class MilhaoScene extends Phaser.Scene {
      private parent: MilhaoComponent;
      private questionText!: Phaser.GameObjects.Text;
      private questionNumberText!: Phaser.GameObjects.Text;
      private optionButtons: Phaser.GameObjects.Text[] = [];

      constructor(parentComp: MilhaoComponent) {
        super({ key: 'MilhaoScene' });
        this.parent = parentComp;
      }

      create(): void {
        this.add.rectangle(0, 0, WIDTH, HEIGHT, 0x0a3d62).setOrigin(0);
        this.showQuestion();
      }

      private showQuestion() {
        this.clearOptions();
        if (this.parent.currentQuestionIndex >= this.parent.questions.length) return;

        const q = this.parent.questions[this.parent.currentQuestionIndex];

        this.questionNumberText = this.add.text(WIDTH / 2, 20, `Pergunta ${this.parent.currentQuestionIndex + 1} / ${this.parent.questions.length}`, {
          fontSize: '18px',
          color: '#ffff00',
          fontStyle: 'bold'
        }).setOrigin(0.5);

        this.questionText = this.add.text(WIDTH / 2, 50, q.question, {
          fontSize: '22px',
          color: '#ffffff',
          fontStyle: 'bold',
          wordWrap: { width: WIDTH - 40 },
          align: 'center'
        }).setOrigin(0.5, 0);

        q.options.forEach((opt, i) => {
          const letter = String.fromCharCode(65 + i);
          const btn = this.add.text(WIDTH / 2, 150 + i * 70, `${letter}) ${opt}`, {
            fontSize: '20px',
            color: '#ffffff',
            backgroundColor: '#1e3799',
            padding: { left: 10, right: 10, top: 5, bottom: 5 },
            fontStyle: 'bold'
          }).setOrigin(0.5).setInteractive();

          btn.on('pointerdown', () => this.checkAnswer(opt));
          this.optionButtons.push(btn);
        });
      }

      private checkAnswer(option: string) {
        const q = this.parent.questions[this.parent.currentQuestionIndex];
        if (option === q.answer) {
          this.parent.currentQuestionIndex++;
          this.parent.ngZone.run(() => {
            this.parent.score = this.parent.prizes[this.parent.currentQuestionIndex - 1];
          });
          if (this.parent.currentQuestionIndex >= this.parent.questions.length) {
            this.showEnd('🎉 Parabéns! Você ganhou R$' + this.parent.score);
          } else {
            this.showQuestion();
          }
        } else {
          const lastPrize = this.parent.currentQuestionIndex > 0 ? this.parent.prizes[this.parent.currentQuestionIndex - 1] : 0;
          this.parent.ngZone.run(() => this.parent.score = lastPrize);
          this.showEnd(`❌ Infelizmente você perdeu. Você saiu com R$${lastPrize}`);
        }
      }

      private clearOptions() {
        this.optionButtons.forEach(btn => btn.destroy());
        this.optionButtons = [];
        if (this.questionText) this.questionText.destroy();
        if (this.questionNumberText) this.questionNumberText.destroy();
      }

      private showEnd(msg: string) {
        this.clearOptions();
        this.add.text(WIDTH / 2, HEIGHT / 2, msg, {
          fontSize: '28px',
          color: '#ffffff',
          fontStyle: 'bold',
          align: 'center',
          wordWrap: { width: WIDTH - 40 }
        }).setOrigin(0.5);
      }
    }

    if (this.phaserGame) this.phaserGame.destroy(true);

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: WIDTH,
      height: HEIGHT,
      parent: this.gameContainer.nativeElement,
      scene: [],
      backgroundColor: 0x0a3d62
    };

    const game = new Phaser.Game(config);
    const sceneInstance = new MilhaoScene(this);
    game.scene.add('MilhaoScene', sceneInstance, true);
    this.phaserGame = game;
  }

  useHelp(type: 'skip' | 'removeTwo' | 'hint') {
    if (this.helps[type] <= 0) return;
    this.helps[type]--;

    const scene = this.phaserGame?.scene.getScene('MilhaoScene') as any;
    if (!scene?.optionButtons) return;

    const q = this.questions[this.currentQuestionIndex];

    if (type === 'skip') {
      // Troca a pergunta atual por outra do mesmo nível
      const allQuestions = this.questionService.getQuestions().filter(qq => qq.level === q.level);
      const available = allQuestions.filter(qq => !this.usedQuestions.has(qq));
      if (available.length) {
        const newQuestion = available[Math.floor(Math.random() * available.length)];
        const shuffledOptions = this.shuffleArray(newQuestion.options);
        this.questions[this.currentQuestionIndex] = { ...newQuestion, options: shuffledOptions };
        this.usedQuestions.add(newQuestion);
        scene.showQuestion();
      }
    }

    if (type === 'removeTwo') {
      let removed = 0;
      scene.optionButtons.forEach((btn: any) => {
        if (!btn.text.includes(q.answer) && removed < 2) {
          btn.disableInteractive();
          btn.setColor('#999');
          removed++;
        }
      });
    }

    if (type === 'hint') {
      if (q.hint) {
        scene.add.text(400, 450, `💡 Dica: ${q.hint}`, {
          fontSize: '18px',
          color: '#ffdd00',
          fontStyle: 'bold',
          wordWrap: { width: 760 }
        }).setOrigin(0.5);
      }
    }
  }

  newGame() {
    this.score = 0;
    this.currentQuestionIndex = 0;
    this.helps = { skip: 1, removeTwo: 1, hint: 1 };
    this.usedQuestions.clear();
    this.prepareQuestions();
    this.initGame();
  }

  ngOnDestroy(): void {
    if (this.phaserGame) this.phaserGame.destroy(true);
  }
}
