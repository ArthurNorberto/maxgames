import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MemoriaService } from '../../../pages/games/services/memoria.service';
declare var bootstrap: any;


@Component({
    selector: 'app-memoria-admin',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './memoria-admin.component.html',
    styleUrls: ['./memoria-admin.component.scss']
})
export class MemoriaAdminComponent implements OnInit {

    filtro = '';
    todas: string[] = [];
    filtrados: string[] = [];

    model = '';
    editando = false;
    originalValue = '';
    modalInstance: any;


    constructor(private memoriaService: MemoriaService) { }

    ngOnInit() {
        this.todas = [...this.memoriaService['todasPalavras']];
        this.filtrados = [...this.todas];

        const modalEl = document.getElementById('modalPalavra')!;
        this.modalInstance = new bootstrap.Modal(modalEl, { backdrop: 'static' });
    }

    atualizarLista() {
        if (!this.filtro.trim()) {
            this.filtrados = [...this.todas];
            return;
        }

        const f = this.filtro.toLowerCase();
        this.filtrados = this.todas.filter(x => x.toLowerCase().includes(f));
    }

    novaPalavra() {
        this.editando = false;
        this.model = '';
        this.modalInstance.show();
    }

    editar(item: string) {
        this.editando = true;
        this.model = item;
        this.originalValue = item;
        this.modalInstance.show();
    }

    remover(item: string) {
        if (!confirm(`Excluir a palavra "${item}"?`)) return;

        this.todas = this.todas.filter(x => x !== item);
        this.atualizarLista();
    }

    salvar() {
        if (!this.model.trim()) return;

        if (this.editando) {
            const index = this.todas.indexOf(this.originalValue);
            if (index >= 0) this.todas[index] = this.model;
        } else {
            this.todas.push(this.model);
        }
        this.modalInstance.hide();
        this.atualizarLista();
    }
}
