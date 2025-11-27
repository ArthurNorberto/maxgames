import { Injectable } from '@angular/core';

export interface Premio {
  id: number;
  titulo: string;
  descricao: string;
  pontos: number;
  icone: string; // Bootstrap Icon class
  destaque?: boolean; // Para prêmios especiais (ex: Dia de Folga)
}

@Injectable({ providedIn: 'root' })
export class PremiosService {

  private readonly premios: Premio[] = [

    // ⭐ Maior prêmio
    {
      id: 1,
      titulo: 'UM DIA DE FOLGA',
      descricao: 'O reconhecimento máximo! Um dia inteiro de descanso para recarregar as energias.',
      pontos: 18000,
      icone: 'bi-stars',
      destaque: true
    },

    // 🎁 Premios existentes
    {
      id: 2,
      titulo: 'Kit Tecnologia',
      descricao: 'Mouse + Headset corporativo Autoglass para impulsionar sua produtividade.',
      pontos: 6000,
      icone: 'bi-laptop'
    },
    {
      id: 3,
      titulo: 'Estrela do Mês',
      descricao: 'Reconhecimento interno com destaque no mural e certificado corporativo.',
      pontos: 9000,
      icone: 'bi-person-check'
    },
    {
      id: 4,
      titulo: 'Vale Experiência',
      descricao: 'Voucher para cinema, escape room ou experiência selecionada.',
      pontos: 5000,
      icone: 'bi-ticket-perforated'
    },
    {
      id: 5,
      titulo: 'Café Premium Maxpar',
      descricao: 'Kit com café especial + caneca corporativa edição limitada.',
      pontos: 3000,
      icone: 'bi-cup-hot'
    },
    {
      id: 6,
      titulo: 'Kit Boas Vibrações',
      descricao: 'Bloco + caneta + organizador com branding Autoglass/Maxpar.',
      pontos: 2000,
      icone: 'bi-gift'
    },

    // 🆕 Novos prêmios
    {
      id: 7,
      titulo: 'Check-up Veicular',
      descricao: 'Inspeção completa do veículo em oficina parceira Autoglass.',
      pontos: 7500,
      icone: 'bi-car-front-fill'
    },
    {
      id: 8,
      titulo: 'Seguro Veicular Premium',
      descricao: 'Cobertura especial para seu veículo, válida por 1 mês.',
      pontos: 12500,
      icone: 'bi-patch-check-fill'
    },
    {
      id: 9,
      titulo: 'Vale Combustível',
      descricao: 'Crédito para abastecimento em postos parceiros Maxpar.',
      pontos: 4500,
      icone: 'bi-wallet2'
    },
    {
      id: 10,
      titulo: 'Curso Corporativo',
      descricao: 'Treinamento online ou presencial oferecido pela Autoglass.',
      pontos: 8000,
      icone: 'bi-briefcase-fill'
    },
    {
      id: 11,
      titulo: 'Day Off + Home Office',
      descricao: 'Um dia remoto com kit corporativo para home office.',
      pontos: 10000,
      icone: 'bi-house-door-fill'
    },
    {
      id: 12,
      titulo: 'Almoço Executivo',
      descricao: 'Vale-almoço em restaurante parceiro da Autoglass/Maxpar.',
      pontos: 6500,
      icone: 'bi-emoji-smile-fill'
    },
    {
      id: 13,
      titulo: 'Kit Seguros Personalizado',
      descricao: 'Mochila + caderno + caneta com identidade visual Autoglass.',
      pontos: 3500,
      icone: 'bi-gift-fill'
    },
    {
      id: 14,
      titulo: 'Reconhecimento Top 10',
      descricao: 'Certificado e destaque entre os 10 melhores colaboradores do mês.',
      pontos: 9500,
      icone: 'bi-star-fill'
    },
    {
      id: 15,
      titulo: 'Team Building',
      descricao: 'Experiência de integração para toda a equipe em evento corporativo.',
      pontos: 11000,
      icone: 'bi-people-fill'
    },
    {
      id: 16,
      titulo: 'Surpresa Exclusiva',
      descricao: 'Presente surpresa especial Autoglass para reconhecimento extraordinário.',
      pontos: 13000,
      icone: 'bi-emoji-heart-eyes-fill'
    }
  ];

  constructor() {}

  getPremios(): Premio[] {
    return this.premios;
  }

  getPremioById(id: number): Premio | undefined {
    return this.premios.find(p => p.id === id);
  }
}
