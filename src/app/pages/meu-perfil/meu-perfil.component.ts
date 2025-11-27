import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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

    @ViewChild('avatarInput') avatarInput!: ElementRef<HTMLInputElement>;

    usuario: Usuario = {
        id: '',
        nome: '',
        comunidade: '',
        tribo: '',
        login: '',
        avatar: '',
        maxCoin: 0
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
        this.usuariosService.getComunidades().subscribe(s => {
            this.setores = s.map(c => c.nome);
        });

        // Carregar equipes da Central
        this.usuariosService.getTribos().subscribe(e => {
            this.equipesCentral = e.map(t => t.nome);
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

    voltar() {
        this.router.navigate(['/inicio']);
    }

    openAvatarDialog() {
        // segura se não estiver disponível em SSR
        try {
            this.avatarInput?.nativeElement?.click();
        } catch (e) { /* no-op */ }
    }

    salvar() {
        try {
            this.loginService.saveUser(this.usuario);
            this.successMessage = 'Informações atualizadas com sucesso!';
            this.errorMessage = '';

            // limpa mensagem depois de 3s
            setTimeout(() => this.successMessage = '', 3000);
        } catch {
            this.successMessage = '';
            this.errorMessage = 'Ocorreu um erro ao salvar. Tente novamente.';
            setTimeout(() => this.errorMessage = '', 5000);
        }
    }
}
