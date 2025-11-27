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
  currentSlide = 0;
  destaques: Usuario[] = [];
  aniversariantes: Usuario[] = [];

  constructor(private usuariosService: UsuariosService, private router: Router) { }

  ngOnInit(): void {
    this.usuariosService.getUsuarioAtual()
      .subscribe(u => this.user = u);

    this.usuariosService.getUsuarios().subscribe(usuarios => {

      // Comunidade
      this.pessoasDacomunidade = usuarios.filter(u => u.comunidade === this.user?.comunidade);
      this.topComunidade = this.pessoasDacomunidade.slice(0, 9);

      // Tribo
      this.pessoasDaTribo = usuarios.filter(u => u.tribo === this.user?.tribo);
      this.topTribo = this.pessoasDaTribo.slice(0, 9);

      // DESTAQUES = top 5 por maxCoin
      this.destaques = [...usuarios]
        .sort((a, b) => (b.maxCoin ?? 0) - (a.maxCoin ?? 0))
        .slice(0, 5);

      // ANIVERSARIANTES DO MÊS
      const mesAtual = new Date().getMonth() + 1;
      this.aniversariantes = usuarios.filter(u => {
        if (!u.dataNascimento) return false;
        return Number(u.dataNascimento.split('-')[1]) === mesAtual;
      });
    });
  }

  goToPerfil(id: string | number): void {
    this.router.navigate(['/perfil', id]);
  }

  nextSlide() {
    const slides = document.querySelectorAll('.carousel-slide');
    slides[this.currentSlide].classList.remove('active');

    this.currentSlide = (this.currentSlide + 1) % slides.length;

    slides[this.currentSlide].classList.add('active');
  }

  prevSlide() {
    const slides = document.querySelectorAll('.carousel-slide');
    slides[this.currentSlide].classList.remove('active');

    this.currentSlide = (this.currentSlide - 1 + slides.length) % slides.length;

    slides[this.currentSlide].classList.add('active');
  }
}
