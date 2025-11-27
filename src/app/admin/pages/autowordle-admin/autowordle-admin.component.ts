import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AutowordleService } from '../../../pages/games/services/autowordle.service';
declare var bootstrap: any;

@Component({
    selector: 'app-autowordle-admin',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './autowordle-admin.component.html',
    styleUrls: ['./autowordle-admin.component.scss']
})
export class AutowordleAdminComponent implements OnInit {

    filtro = '';
    todas: string[] = [];
    filtrados: string[] = [];

    model = '';
    editando = false;
    originalValue = '';

    modal!: any;

    constructor(private autoService: AutowordleService) { }

    ngOnInit() {
        // 🔹 acessar as palavras diretamente
        this.todas = [...this.autoService['words']];
        this.filtrados = [...this.todas];

        const modalEl = document.getElementById('modalPalavra')!;
        this.modal = new bootstrap.Modal(modalEl);
    }

    atualizarLista() {
        const f = this.filtro.trim().toLowerCase();
        this.filtrados = f
            ? this.todas.filter(x => x.toLowerCase().includes(f))
            : [...this.todas];
    }

    novaPalavra() {
        this.editando = false;
        this.model = '';
        this.modal.show();
    }

    editar(item: string) {
        this.editando = true;
        this.model = item;
        this.originalValue = item;
        this.modal.show();
    }

    remover(item: string) {
        if (!confirm(`Excluir a palavra "${item}"?`)) return;

        this.todas = this.todas.filter(x => x !== item);
        this.atualizarLista();
    }

    salvar() {
        const palavra = this.model.trim().toUpperCase();
        if (!palavra) return;

        if (this.editando) {
            const i = this.todas.indexOf(this.originalValue);
            if (i >= 0) this.todas[i] = palavra;
        } else {
            this.todas.push(palavra);
        }

        this.modal.hide();
        this.atualizarLista();
    }
}
