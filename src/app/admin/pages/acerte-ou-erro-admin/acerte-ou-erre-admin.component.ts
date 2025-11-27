import { Component, OnInit } from '@angular/core';
import { PerguntaAcerteOuErre, AcerteOuErreService } from '../../../pages/games/services/acerte-ou-erre.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

declare var bootstrap: any;

@Component({
    selector: 'app-acerte-ou-erre-admin',
    imports: [CommonModule, FormsModule],
    templateUrl: './acerte-ou-erre-admin.component.html',
    styleUrls: ['./acerte-ou-erre-admin.component.scss']
})
export class AcerteOuErreAdminComponent implements OnInit {

    filtro = '';
    filtrados: PerguntaAcerteOuErre[] = [];

    modal: any; // bootstrap modal
    editando = false;

    model: PerguntaAcerteOuErre = {
        palavra: '',
        pergunta: '',
        level: 'Fácil'
    };

    niveis = ['Fácil', 'Médio', 'Difícil', 'Muito Difícil', 'Especialista'];

    constructor(private service: AcerteOuErreService) { }

    ngOnInit(): void {
        this.atualizarLista();

        const el = document.getElementById('modalPergunta');
        this.modal = new bootstrap.Modal(el);
    }

    atualizarLista() {
        const tudo = this.service.listar();

        if (!this.filtro.trim()) {
            this.filtrados = tudo;
            return;
        }

        const f = this.filtro.toLowerCase();
        this.filtrados = tudo.filter(x =>
            x.palavra.toLowerCase().includes(f) ||
            x.pergunta.toLowerCase().includes(f)
        );
    }

    abrirModalNova() {
        this.editando = false;
        this.model = { palavra: '', pergunta: '', level: 'Fácil' };
        this.modal.show();
    }

    abrirModalEditar(item: PerguntaAcerteOuErre) {
        this.editando = true;
        this.model = { ...item };
        this.modal.show();
    }

    remover(item: PerguntaAcerteOuErre) {
        if (!confirm(`Excluir a palavra "${item.palavra}" ?`)) return;
        this.service.remover(item);
        this.atualizarLista();
    }

    salvar() {
        if (this.editando)
            this.service.atualizar(this.model);
        else
            this.service.adicionar(this.model);

        this.modal.hide();
        this.atualizarLista();
    }

    fecharModal() {
        this.modal.hide();
    }
}
