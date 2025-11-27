import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { CacaPalavrasService } from '../../../pages/games/services/caca-palavras.service';

declare var bootstrap: any;

interface PalavraModel {
    palavra: string;
    level: string;
}

interface CacaSettings {
    minGrid: number;
    maxGrid: number;
    allowDiagonals: boolean;
    allowReverse: boolean;
    maxPlacementAttempts: number;
    timeLimitSec: number | null;
    baseScorePerWord: number;
}

@Component({
    selector: 'app-caca-palavras-config',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, FormsModule],
    templateUrl: './caca-palavras-config.component.html',
    styleUrls: ['./caca-palavras-config.component.scss']
})
export class CacaPalavrasConfigComponent implements OnInit, OnDestroy {

    allWords: PalavraModel[] = [];
    filteredWords: PalavraModel[] = [];
    filtro = '';

    wordModalInstance: any;
    settingsModalInstance: any;

    wordForm: FormGroup;
    settingsForm: FormGroup;

    editingIndex: number | null = null;

    niveis = ['Fácil', 'Médio', 'Difícil', 'Muito Difícil', 'Especialista'];

    defaultSettings: CacaSettings = {
        minGrid: 12,
        maxGrid: 20,
        allowDiagonals: true,
        allowReverse: true,
        maxPlacementAttempts: 200,
        timeLimitSec: null,
        baseScorePerWord: 100
    };

    settings: CacaSettings = { ...this.defaultSettings };

    constructor(
        private fb: FormBuilder,
        private service: CacaPalavrasService
    ) {
        this.wordForm = this.fb.group({
            palavra: ['', [Validators.required, Validators.minLength(2)]],
            level: ['Fácil', Validators.required]
        });

        this.settingsForm = this.fb.group({
            minGrid: [this.defaultSettings.minGrid, [Validators.required, Validators.min(5)]],
            maxGrid: [this.defaultSettings.maxGrid, [Validators.required, Validators.min(6)]],
            allowDiagonals: [this.defaultSettings.allowDiagonals],
            allowReverse: [this.defaultSettings.allowReverse],
            maxPlacementAttempts: [this.defaultSettings.maxPlacementAttempts, [Validators.required, Validators.min(10)]],
            timeLimitSec: [this.defaultSettings.timeLimitSec],
            baseScorePerWord: [this.defaultSettings.baseScorePerWord, [Validators.required, Validators.min(1)]],
        });
    }

    ngOnInit(): void {
        // carregar palavras do serviço
        if ((this.service as any).getAllWords)
            this.allWords = (this.service as any).getAllWords();
        else if ((this.service as any).getPalavras)
            this.allWords = this.service.getPalavras().map((p: string) => ({
                palavra: p.toUpperCase(),
                level: 'Médio'
            }));

        this.filteredWords = [...this.allWords];

        // carregar configurações
        if ((this.service as any).getSettings) {
            const s = (this.service as any).getSettings();
            if (s) this.settings = { ...this.defaultSettings, ...s };
        }

        this.settingsForm.patchValue(this.settings);

        // iniciar modais
        setTimeout(() => {
            const wm = document.getElementById('wordModal');
            if (wm) this.wordModalInstance = new bootstrap.Modal(wm);

            const sm = document.getElementById('settingsModal');
            if (sm) this.settingsModalInstance = new bootstrap.Modal(sm);
        }, 50);
    }

    ngOnDestroy(): void {
        this.wordModalInstance?.hide();
        this.settingsModalInstance?.hide();
    }

    aplicarFiltro() {
        const q = (this.filtro || '').trim().toLowerCase();
        if (!q) {
            this.filteredWords = [...this.allWords];
            return;
        }
        this.filteredWords = this.allWords.filter(w =>
            w.palavra.toLowerCase().includes(q)
        );
    }

    novaPalavra() {
        this.editingIndex = null;
        this.wordForm.reset({ palavra: '', level: 'Fácil' });
        this.wordModalInstance?.show();
    }

    editarPalavra(idx: number) {
        this.editingIndex = idx;
        this.wordForm.setValue({ ...this.allWords[idx] });
        this.wordModalInstance?.show();
    }

    salvarPalavra() {
        if (this.wordForm.invalid) {
            this.wordForm.markAllAsTouched();
            return;
        }

        const model: PalavraModel = {
            palavra: this.wordForm.value.palavra.trim().toUpperCase(),
            level: this.wordForm.value.level
        };

        if (this.editingIndex !== null) {
            this.allWords[this.editingIndex] = model;
            if ((this.service as any).updateWord) (this.service as any).updateWord(this.editingIndex, model);
        } else {
            this.allWords.unshift(model);
            if ((this.service as any).addWord) (this.service as any).addWord(model);
        }

        this.aplicarFiltro();
        this.wordModalInstance?.hide();
    }

    removerPalavra(idx: number) {
        const w = this.allWords[idx];
        if (!confirm(`Excluir a palavra "${w.palavra}" ?`)) return;

        if ((this.service as any).removeWord) (this.service as any).removeWord(idx);

        this.allWords.splice(idx, 1);
        this.aplicarFiltro();
    }

    removerSelecionadas() {
        if (!confirm(`Excluir ${this.filteredWords.length} palavras filtradas?`)) return;
        const ids = new Set(this.filteredWords.map(w => w.palavra));

        this.allWords = this.allWords.filter(w => !ids.has(w.palavra));

        if ((this.service as any).setAllWords) (this.service as any).setAllWords(this.allWords);

        this.aplicarFiltro();
    }

    abrirSettings() {
        this.settingsModalInstance?.show();
    }

    salvarSettings() {
        const val = this.settingsForm.value;
        this.settings = { ...this.settings, ...val };

        if ((this.service as any).saveSettings)
            (this.service as any).saveSettings(this.settings);

        this.settingsModalInstance?.hide();
    }

    exportJson() {
        const payload = {
            words: this.allWords,
            settings: this.settings
        };
        const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'caca-palavras-config.json';
        a.click();
        URL.revokeObjectURL(url);
    }

    importJson(ev: Event) {
        const input = ev.target as HTMLInputElement;
        if (!input.files?.length) return;

        const file = input.files[0];
        const reader = new FileReader();

        reader.onload = () => {
            try {
                const parsed = JSON.parse(String(reader.result));

                if (Array.isArray(parsed.words)) {
                    this.allWords = parsed.words;
                    if ((this.service as any).setAllWords) (this.service as any).setAllWords(this.allWords);
                }

                if (parsed.settings) {
                    this.settings = { ...this.settings, ...parsed.settings };
                    this.settingsForm.patchValue(this.settings);

                    if ((this.service as any).saveSettings)
                        (this.service as any).saveSettings(this.settings);
                }

                this.aplicarFiltro();
                alert("Importação concluída!");
            } catch {
                alert("Erro ao importar JSON");
            }
        };

        reader.readAsText(file);
    }
}
