import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Usuario } from '../../../services/usuarios.service';

@Component({
    selector: 'app-perfil-header',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './perfil-header.component.html',
    styleUrls: ['./perfil-header.component.scss']
})
export class PerfilHeaderComponent {
    @Input() usuario!: Usuario;
}
