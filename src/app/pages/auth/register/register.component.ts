import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UsuariosService, Usuario } from '../../services/usuarios.service';
import { ComunidadesService } from '../../services/comunidades.service';
import { TribosService } from '../../services/tribos.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  comunidades: string[] = [];
  tribos: string[] = [];

  model = {
    nome: '',
    login: '',
    comunidade: '',
    tribo: '',
    dataNascimento: ''
  };

  carregando = false;
  mensagem = '';

  constructor(
    private usuariosService: UsuariosService,
    private comunidadesService: ComunidadesService,
    private tribosService: TribosService,
    private router: Router
  ) {}

  ngOnInit() {
    this.comunidadesService.getComunidades()
      .subscribe(c => this.comunidades = c.map(x => x.nome));

    this.tribosService.getTribos()
      .subscribe(t => this.tribos = t.map(x => x.nome));
  }

  salvar() {
    this.carregando = true;
    this.mensagem = '';

    const novoUsuario: Usuario = {
      id: '',
      nome: this.model.nome,
      login: this.model.login,
      comunidade: this.model.comunidade,
      tribo: this.model.tribo,
      senha: '123', // default
      avatar: 'assets/avatars/default.png',
      maxCoin: 0,
      frase: '',
      hobbies: '',
      interesses: '',
      dataNascimento: this.model.dataNascimento,
      perfil: { id: '3', nome: 'Usuário' }
    };

    this.usuariosService.addUsuario(novoUsuario).subscribe(() => {
      this.mensagem = 'Cadastro realizado com sucesso! Redirecionando...';

      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 1200);
    });
  }
}
