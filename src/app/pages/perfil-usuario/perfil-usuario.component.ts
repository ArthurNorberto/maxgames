import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Usuario, UsuariosService } from '../services/usuarios.service';
import { map, switchMap } from 'rxjs';
import { PerfilElogioFormComponent } from './componentes/perfil-elogio-form/perfil-elogio-form.component';
import { PerfilFeedComponent } from './componentes/perfil-feed/perfil-feed.component';
import { PerfilGamificacaoComponent } from './componentes/perfil-gamificacao/perfil-gamificacao.component';
import { PerfilHeaderComponent } from './componentes/perfil-header/perfil-header.component';
import { PerfilInfoComponent } from './componentes/perfil-info/perfil-info.component';

@Component({
    selector: 'app-perfil-usuario',
    standalone: true,
    imports: [CommonModule, PerfilElogioFormComponent, PerfilFeedComponent, PerfilGamificacaoComponent, PerfilHeaderComponent, PerfilInfoComponent],
    templateUrl: './perfil-usuario.component.html',
    styleUrls: ['./perfil-usuario.component.scss']
})
export class PerfilUsuarioComponent implements OnInit {

    usuario: Usuario | null = null;

    constructor(
        private route: ActivatedRoute,
        private usuariosService: UsuariosService
    ) { }

    ngOnInit(): void {
        this.route.paramMap
            .pipe(
                switchMap(params => {
                    const id = params.get('id')!;
                    return this.usuariosService.getUsuarios()
                        .pipe(map(lista => lista.find(u => u.id === id) || null));
                })
            )
            .subscribe(usuario => this.usuario = usuario);
    }


}
