import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Usuario } from '../../../services/usuarios.service';

@Component({
    selector: 'app-perfil-elogio-form',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './perfil-elogio-form.component.html',
    styleUrls: ['./perfil-elogio-form.component.scss']
})
export class PerfilElogioFormComponent {

    @Input() usuario!: Usuario;

    elogio: string = '';

    enviarElogio() {
        if (this.elogio.trim().length === 0) return;

        console.log("Elogio enviado:", this.elogio);

        this.elogio = '';
    }
}
