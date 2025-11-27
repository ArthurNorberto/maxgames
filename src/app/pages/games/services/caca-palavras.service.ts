import { Injectable } from '@angular/core';

// adicionar ao caca-palavras.service.ts (acima do export class)
export interface CacaSettings {
    minGrid: number;
    maxGrid: number;
    allowDiagonals: boolean;
    allowReverse: boolean;
    maxPlacementAttempts: number;
    timeLimitSec: number | null;
    baseScorePerWord: number;
    difficultyMap?: { [k: string]: number };
}


@Injectable({
    providedIn: 'root'
})
export class CacaPalavrasService {


    private STORAGE_WORDS_KEY = 'caca_palavras_words_v1';
    private STORAGE_SETTINGS_KEY = 'caca_palavras_settings_v1';


    private todasPalavras: string[] = [
        'VIDRO', 'RODAS', 'MOTOR', 'FREIO', 'BANCO', 'PORTA', 'PARABRISA',
        'RETROVISOR', 'LANTERNA', 'ALINHAMENTO', 'BALANCEAMENTO', 'CAPOTAS',
        'CAMBIO', 'EMBREAGEM', 'SUSPENSAO', 'PNEU', 'AIRBAG', 'BATERIA',
        'POLIMENTO', 'LIMPADOR', 'SEGURO', 'CARRO', 'AUTOGLASS', 'OFICINA',
        'REVISAO', 'OLEO', 'ESCAPAMENTO', 'AMORTECEDOR', 'ESTEPE', 'PAINEL',
        'LATARIA', 'GUINCHO', 'SINISTRO', 'APOLICE', 'FRANQUIA', 'COBERTURA',
        'CONDUTOR', 'CLIENTE', 'ASSISTENCIA', 'CORRETOR', 'VEICULO', 'SERVICO',
        'REPARO', 'GARANTIA', 'DANO', 'COLISAO', 'PROTECAO', 'MAXPAR',
        'INSPECAO', 'CHASSI', 'DOCUMENTO', 'LICENCIAMENTO', 'REGULADOR', 'OFICIAL',
        'ATENDIMENTO', 'CADASTRO', 'VISTORIA', 'TRANSPORTE', 'SEGURADORA', 'SINISTRO',
        'BLOQUEADOR', 'ALERTA', 'RASTREADOR', 'MONITORAMENTO', 'SEGURADO', 'FROTA',
        'REBOQUE', 'DESPACHANTE', 'COTACAO', 'PREMIO', 'RENOVACAO', 'COBERTOR',
        'ORCAMENTO', 'LIMITE', 'SINISTRADO', 'TELEMETRIA', 'PERITO', 'PORTAL',
        'CENTRAL', 'CREDENCIADO'
    ];


    getPalavras(): string[] {
        return this.todasPalavras;
    }


    getPalavrasAleatorias(n: number): string[] {
        const shuffled = [...this.todasPalavras].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, n);
    }

    private wordsInterno: string[] = this.todasPalavras.map(w => w.toUpperCase());

    // carregamento e persistência
    private saveWordsToStorage() {
        localStorage.setItem(this.STORAGE_WORDS_KEY, JSON.stringify(this.wordsInterno));
    }
    private loadWordsFromStorage() {
        const raw = localStorage.getItem(this.STORAGE_WORDS_KEY);
        if (raw) {
            try {
                this.wordsInterno = JSON.parse(raw);
            } catch { }
        }
    }

    private saveSettingsToStorage(s: CacaSettings) {
        localStorage.setItem(this.STORAGE_SETTINGS_KEY, JSON.stringify(s));
    }
    private loadSettingsFromStorage(): CacaSettings | null {
        const raw = localStorage.getItem(this.STORAGE_SETTINGS_KEY);
        if (!raw) return null;
        try { return JSON.parse(raw); } catch { return null; }
    }

    getAllWords(): { palavra: string; level?: string }[] {
        this.loadWordsFromStorage();
        // se quiser preservar níveis, o admin component guardará níveis; aqui retornamos apenas palavras com level padrão
        return this.wordsInterno.map(w => ({ palavra: w, level: 'Médio' }));
    }

    setAllWords(list: { palavra: string; level?: string }[]) {
        this.wordsInterno = list.map(x => (x.palavra || x).toString().toUpperCase());
        this.saveWordsToStorage();
    }

    addWord(item: { palavra: string; level?: string }) {
        this.loadWordsFromStorage();
        this.wordsInterno.unshift((item.palavra || '').toString().toUpperCase());
        this.saveWordsToStorage();
    }

    updateWord(index: number, item: { palavra: string; level?: string }) {
        this.loadWordsFromStorage();
        if (index >= 0 && index < this.wordsInterno.length) {
            this.wordsInterno[index] = (item.palavra || '').toString().toUpperCase();
            this.saveWordsToStorage();
        }
    }

    removeWord(index: number) {
        this.loadWordsFromStorage();
        if (index >= 0 && index < this.wordsInterno.length) {
            this.wordsInterno.splice(index, 1);
            this.saveWordsToStorage();
        }
    }

    getSettings(): CacaSettings | null {
        return this.loadSettingsFromStorage();
    }

    saveSettings(s: CacaSettings) {
        this.saveSettingsToStorage(s);
    }
}
