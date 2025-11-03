import { Component, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import type PhaserType from 'phaser';

@Component({
  selector: 'app-basquete',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './basquete.component.html',
  styleUrls: ['./basquete.component.scss'],
})
export class BasqueteComponent implements AfterViewInit, OnDestroy {
  @ViewChild('gameContainer', { static: true }) gameContainer!: ElementRef<HTMLDivElement>;
  private phaserGame: PhaserType.Game | null = null;
  score = 0;

  async ngAfterViewInit(): Promise<void> {
    const Phaser: typeof PhaserType = (await import('phaser')).default ?? (await import('phaser'));
    const WIDTH = 960;
    const HEIGHT = 600;

    class MainScene extends Phaser.Scene {
      private ball!: Phaser.Physics.Arcade.Image;
      private hoop!: Phaser.GameObjects.Graphics;
      private player!: Phaser.GameObjects.Graphics;
      private hoopX = WIDTH - 160;
      private hoopY = 200;
      private rimRadius = 40;
      private scoreZone!: Phaser.Geom.Rectangle;
      private _lastInZone = false;
      private parent: BasqueteComponent;
      private canShoot = true;
      private ballHeld = true;

      private isAiming = false;
      private aimStart = new Phaser.Math.Vector2();
      private aimGraphics: Phaser.GameObjects.Graphics | null = null;

      constructor(parentComp: BasqueteComponent) {
        super({ key: 'MainScene' });
        this.parent = parentComp;
      }

      preload(): void {
        const g = this.add.graphics();
        g.fillStyle(0xffa500, 1);
        g.fillCircle(16, 16, 16);
        g.generateTexture('ball', 32, 32);
        g.destroy();
      }

      create(): void {
        // Fundo
        this.add.rectangle(0, 0, WIDTH, HEIGHT, 0x87ceeb).setOrigin(0);

        // Chão
        this.add.rectangle(WIDTH / 2, HEIGHT - 20, WIDTH, 40, 0x228b22);

        // Cesta
        this.hoop = this.add.graphics();
        this.hoop.fillStyle(0x8b4513, 1);
        this.hoop.fillRect(this.hoopX, HEIGHT - 60, 10, -(HEIGHT - this.hoopY));
        this.hoop.fillStyle(0xffff00, 1);
        this.hoop.fillRect(this.hoopX - 40, this.hoopY - 10, 80, 10);

        // Score zone
        this.scoreZone = new Phaser.Geom.Rectangle(this.hoopX - 35, this.hoopY - 10, 70, 6);

        // Boneco
        this.player = this.add.graphics();
        const playerX = 140;
        const playerY = HEIGHT - 60;
        this.player.fillStyle(0x0000ff, 1);
        this.player.fillRect(playerX - 10, playerY - 60, 20, 60);
        this.player.fillRect(playerX - 5, playerY - 80, 10, 20);

        // Bola
        this.ball = this.physics.add.image(playerX, playerY - 70, 'ball');
        this.ball.setCircle(16);
        this.ball.setBounce(0.6);
        this.ball.setCollideWorldBounds(true);
        this.ball.setDrag(0.8);
        this.ball.setDamping(true);
        this.ball.setMaxVelocity(1200, 1200);
        (this.ball.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);
        this.ball.setVelocity(0, 0);

        // Física do mundo
        this.physics.world.setBounds(0, 0, WIDTH, HEIGHT);

        // Input global
        window.addEventListener('pointerdown', this.onPointerDown);
        window.addEventListener('pointermove', this.onPointerMove);
        window.addEventListener('pointerup', this.onPointerUp);
      }

      private onPointerDown = (_: PointerEvent) => {
        const pointer = this.input.activePointer;
        const dist = Phaser.Math.Distance.Between(pointer.x, pointer.y, this.ball.x, this.ball.y);
        if (dist < 40 && this.canShoot) {
          this.isAiming = true;
          this.aimStart.set(pointer.x, pointer.y);
        }
      };

      private onPointerMove = (_: PointerEvent) => {
        if (!this.isAiming) return;
        const pointer = this.input.activePointer;
        if (!this.aimGraphics) this.aimGraphics = this.add.graphics();
        this.aimGraphics.clear();
        this.aimGraphics.lineStyle(2, 0x000000, 1);
        this.aimGraphics.strokeCircle(this.ball.x, this.ball.y, 18);
        this.aimGraphics.lineBetween(this.ball.x, this.ball.y, pointer.x, pointer.y);
      };

      private onPointerUp = (_: PointerEvent) => {
        if (!this.isAiming) return;
        this.isAiming = false;
        if (this.aimGraphics) {
          this.aimGraphics.clear();
          this.aimGraphics.destroy();
          this.aimGraphics = null;
        }
        const pointer = this.input.activePointer;
        const vx = this.aimStart.x - pointer.x;
        const vy = this.aimStart.y - pointer.y;
        const forceMul = 6;

        (this.ball.body as Phaser.Physics.Arcade.Body).setAllowGravity(true);
        this.ball.setVelocity(vx * forceMul, vy * forceMul);
        this.canShoot = false;
        this.ballHeld = false;
      };

      override update(): void {
        // Bola segurada
        if (this.ballHeld) this.ball.setPosition(140, 540);

        // Pontuação
        const inZone = this.scoreZone.contains(this.ball.x, this.ball.y);
        if (inZone && !this._lastInZone && (this.ball.body as Phaser.Physics.Arcade.Body).velocity.y > 0) {
          this.parent.addPoint();
        }
        this._lastInZone = inZone;

        // Reset automático da bola
        if (!this.ballHeld) {
          const vel = (this.ball.body as Phaser.Physics.Arcade.Body).velocity;
          const speed = Math.sqrt(vel.x * vel.x + vel.y * vel.y);
          if (speed < 5 || this.ball.y > 580) {
            this.parent.resetBall();
          }
        }
      }

      shutdown(): void {
        window.removeEventListener('pointerdown', this.onPointerDown);
        window.removeEventListener('pointermove', this.onPointerMove);
        window.removeEventListener('pointerup', this.onPointerUp);
      }
    }

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: WIDTH,
      height: HEIGHT,
      parent: this.gameContainer.nativeElement,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { x: 0, y: 600 },
          debug: false,
        },
      },
      scene: [],
    };

    const game = new Phaser.Game(config);
    const sceneInstance = new MainScene(this);
    game.scene.add('MainScene', sceneInstance, true);
    this.phaserGame = game;
  }

  addPoint(): void {
    this.score += 1;
  }

  resetScore(): void {
    this.score = 0;
  }

  resetBall(): void {
    if (!this.phaserGame) return;
    const scene = this.phaserGame.scene.getScene('MainScene') as any;
    scene.ball.setVelocity(0, 0);
    scene.ball.setPosition(140, 540);
    (scene.ball.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);
    scene['_lastInZone'] = false;
    scene['canShoot'] = true;
    scene['ballHeld'] = true;
  }

  ngOnDestroy(): void {
    if (this.phaserGame) {
      try {
        this.phaserGame.destroy(true);
      } catch (e) {
        console.warn('Erro ao destruir Phaser game', e);
      }
    }
  }
}
