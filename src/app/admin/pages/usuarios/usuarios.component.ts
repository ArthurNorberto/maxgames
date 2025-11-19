import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Usuario, UsuariosService } from '../../../pages/services/usuarios.service';
import { LoginService } from '../../../pages/services/login.service';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})
export class UsuariosComponent implements OnInit {

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
    this.usuariosService.getSetores().subscribe(s => this.setores = s);
  }

  onSetorChange() {
    this.team = '';

    // se mudar setor, carrega o usuário correspondente
    this.usuariosService.getUsuarioPorSetor(this.sector)
      .subscribe(u => this.usuariosSetor = u);

    // carrega equipes caso seja Central
    if (this.sector === 'Central de Atendimento') {
      this.usuariosService.getEquipesCentral().subscribe(e => this.equipes = e);
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
    this.router.navigate(['/inicio']);
  }
}
