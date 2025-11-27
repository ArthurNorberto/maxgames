import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LoginService } from '../../services/login.service';
import { Usuario, UsuariosService } from '../../services/usuarios.service';

@Component({
  selector: 'app-login-admin',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './login-admin.component.html',
  styleUrls: ['./login-admin.component.scss']
})
export class LoginAdminComponent implements OnInit {

  setores: string[] = [];
  equipes: string[] = [];
  usuariosSetor: Usuario | null = null;

  sector = '';
  team = '';

  constructor(
    private router: Router,
    private loginService: LoginService,
    private usuariosService: UsuariosService
  ) { }

  ngOnInit() {
    this.usuariosService.getComunidades().subscribe(s =>
      this.setores = s
        .map(c => c.nome)
        .filter(nome => nome === 'Administrador') // 🔥 só admin
    );
  }

  onSetorChange() {
    this.team = '';

    // se mudar setor, carrega o usuário correspondente
    this.usuariosService.getUsuarioPorSetor(this.sector)
      .subscribe(u => this.usuariosSetor = u);

    // carrega equipes caso seja Central
    if (this.sector === 'Central de Atendimento') {
      this.usuariosService.getTribos().subscribe(e => this.equipes = e.map(t => t.nome));
    } else {
      this.equipes = [];
    }
  }

  login() {
    if (!this.usuariosSetor) return;

    const user: Usuario = { ...this.usuariosSetor };

    if (this.sector === 'Central de Atendimento') {
      user.tribo = this.team;
    }

    this.loginService.saveUser(user);

    // 🔥 SE FOR ADMIN, VAI PARA O ADMIN
    if (this.loginService.usuarioEhAdmin()) {
      this.router.navigate(['/admin/inicio']);
    } else {
      this.router.navigate(['/inicio']);
    }
  }

}
