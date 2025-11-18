import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Usuario, UsuariosService } from '../../../pages/services/usuarios.service';

@Component({
  selector: 'app-right-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './right-sidebar.component.html',
  styleUrls: ['./right-sidebar.component.scss']
})
export class RightSidebarComponent implements OnInit {
  friends: Usuario[] = [];
  equipes: Usuario[] = [];

  topNine: Usuario[] = [];
  topEquipe: Usuario[] = [];

  constructor(private usuariosService: UsuariosService) {}

  ngOnInit(): void {
    // Carregar amigos
    this.usuariosService.getAmigos().subscribe(amigos => {
      this.friends = amigos;
      this.topNine = this.friends.slice(0, 9);
    });

    // Carregar equipes — exemplo: pegar todos usuários do setor "Central de Atendimento"
    this.usuariosService.getAmigos().subscribe(users => {
      // aqui você pode filtrar por equipe real se tiver, por enquanto mock
      this.equipes = users.filter(u => u.comunidade === 'Central de Atendimento');
      this.topEquipe = this.equipes.slice(0, 9);
    });
  }
}
