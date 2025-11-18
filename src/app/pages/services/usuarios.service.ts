import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { LoginService } from './login.service';

export interface Usuario {
    id: string;
    nome: string;
    comunidade?: string;
    tribo?: string;
    login?: string;
    avatar?: string;
    maxCoin?: number;
}

@Injectable({ providedIn: 'root' })
export class UsuariosService {

    setores = [
        'Central de Atendimento',
        'CIM',
        'QA',
        'Desenvolvimento'
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
            maxCoin: 820
        },
        'CIM': {
            id: '2',
            nome: 'Nadia Barcellos',
            comunidade: 'CIM',
            login: 'nadia.barcellos',
            avatar: 'assets/avatars/nadia-barcellos.jpg',
            maxCoin: 910
        },
        'QA': {
            id: '3',
            nome: 'Weylon Rodrigues',
            comunidade: 'QA',
            login: 'weylon.rodrigues',
            avatar: 'assets/avatars/weylon-rodrigues.jpg',
            maxCoin: 760
        },
        'Desenvolvimento': {
            id: '4',
            nome: 'Arthur Norberto',
            comunidade: 'Desenvolvimento',
            login: 'arthur.norberto',
            avatar: 'assets/avatars/arthur.jpg',
            maxCoin: 1240
        }
    };

    // 🔹 Mock — futuramente substitui por API real
    private mockFriends: Usuario[] = [
        { id: '1', nome: 'Ana Silva', comunidade: 'Central de Atendimento', login: '', avatar: 'assets/avatars/ana-silva.jpg', maxCoin: 1240 },
        { id: '2', nome: 'Carlos Rocha', comunidade: 'CIM', login: '', avatar: 'assets/avatars/carlos.jpg', maxCoin: 980 },
        { id: '3', nome: 'Mariana', comunidade: 'QA', login: '', avatar: 'assets/avatars/mariana.jpg', maxCoin: 760 },
        { id: '4', nome: 'João Pedro', comunidade: 'Desenvolvimento', login: '', avatar: 'assets/avatars/joao-pedro.jpg', maxCoin: 540 },
        { id: '5', nome: 'Roberta', login: '', avatar: 'assets/avatars/roberta.jpg', maxCoin: 860 },
        { id: '6', nome: 'Felipe', login: '', avatar: 'assets/avatars/felipe.jpg', maxCoin: 320 },
        { id: '7', nome: 'Sandra', login: '', avatar: 'assets/avatars/sandra.jpg', maxCoin: 1020 },
        { id: '8', nome: 'Julia', login: '', avatar: 'assets/avatars/julia.jpg', maxCoin: 690 },
        { id: '9', nome: 'Matheus', login: '', avatar: 'assets/avatars/matheus.jpg', maxCoin: 770 },
        { id: '10', nome: 'Lucas Martins', login: '', avatar: 'assets/avatars/default.jpg', maxCoin: 830 },
        { id: '11', nome: 'Patrícia Gomes', login: '', avatar: 'assets/avatars/default.jpg', maxCoin: 410 },
        { id: '12', nome: 'Renato Carvalho', login: '', avatar: 'assets/avatars/default.jpg', maxCoin: 990 },
        { id: '13', nome: 'Beatriz Farias', login: '', avatar: 'assets/avatars/default.jpg', maxCoin: 560 },
        { id: '14', nome: 'Thiago Almeida', login: '', avatar: 'assets/avatars/default.jpg', maxCoin: 250 },
        { id: '15', nome: 'Camila Duarte', login: '', avatar: 'assets/avatars/default.jpg', maxCoin: 720 },
        { id: '16', nome: 'Eduardo Santos', login: '', avatar: 'assets/avatars/default.jpg', maxCoin: 1180 },
        { id: '17', nome: 'Fernanda Lopes', login: '', avatar: 'assets/avatars/default.jpg', maxCoin: 640 },
        { id: '18', nome: 'André Luiz', login: '', avatar: 'assets/avatars/default.jpg', maxCoin: 530 },
        { id: '19', nome: 'Paula Morais', login: '', avatar: 'assets/avatars/default.jpg', maxCoin: 880 },
        { id: '20', nome: 'Ricardo Nogueira', login: '', avatar: 'assets/avatars/default.jpg', maxCoin: 300 },
        { id: '21', nome: 'Vanessa Ribeiro', login: '', avatar: 'assets/avatars/default.jpg', maxCoin: 760 },
        { id: '22', nome: 'Diego Fernandes', login: '', avatar: 'assets/avatars/default.jpg', maxCoin: 150 },
        { id: '23', nome: 'Larissa Barros', login: '', avatar: 'assets/avatars/default.jpg', maxCoin: 940 },
        { id: '24', nome: 'Gustavo Teixeira', login: '', avatar: 'assets/avatars/default.jpg', maxCoin: 820 },
        { id: '25', nome: 'Natália Freitas', login: '', avatar: 'assets/avatars/default.jpg', maxCoin: 675 },
        { id: '26', nome: 'Rafael Correia', login: '', avatar: 'assets/avatars/default.jpg', maxCoin: 1025 },
        { id: '27', nome: 'Isabela Torres', login: '', avatar: 'assets/avatars/default.jpg', maxCoin: 580 },
        { id: '28', nome: 'Pedro Henrique', login: '', avatar: 'assets/avatars/default.jpg', maxCoin: 460 },
        { id: '29', nome: 'Marcela Pires', login: '', avatar: 'assets/avatars/default.jpg', maxCoin: 730 }

    ];

    constructor(private loginService: LoginService) { }

    /** Usuário logado */
    getUsuarioAtual(): Observable<Usuario | null> {
        return of(this.loginService.getUser());
    }

    /** Lista completa de amigos */
    getAmigos(): Observable<Usuario[]> {
        return of(this.mockFriends);
    }

    /** Ranking derivado da lista de amigos */
    getRanking(): Observable<Usuario[]> {
        const ranking = [...this.mockFriends].sort((a, b) => (b.maxCoin ?? 0) - (a.maxCoin ?? 0));
        return of(ranking);
    }

    getSetores(): Observable<string[]> {
        return of(this.setores);
    }

    getEquipesCentral(): Observable<string[]> {
        return of(this.equipesCentral);
    }

    getUsuarioPorSetor(setor: string): Observable<Usuario | null> {
        return of(this.usuariosPorSetor[setor] ?? null);
    }
}
