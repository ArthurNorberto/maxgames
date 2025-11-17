import { Component, ElementRef, ViewChild, OnDestroy, HostListener, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ForcaService } from '../services/forca.service';

@Component({
    selector: 'app-forca',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './forca.component.html',
    styleUrls: ['./forca.component.scss']
})
export class ForcaComponent implements AfterViewInit, OnDestroy {
    @ViewChild('hangmanCanvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;

    alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    usedLetters = new Set<string>();
    usedLettersList: string[] = [];

    secretWord = '';
    displayLetters: string[] = [];
    activeTab: 'jogo' | 'rank' | 'stats' = 'jogo';
    wrongParts = 0;
    maxParts = 6;
    gameOver = false;

    timeRemaining = 20;
    totalTime = 20;
    private timerHandle: any = null;

    guessWord = '';
    lastPoints: number | null = null;

    fakeRanking = [
        { name: 'João', score: 120 },
        { name: 'Maria', score: 110 },
        { name: 'Carlos', score: 90 },
        { name: 'Ana', score: 80 },
        { name: 'Você', score: 0 }
    ];

    hits = 0;
    score = 0;

    private ctx!: CanvasRenderingContext2D;

    constructor(
        private toastr: ToastrService,
        private forcaService: ForcaService
    ) { }

    ngOnInit() {

    }

    ngAfterViewInit() {
        setTimeout(() => {
            this.setupCanvas();
            this.newGame();
        });
    }

    ngOnDestroy() {
        this.clearTimer();
    }

    setActiveTab(tab: 'jogo' | 'rank' | 'stats') {
        this.activeTab = tab;
        if (tab === 'jogo') {
            setTimeout(() => { // garante que o DOM foi renderizado
                this.setupCanvas();
                this.drawBase();
                if (this.wrongParts > 0) this.drawExistingParts();
            });
        }
    }

    drawExistingParts() {
        for (let i = 1; i <= this.wrongParts; i++) {
            this.drawPart(i);
        }
    }



    // --- Entrada por teclado físico ---
    @HostListener('window:keydown', ['$event'])
    onKeyPress(event: KeyboardEvent) {
        const key = event.key.toUpperCase();
        if (this.gameOver) return;

        if (key.length === 1 && /[A-ZÇ]/.test(key)) {
            this.tryLetter(key);
        } else if (key === 'ENTER') {
            this.submitWord();
        }
    }

    // --- Lógica do jogo ---
    newGame() {
        this.secretWord = this.forcaService.getRandomWord(); // 🔹 vem do service
        this.displayLetters = Array(this.secretWord.length).fill('');
        this.usedLetters.clear();
        this.wrongParts = 0;
        this.gameOver = false;
        this.lastPoints = null;
        this.clearCanvas();
        this.drawBase();
        this.startTimer();
        this.toastr.info('Novo jogo iniciado!');
    }

    tryLetter(l: string) {
        if (this.gameOver || this.usedLetters.has(l)) return;

        // 🔁 Resetar o tempo a cada jogada
        this.timeRemaining = this.totalTime;

        this.usedLetters.add(l);

        if (this.secretWord.includes(l)) {
            this.secretWord.split('').forEach((c, i) => {
                if (c === l) this.displayLetters[i] = c;
            });
            if (this.displayLetters.every(ch => ch !== '')) this.win();
        } else {
            this.registerWrong();
        }
    }


    submitWord() {
        if (this.gameOver) return;
        if (this.guessWord.trim().toUpperCase() === this.secretWord) this.win();
        else this.registerWrong();
        this.guessWord = '';
    }

    giveUp() {
        if (this.gameOver) return;
        this.reveal();
        this.endGame();
        this.toastr.info('Você desistiu!');
    }

    nextRound() {
        if (!this.gameOver) return;
        this.newGame();
    }

    private registerWrong() {
        this.wrongParts++;
        this.drawPart(this.wrongParts);
        if (this.wrongParts >= this.maxParts) this.lose();
    }

    private win() {
        this.lastPoints = this.calculatePoints();
        this.toastr.success(`Você venceu! ${this.lastPoints} pontos`);
        this.updateFakeRanking();
        this.celebrate();
        this.endGame();
    }

    private lose() {
        this.reveal();
        this.toastr.error(`Você perdeu! A palavra era ${this.secretWord}`);
        this.fadeRed();
        this.endGame();
    }

    private reveal() {
        this.displayLetters = this.secretWord.split('');
    }

    private calculatePoints(): number {
        const base = 100;
        const penalty = this.wrongParts * 10;
        const bonus = this.displayLetters.every(ch => ch !== '') ? 20 : 0;
        return Math.max(0, base - penalty + bonus);
    }

    private updateFakeRanking() {
        this.fakeRanking[this.fakeRanking.length - 1].score = this.lastPoints ?? 0;
        this.fakeRanking.sort((a, b) => b.score - a.score);
    }

    private endGame() {
        this.gameOver = true;
        this.clearTimer();
    }

    // --- Timer ---
    private startTimer() {
        this.clearTimer();
        this.timeRemaining = this.totalTime;
        this.timerHandle = setInterval(() => {
            if (this.gameOver) {
                this.clearTimer();
                return;
            }
            this.timeRemaining--;
            if (this.timeRemaining <= 0) {
                this.registerWrong();
                this.timeRemaining = this.totalTime;
            }
        }, 1000);
    }

    private clearTimer() {
        if (this.timerHandle) {
            clearInterval(this.timerHandle);
            this.timerHandle = null;
        }
    }

    // --- Canvas ---
    private setupCanvas() {
        const canvas = this.canvasRef.nativeElement;
        this.ctx = canvas.getContext('2d')!;
        const dpr = window.devicePixelRatio || 1;
        const w = canvas.width, h = canvas.height;
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        this.ctx.scale(dpr, dpr);
        this.ctx.lineWidth = 4;
        this.ctx.strokeStyle = '#2c3e50';
        this.ctx.lineCap = 'round';
    }

    private clearCanvas() {
        const c = this.canvasRef.nativeElement;
        this.ctx.clearRect(0, 0, c.width, c.height);
    }

    private drawBase() {
        const ctx = this.ctx;
        ctx.beginPath();
        ctx.moveTo(40, 300);
        ctx.lineTo(300, 300);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(80, 300);
        ctx.lineTo(80, 60);
        ctx.lineTo(220, 60);
        ctx.lineTo(220, 100);
        ctx.stroke();
    }

    private drawPart(n: number) {
        const ctx = this.ctx;
        ctx.strokeStyle = '#b23b3b';
        switch (n) {
            case 1: this.circle(220, 120, 20); break;
            case 2: this.line(220, 140, 220, 200); break;
            case 3: this.line(220, 150, 190, 180); break;
            case 4: this.line(220, 150, 250, 180); break;
            case 5: this.line(220, 200, 195, 240); break;
            case 6: this.line(220, 200, 245, 240); break;
        }
    }

    private line(x1: number, y1: number, x2: number, y2: number) {
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();
    }

    private circle(x: number, y: number, r: number) {
        this.ctx.beginPath();
        this.ctx.arc(x, y, r, 0, Math.PI * 2);
        this.ctx.stroke();
    }

    // --- Efeitos ---
    private celebrate() {
        const ctx = this.ctx;
        const c = this.canvasRef.nativeElement;
        let alpha = 0;
        const animate = () => {
            alpha += 0.02;
            ctx.fillStyle = `rgba(0,200,83,${Math.min(alpha, 0.3)})`;
            ctx.fillRect(0, 0, c.width / (window.devicePixelRatio || 1), c.height / (window.devicePixelRatio || 1));
            if (alpha < 0.3) requestAnimationFrame(animate);
        };
        animate();
    }

    private fadeRed() {
        const ctx = this.ctx;
        const c = this.canvasRef.nativeElement;
        let alpha = 0;
        const animate = () => {
            alpha += 0.03;
            ctx.fillStyle = `rgba(178,59,59,${Math.min(alpha, 0.35)})`;
            ctx.fillRect(0, 0, c.width / (window.devicePixelRatio || 1), c.height / (window.devicePixelRatio || 1));
            if (alpha < 0.35) requestAnimationFrame(animate);
        };
        animate();
    }
}
