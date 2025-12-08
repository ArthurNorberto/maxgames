import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { LoginService } from './login.service';
import { Tribo } from './tribos.service';
import { Perfil } from './perfis.service';

export interface Usuario {
    id: string;
    nome: string;
    comunidade: string;
    tribo?: string;
    login: string;
    senha: string;
    avatar: string;
    maxCoin: number;
    frase: string;
    hobbies: string;
    interesses: string;
    dataNascimento: string;
    perfil: Perfil;
}



@Injectable({ providedIn: 'root' })
export class UsuariosService {


    /** 🔹 Usuários oficiais por setor (com dados completos) */
    usuariosPorSetor: Record<string, Usuario> = {
        'Central de Atendimento': {
            id: '1',
            nome: 'Bianca Vaz',
            comunidade: 'Central de Atendimento',
            tribo: 'Porto',
            login: 'bianca.vaz',
            senha: '123',
            avatar: 'assets/avatars/bianca-vaz.jpg',
            maxCoin: 820,
            frase: 'Atender bem é transformar o dia de alguém.',
            hobbies: 'Fotografia, trilhas leves e maratonar séries.',
            interesses: 'Atendimento humanizado, comunicação e experiências do cliente.',
            dataNascimento: '1997-05-17',
            perfil: { id: '2', nome: 'Liderança' }
        },
        'CIM': {
            id: '2',
            nome: 'Nadia Barcellos',
            comunidade: 'CIM',
            tribo: 'CIM',
            login: 'nadia.barcellos',
            senha: '123',
            avatar: 'assets/avatars/nadia-barcellos.jpg',
            maxCoin: 910,
            frase: 'Dados contam histórias — basta saber ouvir.',
            hobbies: 'Ler suspense, café especial e organizar dashboards.',
            interesses: 'Inteligência de dados, automação e análise comportamental.',
            dataNascimento: '1991-11-03',
            perfil: { id: '2', nome: 'Liderança' }
        },
        'QA': {
            id: '3',
            nome: 'Weylon Rodrigues',
            comunidade: 'QA',
            tribo: 'QA',
            login: 'weylon.rodrigues',
            senha: '123',
            avatar: 'assets/avatars/weylon-rodrigues.jpg',
            maxCoin: 760,
            frase: 'Quebrei? Então está funcionando.',
            hobbies: 'Games, resolver bugs e tocar guitarra.',
            interesses: 'Testes automatizados, qualidade contínua e performance.',
            dataNascimento: '1994-02-28',
            perfil: { id: '2', nome: 'Liderança' }
        },
        'Desenvolvimento': {
            id: '4',
            nome: 'Arthur Norberto',
            comunidade: 'Desenvolvimento',
            tribo: 'Desenvolvimento',
            login: 'arthur.norberto',
            senha: '123',
            avatar: 'assets/avatars/arthur.jpg',
            maxCoin: 1240,
            frase: 'Criar é melhor do que consertar.',
            hobbies: 'Projetos pessoais, Tibia e churrasco.',
            interesses: 'Arquitetura de software, Angular, Node.',
            dataNascimento: '1995-09-14',
            perfil: { id: '2', nome: 'Liderança' }
        },
        'Administrador': {
            id: '5',
            nome: 'Administrador',
            comunidade: 'Administrador',
            tribo: 'Administrador',
            login: 'admin',
            senha: '123',
            avatar: 'assets/avatars/admin.jpg',
            maxCoin: 1320,
            frase: 'Organizar é poder.',
            hobbies: 'Planilhas, xadrez e gestão.',
            interesses: 'Liderança, automação e controle.',
            dataNascimento: '1988-03-10',
            perfil: { id: '1', nome: 'Administrador' }
        }
    };

    // 🔹 Mock completo (lista geral)
    private mockUsuarios: Usuario[] = [
        {
            id: '1',
            nome: 'Ana Silva',
            comunidade: 'Central de Atendimento',
            tribo: 'Porto',
            login: 'ana.silva',
            senha: '123',
            avatar: 'assets/avatars/ana-silva.jpg',
            maxCoin: 1240,
            frase: 'Viver é colecionar momentos.',
            hobbies: 'Corrida, séries e café.',
            interesses: 'Comunicação e pessoas.',
            dataNascimento: '1998-10-11',
            perfil: { id: '3', nome: 'Usuário' }
        },
        {
            id: '2',
            nome: 'Carlos Rocha',
            comunidade: 'CIM',
            tribo: 'CIM',
            login: 'carlos.rocha',
            senha: '123',
            avatar: 'assets/avatars/carlos.jpg',
            maxCoin: 980,
            frase: 'Números não mentem.',
            hobbies: 'Xadrez e leitura técnica.',
            interesses: 'Data Science e BI.',
            dataNascimento: '1990-07-22',
            perfil: { id: '3', nome: 'Usuário' }
        },
        {
            id: '3',
            nome: 'Mariana Silva',
            comunidade: 'QA',
            tribo: 'QA',
            login: 'mariana.qa',
            senha: '123',
            avatar: 'assets/avatars/mariana.jpg',
            maxCoin: 760,
            frase: 'Testar é prevenir.',
            hobbies: 'Jogos, puzzles e cinema.',
            interesses: 'QA, automação e performance.',
            dataNascimento: '1993-04-18',
            perfil: { id: '3', nome: 'Usuário' }
        },
        {
            id: '4',
            nome: 'João Pedro',
            comunidade: 'Desenvolvimento',
            tribo: 'Desenvolvimento',
            login: 'joao.pedro',
            senha: '123',
            avatar: 'assets/avatars/joao-pedro.jpg',
            maxCoin: 540,
            frase: 'Sempre aprender.',
            hobbies: 'Programação e futebol.',
            interesses: 'Angular, Node e APIs.',
            dataNascimento: '1999-06-05',
            perfil: { id: '3', nome: 'Usuário' }
        },
        {
            id: '5',
            nome: 'Roberta',
            comunidade: 'Central de Atendimento',
            tribo: 'Porto',
            login: '',
            senha: '123',
            avatar: 'assets/avatars/roberta.jpg',
            maxCoin: 860,
            frase: 'Sorrir muda conversas — e resultados.',
            hobbies: 'Dançar, ouvir música pop e cozinhar doces.',
            interesses: 'Atendimento ágil, empatia e melhoria contínua.',
            dataNascimento: '1994-06-18',
            perfil: { id: '3', nome: 'Usuário' }
        },
        {
            id: '6',
            nome: 'Felipe',
            comunidade: 'Central de Atendimento',
            tribo: 'Porto',
            login: '',
            senha: '123',
            avatar: 'assets/avatars/felipe.jpg',
            maxCoin: 320,
            frase: 'Cada ligação é uma chance de surpreender.',
            hobbies: 'Futebol, academia e jogos online.',
            interesses: 'Produtividade, gamificação e desenvolvimento pessoal.',
            dataNascimento: '1998-01-27',
            perfil: { id: '3', nome: 'Usuário' }
        },
        {
            id: '7',
            nome: 'Sandra',
            comunidade: 'Central de Atendimento',
            tribo: 'HDI',
            login: '',
            senha: '123',
            avatar: 'assets/avatars/sandra.jpg',
            maxCoin: 1020,
            frase: 'Paciência é meu superpoder.',
            hobbies: 'Crochê, jardinagem e novelas.',
            interesses: 'Atendimento humanizado, melhoria de processos e liderança.',
            dataNascimento: '1986-09-02',
            perfil: { id: '3', nome: 'Usuário' }
        },
        {
            id: '8',
            nome: 'Julia',
            comunidade: 'Central de Atendimento',
            tribo: 'Azul',
            login: '',
            senha: '123',
            avatar: 'assets/avatars/julia.jpg',
            maxCoin: 690,
            frase: 'Gentileza abre portas que esforço sozinho não abre.',
            hobbies: 'Desenhar, ler romances e praticar yoga.',
            interesses: 'Comunicação, criatividade e inteligência emocional.',
            dataNascimento: '1999-11-13',
            perfil: { id: '3', nome: 'Usuário' }
        },
        {
            id: '9',
            nome: 'Matheus',
            comunidade: 'Central de Atendimento',
            tribo: 'Bradesco',
            login: '',
            senha: '123',
            avatar: 'assets/avatars/matheus.jpg',
            maxCoin: 770,
            frase: 'Foco, calma e clareza — esse é o caminho.',
            hobbies: 'Ciclismo, tecnologia e assistir documentários.',
            interesses: 'Sistemas financeiros, inovação e atendimento eficiente.',
            dataNascimento: '1996-03-08',
            perfil: { id: '3', nome: 'Usuário' }
        }
    ];

    constructor(private loginService: LoginService, private router: Router) { }

    /** 🔹 Usuário logado */
    getUsuarioAtual(): Observable<Usuario | null> {
        return of(this.loginService.getUser());
    }

    /** 🔹 Lista geral */
    getUsuarios(): Observable<Usuario[]> {
        return of(this.mockUsuarios);
    }

    /** 🔹 Retorna somente administradores */
    getAdmins(): Observable<Usuario[]> {
        const admins = this.mockUsuarios.filter(u => u.comunidade === 'Administrador');
        return of(admins);
    }

    /** 🔹 Ranking por MaxCoin */
    getRanking(): Observable<Usuario[]> {
        const ranking = [...this.mockUsuarios].sort((a, b) => b.maxCoin - a.maxCoin);
        return of(ranking);
    }


    /** 🔹 Busca por setor */
    getUsuarioPorSetor(setor: string): Observable<Usuario | null> {
        return of(this.usuariosPorSetor[setor] ?? null);
    }

    /** 🔹 Busca por ID */
    getUsuarioById(id: string): Observable<Usuario | null> {
        const user =
            this.mockUsuarios.find(u => u.id === id) ??
            Object.values(this.usuariosPorSetor).find(u => u.id === id) ??
            null;

        return of(user);
    }

    /** 🔹 Navegação */
    navigateToPerfil(usuario: Usuario) {
        this.router.navigate(['/perfil', usuario.id]);
    }

    addUsuario(usuario: Usuario): Observable<Usuario> {
        usuario.id = crypto.randomUUID();
        this.mockUsuarios.push(usuario);
        return of(usuario);
    }

    findByLogin(login: string): Usuario | null {
        return this.mockUsuarios.find(u => u.login === login) ?? null;
    }

    resetPassword(login: string): Observable<boolean> {
        const user = this.findByLogin(login);
        if (!user) return of(false);

        user.senha = "123"; // senha default
        return of(true);
    }

}
