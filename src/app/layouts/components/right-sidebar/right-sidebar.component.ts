import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Usuario, UsuariosService } from '../../../pages/services/usuarios.service';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-right-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './right-sidebar.component.html',
  styleUrls: ['./right-sidebar.component.scss']
})
export class RightSidebarComponent implements OnInit {
  user: Usuario | null = null;
  pessoasDacomunidade: Usuario[] = [];
  pessoasDaTribo: Usuario[] = [];

  topComunidade: Usuario[] = [];
  topTribo: Usuario[] = [];

  constructor(private usuariosService: UsuariosService, private router: Router) { }

  ngOnInit(): void {

    this.usuariosService.getUsuarioAtual()
      .subscribe(u => this.user = u);
    this.usuariosService.getUsuarios().subscribe(usuarios => {
      this.pessoasDacomunidade = usuarios.filter(u => u.comunidade === this.user?.comunidade);
      this.topComunidade = this.pessoasDacomunidade.slice(0, 9);
    });

    this.usuariosService.getUsuarios().subscribe(usuarios => {
      this.pessoasDaTribo = usuarios.filter(u => u.tribo === this.user?.tribo);
      this.topTribo = this.pessoasDaTribo.slice(0, 9);
    });
  }

   goToPerfil(id: string | number): void {
    this.router.navigate(['/perfil', id]);
  }
}
