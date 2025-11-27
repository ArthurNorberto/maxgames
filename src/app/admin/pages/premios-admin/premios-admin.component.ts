import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Premio, PremiosService } from '../../../pages/services/premios.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-premios-admin',
    imports: [FormsModule, CommonModule, ReactiveFormsModule],
    templateUrl: './premios-admin.component.html',
    styleUrls: ['./premios-admin.component.scss']
})
export class PremiosAdminComponent {

    premios: Premio[] = [];
    form!: FormGroup;
    editMode = false;
    selectedPremio: Premio | null = null;

    iconesDisponiveis = [
        'bi-stars', 'bi-laptop', 'bi-person-check', 'bi-ticket-perforated',
        'bi-cup-hot', 'bi-gift', 'bi-car-front-fill', 'bi-patch-check-fill',
        'bi-wallet2', 'bi-briefcase-fill', 'bi-house-door-fill',
        'bi-emoji-smile-fill', 'bi-gift-fill', 'bi-star-fill',
        'bi-people-fill', 'bi-emoji-heart-eyes-fill'
    ];

    constructor(
        private premiosService: PremiosService,
        private fb: FormBuilder
    ) { }

    ngOnInit(): void {
        this.premios = [...this.premiosService.getPremios()];
        this.initForm();
    }

    initForm() {
        this.form = this.fb.group({
            titulo: ['', Validators.required],
            descricao: ['', Validators.required],
            pontos: [0, [Validators.required, Validators.min(1)]],
            icone: ['', Validators.required],
            destaque: [false]
        });
    }

    abrirNovo() {
        this.editMode = false;
        this.selectedPremio = null;
        this.form.reset({ destaque: false });
    }

    editarPremio(premio: Premio) {
        this.editMode = true;
        this.selectedPremio = premio;
        this.form.patchValue(premio);
    }

    salvar() {
        if (!this.form.valid) return;

        const dados = this.form.value;

        if (this.editMode && this.selectedPremio) {
            Object.assign(this.selectedPremio, dados);
        } else {
            this.premios.push({
                id: Math.max(...this.premios.map(p => p.id)) + 1,
                ...dados
            });
        }
    }

    removerPremio(premio: Premio) {
        this.premios = this.premios.filter(p => p.id !== premio.id);
    }
}
