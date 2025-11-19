import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Usuario } from '../../../services/usuarios.service';

@Component({
    selector: 'app-perfil-gamificacao',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './perfil-gamificacao.component.html',
    styleUrls: ['./perfil-gamificacao.component.scss']
})
export class PerfilGamificacaoComponent {
    @Input() usuario!: Usuario;
}
