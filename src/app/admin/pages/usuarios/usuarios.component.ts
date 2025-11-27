import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { UsuariosService, Usuario } from '../../../pages/services/usuarios.service';
import { LoginService } from '../../../pages/services/login.service';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
}) 
export class UsuariosComponent implements OnInit {

  setores: string[] = [];
  equipes: string[] = [];

  sector = '';
  team = '';
  search = '';

  usuariosFiltrados: Usuario[] = [];
  usuariosOriginais: Usuario[] = [];

  usuarioEdicao: Usuario | null = null;
  modalAberto = false;

  constructor(
    private usuariosService: UsuariosService,
    private loginService: LoginService,
    private router: Router
  ) {}

  ngOnInit() {
    this.usuariosService.getComunidades().subscribe(s => this.setores = s.map(c => c.nome));
  }

  onSetorChange() {
    this.team = '';
    this.search = '';

    if (!this.sector) {
      this.usuariosFiltrados = [];
      this.usuariosOriginais = [];
      return;
    }

    // Equipes somente para Central
    if (this.sector === 'Central de Atendimento') {
      this.usuariosService.getTribos().subscribe(e => this.equipes = e.map(t => t.nome));
    } else {
      this.equipes = [];
    }

    this.carregarUsuarios();
  }

  carregarUsuarios() {
    this.usuariosService.getUsuarios().subscribe(lista => {
      const filtrados = lista.filter(u => u.comunidade === this.sector);

      this.usuariosOriginais = filtrados;
      this.usuariosFiltrados = filtrados;
    });
  }

  onEquipeChange() {
    if (!this.team) {
      this.usuariosFiltrados = [...this.usuariosOriginais];
      return;
    }

    this.usuariosFiltrados = this.usuariosOriginais.filter(
      u => u.tribo === this.team
    );
  }

  filtrarPesquisa() {
    const txt = this.search.toLowerCase().trim();
    this.usuariosFiltrados = this.usuariosOriginais.filter(u =>
      u.nome.toLowerCase().includes(txt) ||
      (u.tribo ?? '').toLowerCase().includes(txt)
    );
  }

  abrirModal(usuario: Usuario) {
    this.usuarioEdicao = { ...usuario };
    this.modalAberto = true;
  }

  fecharModal() {
    this.modalAberto = false;
    this.usuarioEdicao = null;
  }

  salvarEdicao() {
    if (!this.usuarioEdicao) return;
    const index = this.usuariosOriginais.findIndex(u => u.id === this.usuarioEdicao!.id);
    this.usuariosOriginais[index] = { ...this.usuarioEdicao };
    this.onEquipeChange();
    this.fecharModal();
  }

  loginComo(usuario: Usuario) {
    this.loginService.saveUser(usuario);
    this.router.navigate(['/inicio']);
  }

  abrirPerfil(usuario: Usuario) {
    this.usuariosService.navigateToPerfil(usuario);
  }
}
