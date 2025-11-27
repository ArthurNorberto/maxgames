import { Injectable } from '@angular/core';

export interface ForcaSettings {
    timePerRound: number;         // segundos por rodada
    resetOnCorrect: boolean;      // reseta tempo ao acertar letra
    penaltySeconds: number;       // penalidade por erro (segundos)
    maxParts: number;             // número de partes do boneco (erros até perder)
    allowAccents: boolean;        // aceitar/normalizar acentos (opção)
    allowCedilla: boolean;        // aceitar Ç (opção)
    showHint: boolean;            // mostrar dica (ex.: primeira letra)
    showLengthBeforeStart: boolean; // mostrar número de letras antes começar
    difficultyMap?: { [k: string]: { minLen: number; maxLen: number; multiplier: number } };
}

const DEFAULT_SETTINGS: ForcaSettings = {
    timePerRound: 20,
    resetOnCorrect: true,
    penaltySeconds: 0,
    maxParts: 6,
    allowAccents: true,
    allowCedilla: true,
    showHint: false,
    showLengthBeforeStart: true,
    difficultyMap: {
        Fácil: { minLen: 3, maxLen: 5, multiplier: 1 },
        Médio: { minLen: 6, maxLen: 8, multiplier: 1.3 },
        Difícil: { minLen: 9, maxLen: 20, multiplier: 1.6 }
    }
};

@Injectable({
    providedIn: 'root'
})
export class ForcaService {

    private STORAGE_WORDS_KEY = 'forca_words_v1';
    private STORAGE_SETTINGS_KEY = 'forca_settings_v1';


    private wordsInternal = [
        'PNEU',
        'MOTOR',
        'VIDRO',
        'PARABRISA',
        'RETROVISOR',
        'FREIO',
        'BATERIA',
        'AIRBAG',
        'CINTA',
        'VOLANTE',
        'CARROCERIA',
        'AMORTECEDOR',
        'FAROL',
        'ESCAPAMENTO',
        'PORTA',
        'PAINEL',
        'CAPO',
        'RODA',
        'LANTERNA',
        "APÓLICE",
        "FRANQUIA",
        "SEGURADORA",
        "SINISTRO",
        "CORRETOR",
        "VIDRACARIA",
        "CALIBRAGEM",
        "ALINHAMENTO",
        "BALANCEAMENTO",
        "GUINCHO",
        "LATARIA",
        "CHASSI",
        "LICENCIAMENTO",
        "DOCUMENTACAO",
        "INSPECAO",
        "CRISTAL",
        "PELICULA",
        "DESPACHANTE",
        "OFICINA",
        "CLIENTE",
        "PARACHOQUE",
        "EMBREAGEM",
        "TRANSMISSAO",
        "VEICULO",
        "CONSERTOS",
        "REPARO",
        "POLIMENTO",
        "LIMPEZA",
        "VISTORIA",
        "APROVACAO",
        "ORCAMENTO",
        "ATENDIMENTO",
        "COTIZACAO",
        "REBOQUE",
        "AGENDAMENTO",
        "COBERTURA",
        "GARANTIA",
        "REVISAO",
        "MANUTENCAO",
        "PROTECAO"
    ];

    constructor() {
        this.loadWordsFromStorage();
        this.loadSettingsFromStorage();
    }

    // ---------- persistence ----------
    private saveWordsToStorage() {
        try { localStorage.setItem(this.STORAGE_WORDS_KEY, JSON.stringify(this.wordsInternal)); } catch { }
    }
    private loadWordsFromStorage() {
        try {
            const raw = localStorage.getItem(this.STORAGE_WORDS_KEY);
            if (raw) this.wordsInternal = JSON.parse(raw).map((w: string) => (w || '').toString().toUpperCase());
        } catch { /* ignore */ }
    }

    private saveSettingsToStorage(s: ForcaSettings) {
        try { localStorage.setItem(this.STORAGE_SETTINGS_KEY, JSON.stringify(s)); } catch { }
    }
    private loadSettingsFromStorage(): ForcaSettings | null {
        try {
            const raw = localStorage.getItem(this.STORAGE_SETTINGS_KEY);
            if (!raw) return null;
            return JSON.parse(raw) as ForcaSettings;
        } catch { return null; }
    }

    // ---------- words CRUD ----------
    getAllWords(): string[] {
        this.loadWordsFromStorage();
        return [...this.wordsInternal];
    }

    setAllWords(list: string[]) {
        this.wordsInternal = list.map(w => (w || '').toString().toUpperCase());
        this.saveWordsToStorage();
    }

    addWord(word: string) {
        const w = (word || '').toString().toUpperCase().trim();
        if (!w) return;
        this.wordsInternal.unshift(w);
        this.saveWordsToStorage();
    }

    updateWord(index: number, word: string) {
        const w = (word || '').toString().toUpperCase().trim();
        if (!w) return;
        if (index >= 0 && index < this.wordsInternal.length) {
            this.wordsInternal[index] = w;
            this.saveWordsToStorage();
        }
    }

    removeWord(index: number) {
        if (index >= 0 && index < this.wordsInternal.length) {
            this.wordsInternal.splice(index, 1);
            this.saveWordsToStorage();
        }
    }

    getRandomWord(settings?: ForcaSettings, difficulty?: 'Fácil' | 'Médio' | 'Difícil'): string {
        this.loadWordsFromStorage();
        let pool = [...this.wordsInternal];

        // filter by difficulty if provided
        if (settings && difficulty && settings.difficultyMap && settings.difficultyMap[difficulty]) {
            const m = settings.difficultyMap[difficulty];
            pool = pool.filter(w => w.length >= m.minLen && w.length <= m.maxLen);
            if (!pool.length) pool = [...this.wordsInternal]; // fallback
        }

        const index = Math.floor(Math.random() * pool.length);
        return (pool[index] || '').toUpperCase();
    }

    // ---------- settings ----------
    getSettings(): ForcaSettings {
        const saved = this.loadSettingsFromStorage();
        return { ...DEFAULT_SETTINGS, ...(saved || {}) };
    }

    saveSettings(s: ForcaSettings) {
        const merged = { ...DEFAULT_SETTINGS, ...(s || {}) };
        this.saveSettingsToStorage(merged);
    }
}
