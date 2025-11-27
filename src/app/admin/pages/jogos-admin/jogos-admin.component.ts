import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface AdminGameItem {
  title: string;
  desc: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-jogos-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './jogos-admin.component.html',
  styleUrls: ['./jogos-admin.component.scss']
})
export class JogosAdminComponent {

  constructor(private router: Router) {}

  games: AdminGameItem[] = [
    {
      title: 'Quiz Autoglass',
      desc: 'Gerencie perguntas, respostas e categorias.',
      icon: 'bi bi-lightbulb-fill',
      route: '/admin/jogos/quiz'
    },
    {
      title: 'Acerte ou Erre',
      desc: 'Configure afirmações e valide respostas.',
      icon: 'bi bi-shield-check',
      route: '/admin/jogos/acerte'
    },
    {
      title: 'Memória Automotiva',
      desc: 'Gerencie cartas, pares e imagens.',
      icon: 'bi bi-grid-3x3-gap-fill',
      route: '/admin/jogos/memoria'
    },
    {
      title: 'AutoWordle',
      desc: 'Cadastre palavras e dicas.',
      icon: 'bi bi-keyboard-fill',
      route: '/admin/jogos/autowordle'
    },
    {
      title: 'Caça-Palavras',
      desc: 'Gerencie listas e temas.',
      icon: 'bi bi-search-heart-fill',
      route: '/admin/jogos/caca-palavras'
    },
    {
      title: 'Forca Automotiva',
      desc: 'Cadastre palavras e níveis.',
      icon: 'bi bi-alphabet',
      route: '/admin/jogos/forca'
    },
    {
      title: 'Palavras Cruzadas',
      desc: 'Monte tabuleiros e dicas.',
      icon: 'bi bi-pencil-square',
      route: '/admin/jogos/palavras-cruzadas'
    }
  ];

  goTo(route: string) {
    this.router.navigate([route]);
  }
}
