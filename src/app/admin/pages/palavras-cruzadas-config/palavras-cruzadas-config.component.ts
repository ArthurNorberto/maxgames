import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { PalavraCruzadaItem, PalavrasCruzadasService, PalavrasCruzadasSettings } from '../../../pages/games/services/palavras-cruzadas.service';

declare var bootstrap: any;



@Component({
    selector: 'app-palavras-cruzadas-config',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    templateUrl: './palavras-cruzadas-config.component.html',
})
export class PalavrasCruzadasConfigComponent implements OnInit {

    niveis = ['Fácil', 'Médio', 'Difícil']; // caso queira níveis depois

    allWords: PalavraCruzadaItem[] = [];
    filteredWords: PalavraCruzadaItem[] = [];

    filtro = '';
    editingIndex: number | null = null;

    wordForm: any;
    settingsForm: any;

    wordModalInstance: any;
    settingsModalInstance: any;

    constructor(
        private fb: FormBuilder,
        private service: PalavrasCruzadasService
    ) { }

    ngOnInit() {
        this.allWords = [...this.service.getPalavras()];
        this.filteredWords = [...this.allWords];

        this.wordForm = this.fb.group({
            palavra: ['', [Validators.required, Validators.minLength(2)]],
            dica: ['', [Validators.required, Validators.minLength(3)]]
        });

        this.settingsForm = this.fb.group({
            minGrid: [10, Validators.required],
            maxGrid: [20, Validators.required],
            timeLimitSec: [300],
            allowHints: [true],
            wordsPerGame: [8, Validators.required]
        });
    }

    aplicarFiltro() {
        const f = this.filtro.toLowerCase();
        this.filteredWords = this.allWords.filter(w =>
            w.palavra.toLowerCase().includes(f) || w.dica.toLowerCase().includes(f)
        );
    }

    novaPalavra() {
        this.editingIndex = null;
        this.wordForm.reset({ palavra: '', dica: '' });

        this.openWordModal();
    }

    editarPalavra(index: number) {
        this.editingIndex = index;
        const item = this.allWords[index];
        this.wordForm.patchValue(item);
        this.openWordModal();
    }

    salvarPalavra() {
        if (this.wordForm.invalid) return;

        const value = this.wordForm.value as PalavraCruzadaItem;

        if (this.editingIndex === null) {
            this.allWords.push(value);
        } else {
            this.allWords[this.editingIndex] = value;
        }

        this.aplicarFiltro();
        this.wordModalInstance.hide();
    }

    removerPalavra(index: number) {
        this.allWords.splice(index, 1);
        this.aplicarFiltro();
    }

    removerFiltradas() {
        const nomes = new Set(this.filteredWords.map(w => w.palavra));
        this.allWords = this.allWords.filter(w => !nomes.has(w.palavra));
        this.aplicarFiltro();
    }

    // ----------------------------
    // Modal helpers
    // ----------------------------

    abrirSettings() {
        this.openSettingsModal();
    }

    openWordModal() {
        const modalEl = document.getElementById('wordModal');
        this.wordModalInstance = new bootstrap.Modal(modalEl);
        this.wordModalInstance.show();
    }

    openSettingsModal() {
        const modalEl = document.getElementById('settingsModal');
        this.settingsModalInstance = new bootstrap.Modal(modalEl);
        this.settingsModalInstance.show();
    }

    salvarSettings() {
        if (this.settingsForm.invalid) return;

        const settings = this.settingsForm.value as PalavrasCruzadasSettings;

        console.log('Salvando settings:', settings);
        this.settingsModalInstance.hide();
    }

    // ----------------------------
    // Export / import
    // ----------------------------

    exportJson() {
        const data = {
            words: this.allWords,
            settings: this.settingsForm.value
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'palavras-cruzadas-config.json';
        a.click();
    }

    importJson(event: any) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            try {
                const obj = JSON.parse(reader.result as string);
                this.allWords = obj.words ?? [];
                this.settingsForm.patchValue(obj.settings ?? {});
                this.aplicarFiltro();
            } catch {
                alert('Arquivo inválido.');
            }
        };

        reader.readAsText(file);
    }
}
