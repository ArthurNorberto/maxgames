import { Injectable } from '@angular/core';

export interface PalavraCruzadaItem {
    palavra: string;
    dica: string;
}

export interface PalavrasCruzadasSettings {
    minGrid: number;
    maxGrid: number;
    timeLimitSec: number;
    allowHints: boolean;
    wordsPerGame: number;
}

@Injectable({
    providedIn: 'root'
})
export class PalavrasCruzadasService {
    private palavras: PalavraCruzadaItem[] = [
        { palavra: 'CARRO', dica: 'Veículo automotor' },
        { palavra: 'PORTA', dica: 'Você abre para entrar' },
        { palavra: 'FAROL', dica: 'Ilumina à noite' },
        { palavra: 'MOTOR', dica: 'Faz o carro se mover' },
        { palavra: 'BATERIA', dica: 'Fonte de energia' }
    ];

    getPalavras(): PalavraCruzadaItem[] {
        return [...this.palavras];
    }
}
