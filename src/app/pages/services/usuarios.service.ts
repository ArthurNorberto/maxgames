import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { LoginService } from './login.service';

export interface Usuario {
    id: string;
    nome: string;
    comunidade?: string;
    tribo?: string;
    login?: string;
    avatar?: string;
    maxCoin?: number;
    frase?: string;
    hobbies?: string;
    interesses?: string;
}


@Injectable({ providedIn: 'root' })
export class UsuariosService {

    setores = [
        'Central de Atendimento',
        'CIM',
        'QA',
        'Desenvolvimento',
        'Administrador'
    ];

    equipesCentral = ['Porto', 'Bradesco', 'Azul', 'HDI', 'Allianz', 'Tokio'];

    /** 🔹 Usuários oficiais por setor */
    usuariosPorSetor: Record<string, Usuario> = {
        'Central de Atendimento': {
            id: '1',
            nome: 'Bianca Vaz',
            comunidade: 'Central de Atendimento',
            login: 'bianca.vaz',
            avatar: 'assets/avatars/bianca-vaz.jpg',
            maxCoin: 820,
            frase: 'Atender bem é transformar o dia de alguém.',
            hobbies: 'Fotografia, trilhas leves e maratonar séries.',
            interesses: 'Atendimento humanizado, comunicação e experiências do cliente.',
        },
        'CIM': {
            id: '2',
            nome: 'Nadia Barcellos',
            comunidade: 'CIM',
            tribo: 'CIM',
            login: 'nadia.barcellos',
            avatar: 'assets/avatars/nadia-barcellos.jpg',
            maxCoin: 910,
            frase: 'Dados contam histórias — basta saber ouvir.',
            hobbies: 'Ler suspense, café especial e organizar dashboards.',
            interesses: 'Inteligência de dados, automação e análise comportamental.',

        },
        'QA': {
            id: '3',
            nome: 'Weylon Rodrigues',
            comunidade: 'QA',
            tribo: 'QA',
            login: 'weylon.rodrigues',
            avatar: 'assets/avatars/weylon-rodrigues.jpg',
            maxCoin: 760,
            frase: 'Quebrei? Então está funcionando.',
            hobbies: 'Games, resolver bugs por diversão e tocar guitarra.',
            interesses: 'Testes automatizados, qualidade contínua e performance.',

        },
        'Desenvolvimento': {
            id: '4',
            nome: 'Arthur Norberto',
            comunidade: 'Desenvolvimento',
            tribo: 'Desenvolvimento',
            login: 'arthur.norberto',
            avatar: 'assets/avatars/arthur.jpg',
            maxCoin: 1240,
            frase: 'Criar é melhor do que consertar.',
            hobbies: 'Desenvolver projetos, jogar Tibia e churrasco no fim de semana.',
            interesses: 'Arquitetura de software, Angular, Node e integrações.',

        },
        'Administrador': {
            id: '5',
            nome: 'Fulano',
            comunidade: 'Administrador',
            tribo: 'Administrador',
            login: 'fulano.sicrano',
            avatar: 'assets/avatars/arthur.jpg',
            maxCoin: 1240,
            frase: 'Criar é melhor do que consertar.',
            hobbies: 'Desenvolver projetos, jogar Tibia e churrasco no fim de semana.',
            interesses: 'Arquitetura de software, Angular, Node e integrações.',

        }
    };

    // 🔹 Mock — futuramente substitui por API real
    private mockUsuarios: Usuario[] = [
        { id: '1', nome: 'Ana Silva', comunidade: 'Central de Atendimento', tribo: 'Porto', login: '', avatar: 'assets/avatars/ana-silva.jpg', maxCoin: 1240 },
        { id: '2', nome: 'Carlos Rocha', comunidade: 'CIM', tribo: 'CIM', login: '', avatar: 'assets/avatars/carlos.jpg', maxCoin: 980 },
        { id: '3', nome: 'Mariana', comunidade: 'QA', tribo: 'QA', login: '', avatar: 'assets/avatars/mariana.jpg', maxCoin: 760 },
        { id: '4', nome: 'João Pedro', comunidade: 'Desenvolvimento', tribo: 'Desenvolvimento', login: '', avatar: 'assets/avatars/joao-pedro.jpg', maxCoin: 540 },
        { id: '5', nome: 'Roberta', comunidade: 'Central de Atendimento', tribo: 'Porto', login: '', avatar: 'assets/avatars/roberta.jpg', maxCoin: 860 },
        { id: '6', nome: 'Felipe', comunidade: 'Central de Atendimento', tribo: 'Porto', login: '', avatar: 'assets/avatars/felipe.jpg', maxCoin: 320 },
        { id: '7', nome: 'Sandra', comunidade: 'Central de Atendimento', tribo: 'HDI', login: '', avatar: 'assets/avatars/sandra.jpg', maxCoin: 1020 },
        { id: '8', nome: 'Julia', comunidade: 'Central de Atendimento', tribo: 'Azul', login: '', avatar: 'assets/avatars/julia.jpg', maxCoin: 690 },
        { id: '9', nome: 'Matheus', comunidade: 'Central de Atendimento', tribo: 'Bradesco', login: '', avatar: 'assets/avatars/matheus.jpg', maxCoin: 770 },
        { id: '10', nome: 'Lucas Martins', comunidade: 'Central de Atendimento', tribo: 'Bradesco', login: '', avatar: 'assets/avatars/default.jpg', maxCoin: 830 },
        { id: '11', nome: 'Patrícia Gomes', comunidade: 'Central de Atendimento', tribo: 'Bradesco', login: '', avatar: 'assets/avatars/default.jpg', maxCoin: 410 },
        { id: '12', nome: 'Renato Carvalho', comunidade: 'Central de Atendimento', tribo: 'Bradesco', login: '', avatar: 'assets/avatars/default.jpg', maxCoin: 990 },
        { id: '13', nome: 'Beatriz Farias', comunidade: 'Central de Atendimento', tribo: 'Bradesco', login: '', avatar: 'assets/avatars/default.jpg', maxCoin: 560 },
        { id: '14', nome: 'Thiago Almeida', comunidade: 'Central de Atendimento', tribo: 'Bradesco', login: '', avatar: 'assets/avatars/default.jpg', maxCoin: 250 },
        { id: '15', nome: 'Camila Duarte', comunidade: 'Central de Atendimento', tribo: 'Azul', login: '', avatar: 'assets/avatars/default.jpg', maxCoin: 720 },
        { id: '16', nome: 'Eduardo Santos', comunidade: 'Central de Atendimento', tribo: 'Azul', login: '', avatar: 'assets/avatars/default.jpg', maxCoin: 1180 },
        { id: '17', nome: 'Fernanda Lopes', comunidade: 'Central de Atendimento', tribo: 'Azul', login: '', avatar: 'assets/avatars/default.jpg', maxCoin: 640 },
        { id: '18', nome: 'André Luiz', comunidade: 'Central de Atendimento', tribo: 'Azul', login: '', avatar: 'assets/avatars/default.jpg', maxCoin: 530 },
        { id: '19', nome: 'Paula Morais', comunidade: 'Central de Atendimento', tribo: 'Azul', login: '', avatar: 'assets/avatars/default.jpg', maxCoin: 880 },
        { id: '20', nome: 'Ricardo Nogueira', comunidade: 'Central de Atendimento', tribo: 'Allianz', login: '', avatar: 'assets/avatars/default.jpg', maxCoin: 300 },
        { id: '21', nome: 'Vanessa Ribeiro', comunidade: 'Central de Atendimento', tribo: 'Allianz', login: '', avatar: 'assets/avatars/default.jpg', maxCoin: 760 },
        { id: '22', nome: 'Diego Fernandes', comunidade: 'Central de Atendimento', tribo: 'Allianz', login: '', avatar: 'assets/avatars/default.jpg', maxCoin: 150 },
        { id: '23', nome: 'Larissa Barros', comunidade: 'Central de Atendimento', tribo: 'Allianz', login: '', avatar: 'assets/avatars/default.jpg', maxCoin: 940 },
        { id: '24', nome: 'Gustavo Teixeira', comunidade: 'Central de Atendimento', tribo: 'Allianz', login: '', avatar: 'assets/avatars/default.jpg', maxCoin: 820 },
        { id: '25', nome: 'Natália Freitas', comunidade: 'Central de Atendimento', tribo: 'Allianz', login: '', avatar: 'assets/avatars/default.jpg', maxCoin: 675 },
        { id: '26', nome: 'Rafael Correia', comunidade: 'Central de Atendimento', tribo: 'Allianz', login: '', avatar: 'assets/avatars/default.jpg', maxCoin: 1025 },
        { id: '27', nome: 'Isabela Torres', comunidade: 'Central de Atendimento', tribo: 'Allianz', login: '', avatar: 'assets/avatars/default.jpg', maxCoin: 580 },
        { id: '28', nome: 'Pedro Henrique', comunidade: 'Central de Atendimento', tribo: 'Tokio', login: '', avatar: 'assets/avatars/default.jpg', maxCoin: 460 },
        { id: '29', nome: 'Marcela Pires', comunidade: 'Central de Atendimento', tribo: 'Tokio', login: '', avatar: 'assets/avatars/default.jpg', maxCoin: 730 }

    ];

    constructor(private loginService: LoginService, private router: Router) { }

    /** Usuário logado */
    getUsuarioAtual(): Observable<Usuario | null> {
        return of(this.loginService.getUser());
    }

    /** Lista completa de amigos */
    getUsuarios(): Observable<Usuario[]> {
        return of(this.mockUsuarios);
    }

    /** Ranking derivado da lista de amigos */
    getRanking(): Observable<Usuario[]> {
        const ranking = [...this.mockUsuarios].sort((a, b) => (b.maxCoin ?? 0) - (a.maxCoin ?? 0));
        return of(ranking);
    }

    getSetores(): Observable<string[]> {
        return of(this.setores);
    }

    navigateToPerfil(usuario: Usuario) {
        this.router.navigate(['/perfil', usuario.id]);
    }


    getEquipesCentral(): Observable<string[]> {
        return of(this.equipesCentral);
    }

    getUsuarioPorSetor(setor: string): Observable<Usuario | null> {
        return of(this.usuariosPorSetor[setor] ?? null);
    }
}
