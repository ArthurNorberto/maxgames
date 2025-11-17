import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UsuariosService, Usuario } from '../services/usuarios.service';
import { map } from 'rxjs';

@Component({
    selector: 'app-ranks',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './ranks.component.html',
    styleUrls: ['./ranks.component.scss']
})
export class RanksComponent {

    activeTab: 'equipe' | 'setor' | 'geral' = 'equipe';

    rankEquipe: Usuario[] = [];
    rankSetor: Usuario[] = [];
    rankGeral: Usuario[] = [];

    constructor(
        private router: Router,
        private usuariosService: UsuariosService
    ) {
        this.loadRanks();
    }

    loadRanks() {
        // Ranking Geral (já vem ordenado no service)
        this.usuariosService.getRanking().subscribe(r => this.rankGeral = r);

        // Ranking por setor
        this.usuariosService.getRanking().subscribe(r => {
            this.rankSetor = r.filter(u => u.sector === 'Atendimento' || u.sector === 'Comercial');
        });

        // Ranking da Equipe (mock: apenas primeiros 5)
        this.usuariosService.getRanking().subscribe(r => {
            this.rankEquipe = r.slice(0, 5);
        });
    }
}
