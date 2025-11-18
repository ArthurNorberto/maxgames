import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface Meta {
    id: number;
    title: string;
    description: string;
    target: string;       // ex: "5 partidas", "50 chamados"
    progress: number;     // 0 - 100
    reward: string;       // ex: "150 MaxCoin"
    completed: boolean;
    type: 'daily' | 'monthly';
}

@Component({
    selector: 'app-metas',
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule],
    templateUrl: './metas.component.html',
    styleUrls: ['./metas.component.scss']
})
export class MetasComponent implements OnInit {
    activeTab: 'daily' | 'monthly' = 'daily';
    search = '';

    metas: Meta[] = [];

    ngOnInit(): void {

        // 🟦 Metas DIÁRIAS — relacionadas às ações rápidas nos jogos
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



        // 🟧 Metas MENSAIS — desempenho geral, constância e progresso maior
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

        this.metas = [...daily, ...monthly];
    }


    switchTab(t: 'daily' | 'monthly') {
        this.activeTab = t;
    }

    toggleComplete(m: Meta) {
        m.completed = !m.completed;
        m.progress = m.completed ? 100 : Math.min(m.progress, 99);
    }

    // Increment progress (mock action)
    addProgress(m: Meta, amount = 10) {
        if (m.completed) return;
        m.progress = Math.min(100, m.progress + amount);
        if (m.progress >= 100) {
            m.completed = true;
        }
    }

    filteredMetas() {
        return this.metas
            .filter(m => m.type === this.activeTab)
            .filter(m => {
                const q = this.search.trim().toLowerCase();
                if (!q) return true;
                return m.title.toLowerCase().includes(q) || m.description.toLowerCase().includes(q) || m.target.toLowerCase().includes(q);
            })
            .sort((a, b) => Number(b.completed) - Number(a.completed) || b.progress - a.progress);
    }

    get metasAtivas() {
        return this.metas.filter(m => m.type === this.activeTab);
    }

    get metasAtivasCompletas() {
        return this.metasAtivas.filter(m => m.completed);
    }

    get progressoMedio() {
        const list = this.metasAtivas;
        const total = list.reduce((s, m) => s + m.progress, 0);
        return list.length ? Math.round(total / list.length) : 0;
    }

}
