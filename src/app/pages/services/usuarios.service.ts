import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { LoginService } from './login.service';

export interface Usuario {
    id: string;
    name: string;
    sector?: string;
    equipe?: string;
    login?: string;
    avatar?: string;
    score?: number;
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
            name: 'Bianca Vaz',
            sector: 'Central de Atendimento',
            login: 'bianca.vaz',
            avatar: 'assets/avatars/bianca-vaz.jpg',
            score: 820
        },
        'CIM': {
            id: '2',
            name: 'Nadia Barcellos',
            sector: 'CIM',
            login: 'nadia.barcellos',
            avatar: 'assets/avatars/nadia-barcellos.jpg',
            score: 910
        },
        'QA': {
            id: '3',
            name: 'Weylon Rodrigues',
            sector: 'QA',
            login: 'weylon.rodrigues',
            avatar: 'assets/avatars/weylon-rodrigues.jpg',
            score: 760
        },
        'Desenvolvimento': {
            id: '4',
            name: 'Arthur Norberto',
            sector: 'Desenvolvimento',
            login: 'arthur.norberto',
            avatar: 'assets/avatars/arthur.jpg',
            score: 1240
        }
    };

    // 🔹 Mock — futuramente substitui por API real
    private mockFriends: Usuario[] = [
        { id: '1', name: 'Ana Silva', sector: 'Central de Atendimento', login: '', avatar: 'assets/avatars/ana-silva.jpg', score: 1240 },
        { id: '2', name: 'Carlos Rocha', sector: 'CIM', login: '', avatar: 'assets/avatars/carlos.jpg', score: 980 },
        { id: '3', name: 'Mariana', sector: 'QA', login: '', avatar: 'assets/avatars/mariana.jpg', score: 760 },
        { id: '4', name: 'João Pedro', sector: 'Desenvolvimento', login: '', avatar: 'assets/avatars/joao-pedro.jpg', score: 540 },
        { id: '5', name: 'Roberta', login: '', avatar: 'assets/avatars/roberta.jpg', score: 860 },
        { id: '6', name: 'Felipe', login: '', avatar: 'assets/avatars/felipe.jpg', score: 320 },
        { id: '7', name: 'Sandra', login: '', avatar: 'assets/avatars/sandra.jpg', score: 1020 },
        { id: '8', name: 'Julia', login: '', avatar: 'assets/avatars/julia.jpg', score: 690 },
        { id: '9', name: 'Matheus', login: '', avatar: 'assets/avatars/matheus.jpg', score: 770 },
        { id: '10', name: 'Lucas Martins', login: '', avatar: 'assets/avatars/default.jpg', score: 830 },
        { id: '11', name: 'Patrícia Gomes', login: '', avatar: 'assets/avatars/default.jpg', score: 410 },
        { id: '12', name: 'Renato Carvalho', login: '', avatar: 'assets/avatars/default.jpg', score: 990 },
        { id: '13', name: 'Beatriz Farias', login: '', avatar: 'assets/avatars/default.jpg', score: 560 },
        { id: '14', name: 'Thiago Almeida', login: '', avatar: 'assets/avatars/default.jpg', score: 250 },
        { id: '15', name: 'Camila Duarte', login: '', avatar: 'assets/avatars/default.jpg', score: 720 },
        { id: '16', name: 'Eduardo Santos', login: '', avatar: 'assets/avatars/default.jpg', score: 1180 },
        { id: '17', name: 'Fernanda Lopes', login: '', avatar: 'assets/avatars/default.jpg', score: 640 },
        { id: '18', name: 'André Luiz', login: '', avatar: 'assets/avatars/default.jpg', score: 530 },
        { id: '19', name: 'Paula Morais', login: '', avatar: 'assets/avatars/default.jpg', score: 880 },
        { id: '20', name: 'Ricardo Nogueira', login: '', avatar: 'assets/avatars/default.jpg', score: 300 },
        { id: '21', name: 'Vanessa Ribeiro', login: '', avatar: 'assets/avatars/default.jpg', score: 760 },
        { id: '22', name: 'Diego Fernandes', login: '', avatar: 'assets/avatars/default.jpg', score: 150 },
        { id: '23', name: 'Larissa Barros', login: '', avatar: 'assets/avatars/default.jpg', score: 940 },
        { id: '24', name: 'Gustavo Teixeira', login: '', avatar: 'assets/avatars/default.jpg', score: 820 },
        { id: '25', name: 'Natália Freitas', login: '', avatar: 'assets/avatars/default.jpg', score: 675 },
        { id: '26', name: 'Rafael Correia', login: '', avatar: 'assets/avatars/default.jpg', score: 1025 },
        { id: '27', name: 'Isabela Torres', login: '', avatar: 'assets/avatars/default.jpg', score: 580 },
        { id: '28', name: 'Pedro Henrique', login: '', avatar: 'assets/avatars/default.jpg', score: 460 },
        { id: '29', name: 'Marcela Pires', login: '', avatar: 'assets/avatars/default.jpg', score: 730 }

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
        const ranking = [...this.mockFriends].sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
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
