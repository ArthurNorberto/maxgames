import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LoginService } from '../services/login.service';
import { Usuario, UsuariosService } from '../services/usuarios.service';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-meu-perfil',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './meu-perfil.component.html',
    styleUrls: ['./meu-perfil.component.scss']
})
export class MeuPerfilComponent implements OnInit {

    usuario: Usuario = {
        id: '',
        name: '',
        sector: '',
        equipe: '',
        login: '',
        avatar: ''
    };

    avatarPreview: string | ArrayBuffer | null = null;

    setores: string[] = [];
    equipesCentral: string[] = [];

    successMessage = '';
    errorMessage = '';

    constructor(
        private router: Router,
        private usuariosService: UsuariosService,
        private loginService: LoginService
    ) { }

    ngOnInit(): void {

        // Carregar setores
        this.usuariosService.getSetores().subscribe(s => {
            this.setores = s;
        });

        // Carregar equipes da Central
        this.usuariosService.getEquipesCentral().subscribe(e => {
            this.equipesCentral = e;
        });

        // Carregar usuário logado
        this.usuariosService.getUsuarioAtual().subscribe(u => {
            if (u) {
                this.usuario = { ...u }; // clone
                this.avatarPreview = this.usuario.avatar;
            }
        });
    }

    onAvatarChange(event: any) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            this.avatarPreview = reader.result;
            this.usuario.avatar = reader.result as string;
        };
        reader.readAsDataURL(file);
    }

    salvar() {
        try {
            this.loginService.saveUser(this.usuario);

            this.successMessage = 'Informações atualizadas com sucesso!';
            this.errorMessage = '';
        } catch {
            this.successMessage = '';
            this.errorMessage = 'Ocorreu um erro ao salvar. Tente novamente.';
        }
    }

    voltar() {
        this.router.navigate(['/inicio']);
    }
}
