import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuariosService } from '../../services/usuarios.service';
import { Router, RouterLink } from '@angular/router';

@Component({
    selector: 'app-forgot-password',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {

    login = '';
    mensagem = '';
    erro = false;

    constructor(
        private usuariosService: UsuariosService,
        private router: Router
    ) { }

    enviar() {
        this.usuariosService.resetPassword(this.login).subscribe(ok => {
            if (!ok) {
                this.erro = true;
                this.mensagem = 'Usuário não encontrado.';
                return;
            }

            this.erro = false;
            this.mensagem = 'Senha resetada para 123. Redirecionando...';

            setTimeout(() => this.router.navigate(['/login']), 1500);
        });
    }
}
