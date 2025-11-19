import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Usuario } from '../../../services/usuarios.service';

@Component({
    selector: 'app-perfil-info',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './perfil-info.component.html',
    styleUrls: ['./perfil-info.component.scss']
})
export class PerfilInfoComponent {
    @Input() usuario!: Usuario;
}
