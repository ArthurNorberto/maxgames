import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Usuario, UsuariosService } from '../../../pages/services/usuarios.service';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-left-sidebar',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './left-sidebar.component.html',
    styleUrls: ['./left-sidebar.component.scss']
})
export class LeftSidebarComponent implements OnInit {
    user: Usuario | null = null;

    constructor(
        private usuariosService: UsuariosService
    ) {

    }
    ngOnInit(): void {
        this.usuariosService.getUsuarioAtual()
            .subscribe(u => this.user = u);
    }
}
