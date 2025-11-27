import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';

export interface Meta {
    id: number;
    title: string;
    description: string;
    target: string;
    progress: number;
    reward: string;
    completed: boolean;
    type: 'daily' | 'monthly';
}


@Injectable({ providedIn: 'root' })
export class MetasService {

  private metasSubject = new BehaviorSubject<Meta[]>([]);
  metas$ = this.metasSubject.asObservable();

  constructor() {
    this.loadMockData(); // futuramente: chamar API
  }

  /** --------------------------------------
   *  MOCK — será substituído por API futuramente
   * --------------------------------------*/
  private loadMockData() {

    const daily: Meta[] = [
      {
        id: 1,
        title: 'Jogar 1 partida de Quiz Autoglass',
        description: 'Responda ao menos 1 rodada do Quiz para testar seus conhecimentos diários.',
        target: '1 Quiz',
        progress: 40,
        reward: '25 MaxCoin',
        completed: false,
        type: 'daily'
      },
      {
        id: 2,
        title: 'Acertar 5 afirmações no "Acerte ou Erre"',
        description: 'Mostre precisão acertando 5 julgamentos seguidos no jogo.',
        target: '5 acertos',
        progress: 60,
        reward: '35 MaxCoin',
        completed: false,
        type: 'daily'
      },
      {
        id: 3,
        title: 'Completar 1 rodada de Memória Automotiva',
        description: 'Combine todos os pares do jogo da memória.',
        target: '1 rodada',
        progress: 20,
        reward: '20 MaxCoin',
        completed: false,
        type: 'daily'
      },
      {
        id: 4,
        title: 'Encontrar 8 palavras no Caça-Palavras',
        description: 'Encontre rapidamente ao menos 8 termos automotivos.',
        target: '8 palavras',
        progress: 80,
        reward: '30 MaxCoin',
        completed: false,
        type: 'daily'
      },
      {
        id: 5,
        title: 'Resolver 1 palavra no AutoWordle',
        description: 'Adivinhe ao menos uma palavra antes de acabar as tentativas.',
        target: '1 solução',
        progress: 10,
        reward: '20 MaxCoin',
        completed: false,
        type: 'daily'
      }
    ];

    const monthly: Meta[] = [
      {
        id: 11,
        title: 'Completar 50 partidas de Quiz',
        description: 'Faça 50 partidas de Quiz Autoglass ao longo do mês.',
        target: '50 Quiz',
        progress: 55,
        reward: '300 MaxCoin',
        completed: false,
        type: 'monthly'
      },
      {
        id: 12,
        title: 'Ficar no Top 10 do Ranking Mensal',
        description: 'Mostre sua constância e habilidade para alcançar o Top 10.',
        target: 'Top 10',
        progress: 20,
        reward: '500 MaxCoin',
        completed: false,
        type: 'monthly'
      },
      {
        id: 13,
        title: 'Completar 20 rodadas de Memória Automotiva',
        description: 'Combine todos os pares em 20 rodadas diferentes.',
        target: '20 rodadas',
        progress: 70,
        reward: '350 MaxCoin',
        completed: false,
        type: 'monthly'
      },
      {
        id: 14,
        title: 'Resolver 15 AutoWordles no mês',
        description: 'Adivinhe a palavra secreta em 15 partidas ao longo do mês.',
        target: '15 resoluções',
        progress: 30,
        reward: '400 MaxCoin',
        completed: false,
        type: 'monthly'
      },
      {
        id: 15,
        title: 'Completar 10 cruzadinhas automotivas',
        description: 'Finalize todas as palavras de 10 tabuleiros diferentes.',
        target: '10 cruzadinhas',
        progress: 10,
        reward: '380 MaxCoin',
        completed: false,
        type: 'monthly'
      }
    ];

    this.metasSubject.next([...daily, ...monthly]);
  }

  /** --------------------------------------
   *  GETs organizados
   * --------------------------------------*/

  getMetasByType(type: 'daily' | 'monthly') {
    return this.metas$.pipe(
      map(list => list.filter(m => m.type === type))
    );
  }

  /** --------------------------------------
   *  Ações
   * --------------------------------------*/

  toggleComplete(meta: Meta) {
    const metas = [...this.metasSubject.value];
    const target = metas.find(m => m.id === meta.id);
    if (!target) return;

    target.completed = !target.completed;
    target.progress = target.completed ? 100 : Math.min(target.progress, 99);

    this.metasSubject.next(metas);
  }

  addProgress(meta: Meta, amount = 10) {
    const metas = [...this.metasSubject.value];
    const target = metas.find(m => m.id === meta.id);
    if (!target || target.completed) return;

    target.progress = Math.min(100, target.progress + amount);
    if (target.progress >= 100) target.completed = true;

    this.metasSubject.next(metas);
  }

  /** --------------------------------------
   *  Busca / filtros
   * --------------------------------------*/

  filterMetas(type: 'daily' | 'monthly', search: string) {
    const q = search.trim().toLowerCase();
    return this.metas$.pipe(
      map(list =>
        list
          .filter(m => m.type === type)
          .filter(m =>
            !q ||
            m.title.toLowerCase().includes(q) ||
            m.description.toLowerCase().includes(q) ||
            m.target.toLowerCase().includes(q)
          )
          .sort(
            (a, b) =>
              Number(b.completed) - Number(a.completed) ||
              b.progress - a.progress
          )
      )
    );
  }
}
