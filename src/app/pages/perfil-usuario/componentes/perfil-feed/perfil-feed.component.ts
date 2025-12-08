import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostItemComponent } from '../../../inicio/components/post-item/post-item.component';
import { Usuario } from '../../../services/usuarios.service';
import { Post } from '../../../services/feed.service';

@Component({
    selector: 'app-perfil-feed',
    standalone: true,
    imports: [CommonModule, PostItemComponent],
    templateUrl: './perfil-feed.component.html',
    styleUrls: ['./perfil-feed.component.scss']
})
export class PerfilFeedComponent implements OnInit {

    @Input() usuario!: Usuario;

    elogios: { de: string, texto: string }[] = [];
    posts: Post[] = [];

    ngOnInit(): void {

        this.elogios = [
            { de: "Arthur", texto: "Parabéns pelo atendimento, mandou muito bem!" },
            { de: "Bianca", texto: "Super dedicada e sempre disposta a ajudar!" }
        ];

        // 🔥 Agora criando posts REALMENTE compatíveis com <app-post-item>
        this.posts = [
            {
                id: "pf1",
                userId: this.usuario.id,
                userNome: this.usuario.nome,
                userComunidade: this.usuario.comunidade,
                userTribo: this.usuario.tribo,
                avatar: this.usuario.avatar,
                type: "texto",
                visibilidade: "universo",
                message: "Ótimo dia de trabalho hoje :)",
                createdAt: new Date().toISOString(),
                interactions: { likes: 0, comments: 0, shares: 0 }
            },
            {
                id: "pf2",
                userId: this.usuario.id,
                userNome: this.usuario.nome,
                userComunidade: this.usuario.comunidade,
                userTribo: this.usuario.tribo,
                avatar: this.usuario.avatar,
                type: "texto",
                visibilidade: "universo",
                message: "Concluí um projeto importante!",
                createdAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
                interactions: { likes: 0, comments: 0, shares: 0 }
            }
        ];
    }
}
