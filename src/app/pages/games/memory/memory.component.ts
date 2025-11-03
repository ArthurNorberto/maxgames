import { Component, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import type PhaserType from 'phaser';

@Component({
  selector: 'app-memory',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './memory.component.html',
  styleUrls: ['./memory.component.scss']
})
export class MemoryComponent implements AfterViewInit, OnDestroy {
  @ViewChild('gameContainer', { static: true }) gameContainer!: ElementRef<HTMLDivElement>;
  score = 0;
  timer = 0;
  timerInterval: any = null;
  private phaserGame: PhaserType.Game | null = null;

  private readonly cardItems = [
    'Parabrisa', 'Farol', 'Lanterna', 'Retrovisor', 'Para-choque',
    'ADAs', 'Airbag', 'Rodas', 'Pneu', 'Sensor de Estacionamento',
    'Limpador de Para-brisa', 'Câmera Traseira', 'Banco', 'Cinto de Segurança',
    'Capô', 'Grade Frontal', 'Painel', 'Volante', 'Freio', 'Escapamento',
    'Radiador', 'Bateria', 'Filtro de Ar', 'Filtro de Óleo', 'Amortecedor',
    'Mola', 'Trava Eletrônica', 'Vidro Lateral', 'Painel de Instrumentos',
    'Sensor de Chuva', 'Sensor de Luz', 'Retrovisor Interno', 'Farol de Neblina',
    'Suporte do Motor', 'Correia Dentada', 'Vela de Ignição', 'Bobina',
    'Embreagem', 'Câmbio', 'Eixo', 'Cardan', 'Luz de Ré', 'Alarme',
    'Airbag Lateral', 'Sensor de Posição', 'Sirene', 'Disco de Freio', 'Pastilha de Freio',
    'Parafuso', 'Porca', 'Mola Traseira', 'Paralama', 'Painel de LED', 'Botão Start',
    'Teto Solar', 'Suporte de Farol', 'Filtro de Combustível', 'Válvula', 'Catalisador',
    'Luz de Painel', 'Pedal', 'Correia de Acessórios', 'Reservatório de Água'
  ];

  // Configurações de grade progressiva
  private gridSizes = [
    { rows: 4, cols: 4 },
    { rows: 6, cols: 6 },
    { rows: 8, cols: 8 }
  ];
  private currentGridIndex = 0;

  async ngAfterViewInit(): Promise<void> {
    const Phaser: typeof PhaserType = (await import('phaser')).default ?? (await import('phaser'));
    const WIDTH = 600;
    const HEIGHT = 600;

    class MemoryScene extends Phaser.Scene {
      private cards: Phaser.GameObjects.Rectangle[] = [];
      private cardTexts: Phaser.GameObjects.Text[] = [];
      private cardValues: string[] = [];
      private firstCard: { rect: Phaser.GameObjects.Rectangle; text: Phaser.GameObjects.Text; value: string } | null = null;
      private secondCard: { rect: Phaser.GameObjects.Rectangle; text: Phaser.GameObjects.Text; value: string } | null = null;
      private canClick = true;
      private parent: MemoryComponent;
      private attempts = 0;

      constructor(parentComp: MemoryComponent) {
        super({ key: 'MemoryScene' });
        this.parent = parentComp;
      }

      create(): void {
        const { rows, cols } = this.parent.gridSizes[this.parent.currentGridIndex];
        const CARD_SIZE = WIDTH / cols - 15;

        // Fundo do tabuleiro
        this.add.rectangle(0, 0, WIDTH, HEIGHT, 0x0a3d62).setOrigin(0); // azul Autoglass

        // Embaralhar e duplicar
        const neededPairs = rows * cols / 2;
        const shuffledItems = Phaser.Utils.Array.Shuffle(this.parent.cardItems).slice(0, neededPairs);
        this.cardValues = Phaser.Utils.Array.Shuffle([...shuffledItems, ...shuffledItems]);

        let idx = 0;
        for (let row = 0; row < rows; row++) {
          for (let col = 0; col < cols; col++) {
            const x = col * (CARD_SIZE + 10) + 10;
            const y = row * (CARD_SIZE + 10) + 10;

            const rect = this.add.rectangle(x, y, CARD_SIZE, CARD_SIZE, 0x1e3799)
              .setStrokeStyle(2, 0xffffff)
              .setOrigin(0, 0)
              .setInteractive();

            const text = this.add.text(x + CARD_SIZE / 2, y + CARD_SIZE / 2, '', {
              color: '#ffffff',
              fontSize: Math.min(14, CARD_SIZE / 6) + 'px',
              fontFamily: 'Arial',
              align: 'center',
              wordWrap: { width: CARD_SIZE - 10 }
            }).setOrigin(0.5);

            const cardValue = this.cardValues[idx];
            rect.setData('status', 'hidden');
            rect.setData('value', cardValue);

            rect.on('pointerdown', () => this.flipCard(rect, text, cardValue));

            this.cards.push(rect);
            this.cardTexts.push(text);
            idx++;
          }
        }

        // Mostrar pontuação e timer na tela
        this.add.text(10, HEIGHT + 5, `Pontos: ${this.parent.score}`, { color: '#ffffff', fontSize: '16px' }).setName('scoreText');
        this.add.text(200, HEIGHT + 5, `Tempo: 0s`, { color: '#ffffff', fontSize: '16px' }).setName('timerText');

        // Timer
        this.parent.timer = 0;
        if (this.parent.timerInterval) clearInterval(this.parent.timerInterval);
        this.parent.timerInterval = setInterval(() => {
          this.parent.timer++;
          const timerText = this.children.getByName('timerText') as Phaser.GameObjects.Text;
          timerText.setText(`Tempo: ${this.parent.timer}s`);
        }, 1000);
      }

      private flipCard(rect: Phaser.GameObjects.Rectangle, text: Phaser.GameObjects.Text, value: string) {
        if (!this.canClick) return;
        const status = rect.getData('status');
        if (status === 'matched' || status === 'revealed') return;

        rect.fillColor = 0x78e08f; // verde Autoglass
        text.setText(value);
        rect.setData('status', 'revealed');

        if (!this.firstCard) {
          this.firstCard = { rect, text, value };
          return;
        }

        this.secondCard = { rect, text, value };
        this.canClick = false;
        this.attempts++;

        this.time.delayedCall(800, () => {
          if (this.firstCard!.value === this.secondCard!.value) {
            const baseScore = 100;
            const timeFactor = Math.max(1, 20 - this.parent.timer);
            const attemptFactor = Math.max(1, 10 - this.attempts);
            const points = baseScore * timeFactor / attemptFactor;
            this.parent.score += Math.round(points);

            this.firstCard!.rect.setData('status', 'matched');
            this.secondCard!.rect.setData('status', 'matched');
          } else {
            this.firstCard!.rect.fillColor = 0x1e3799;
            this.secondCard!.rect.fillColor = 0x1e3799;
            this.firstCard!.text.setText('');
            this.secondCard!.text.setText('');
            this.firstCard!.rect.setData('status', 'hidden');
            this.secondCard!.rect.setData('status', 'hidden');
          }

          // Atualizar score na tela
          const scoreText = this.children.getByName('scoreText') as Phaser.GameObjects.Text;
          scoreText.setText(`Pontos: ${this.parent.score}`);

          this.firstCard = null;
          this.secondCard = null;
          this.canClick = true;

          // Verifica se terminou o mapa
          if (this.cards.every(c => c.getData('status') === 'matched')) {
            clearInterval(this.parent.timerInterval);
            // Próximo mapa
            this.parent.currentGridIndex++;
            if (this.parent.currentGridIndex >= this.parent.gridSizes.length) {
              // final do jogo
              this.add.text(WIDTH / 2, HEIGHT / 2, `🎉 Fim do jogo! Pontos: ${this.parent.score}`, {
                color: '#ffffff',
                fontSize: '24px',
                fontStyle: 'bold'
              }).setOrigin(0.5);
            } else {
              // avançar mapa automaticamente
              this.scene.restart();
            }
          }
        });
      }

      resetGame(): void {
        this.scene.restart();
      }
    }

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: WIDTH,
      height: HEIGHT + 40, // espaço para score e timer
      parent: this.gameContainer.nativeElement,
      scene: [],
      backgroundColor: 0x0a3d62
    };

    const game = new Phaser.Game(config);
    const sceneInstance = new MemoryScene(this);
    game.scene.add('MemoryScene', sceneInstance, true);
    this.phaserGame = game;
  }

  newGame(): void {
    if (!this.phaserGame) return;
    this.currentGridIndex = 0;
    this.score = 0;
    this.timer = 0;
    const scene = this.phaserGame.scene.getScene('MemoryScene') as any;
    scene.resetGame();
  }

  setGrid(rows: number, cols: number) {
    this.currentGridIndex = this.gridSizes.findIndex(g => g.rows === rows && g.cols === cols);
    this.newGame();
  }

  ngOnDestroy(): void {
    if (this.phaserGame) this.phaserGame.destroy(true);
    if (this.timerInterval) clearInterval(this.timerInterval);
  }
}
