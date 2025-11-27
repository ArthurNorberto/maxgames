import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ForcaService, ForcaSettings } from '../../../pages/games/services/forca.service';
declare var bootstrap: any;

@Component({
  selector: 'app-forca-config',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './forca-config.component.html',
  styleUrls: ['./forca-config.component.scss']
})
export class ForcaConfigComponent implements OnInit, OnDestroy {

  // words
  allWords: string[] = [];
  filteredWords: string[] = [];
  filtro = '';

  // forms
  wordForm: FormGroup;
  settingsForm: FormGroup;

  // modals
  wordModalInstance: any;
  settingsModalInstance: any;

  // editing
  editingIndex: number | null = null;

  // defaults for UI
  difficulties = ['Fácil','Médio','Difícil'];

  // local settings copy
  settings: ForcaSettings;

  constructor(
    private fb: FormBuilder,
    private forcaService: ForcaService
  ) {
    // forms
    this.wordForm = this.fb.group({
      palavra: ['', [Validators.required, Validators.minLength(2)]]
    });

    const s = this.forcaService.getSettings();
    this.settings = s;

    this.settingsForm = this.fb.group({
      timePerRound: [s.timePerRound, [Validators.required, Validators.min(1)]],
      resetOnCorrect: [s.resetOnCorrect],
      penaltySeconds: [s.penaltySeconds, [Validators.required, Validators.min(0)]],
      maxParts: [s.maxParts, [Validators.required, Validators.min(1), Validators.max(12)]],
      allowAccents: [s.allowAccents],
      allowCedilla: [s.allowCedilla],
      showHint: [s.showHint],
      showLengthBeforeStart: [s.showLengthBeforeStart]
    });
  }

  ngOnInit(): void {
    this.loadWords();
    // init modals after view exists
    setTimeout(() => {
      const wEl = document.getElementById('wordModal');
      if (wEl) this.wordModalInstance = new bootstrap.Modal(wEl);

      const sEl = document.getElementById('settingsModal');
      if (sEl) this.settingsModalInstance = new bootstrap.Modal(sEl);
    }, 50);
  }

  ngOnDestroy(): void {
    this.wordModalInstance?.hide();
    this.settingsModalInstance?.hide();
  }

  private loadWords() {
    this.allWords = this.forcaService.getAllWords();
    this.filteredWords = [...this.allWords];
  }

  aplicarFiltro() {
    const q = (this.filtro || '').trim().toLowerCase();
    if (!q) { this.filteredWords = [...this.allWords]; return; }
    this.filteredWords = this.allWords.filter(w => w.toLowerCase().includes(q));
  }

  // ----- Words CRUD -----
  novaPalavra() {
    this.editingIndex = null;
    this.wordForm.reset({ palavra: '' });
    this.wordModalInstance?.show();
  }

  editarPalavra(idx: number) {
    this.editingIndex = idx;
    const w = this.allWords[idx] || '';
    this.wordForm.setValue({ palavra: w });
    this.wordModalInstance?.show();
  }

  salvarPalavra() {
    if (this.wordForm.invalid) {
      this.wordForm.markAllAsTouched();
      return;
    }
    const palavra = (this.wordForm.value.palavra || '').toString().trim().toUpperCase();
    if (!palavra) return;

    if (this.editingIndex !== null && this.editingIndex >= 0) {
      this.forcaService.updateWord(this.editingIndex, palavra);
      this.allWords[this.editingIndex] = palavra;
    } else {
      this.forcaService.addWord(palavra);
      this.allWords.unshift(palavra);
    }

    this.aplicarFiltro();
    this.wordModalInstance?.hide();
  }

  removerPalavra(idx: number) {
    const w = this.allWords[idx];
    if (!w) return;
    if (!confirm(`Remover a palavra "${w}" ?`)) return;
    this.forcaService.removeWord(idx);
    this.allWords.splice(idx, 1);
    this.aplicarFiltro();
  }

  // bulk import/export
  exportJson() {
    const payload = { words: this.allWords, settings: this.settingsForm.value };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'forca-config.json';
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
        if (parsed.words && Array.isArray(parsed.words)) {
          this.allWords = parsed.words.map((w: any) => (w || '').toString().toUpperCase());
          this.forcaService.setAllWords(this.allWords);
        }
        if (parsed.settings) {
          this.settingsForm.patchValue(parsed.settings);
          this.forcaService.saveSettings(parsed.settings);
        }
        this.aplicarFiltro();
        alert('Importação concluída');
      } catch {
        alert('Arquivo inválido');
      }
    };
    reader.readAsText(file);
    input.value = '';
  }

  // ----- Settings -----
  abrirSettings() {
    this.settingsModalInstance?.show();
  }

  salvarSettings() {
    if (this.settingsForm.invalid) {
      this.settingsForm.markAllAsTouched();
      return;
    }
    const s: ForcaSettings = {
      ...this.forcaService.getSettings(),
      ...this.settingsForm.value
    };
    this.forcaService.saveSettings(s);
    this.settings = s;
    this.settingsModalInstance?.hide();
    alert('Configurações salvas');
  }

  // quick helpers
  adicionarExemplo() {
    const exemplos = ['PARAFUSO','BUJÃO','ENGRENAGEM','SENSOR','CARGO'];
    for (const e of exemplos) {
      if (!this.allWords.includes(e)) this.allWords.unshift(e);
    }
    this.forcaService.setAllWords(this.allWords);
    this.aplicarFiltro();
  }
}
