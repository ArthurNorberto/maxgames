import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Comentario, FeedService } from '../../../services/feed.service';
import { Usuario, UsuariosService } from '../../../services/usuarios.service';


@Component({
    selector: 'app-comments-modal',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './comments-modal.component.html',
    styleUrls: ['./comments-modal.component.scss']
})
export class CommentsModalComponent implements OnInit {

    @Input() postId!: string;

    @Output() close = new EventEmitter<void>();

    comments: Comentario[] = [];
    newComment: string = '';
    user!: Usuario;

    constructor(private feed: FeedService, private usuariosService: UsuariosService) { }

    ngOnInit(): void {
        this.feed.getComments(this.postId).subscribe(res => {
            this.comments = res;
        });

        this.usuariosService.getUsuarioAtual().subscribe((u: Usuario) => {
            this.user = u;
        });
    }

    enviarComentario() {
        if (!this.newComment.trim()) return;

        const comment: Comentario = {
            id: crypto.randomUUID(),
            postId: this.postId,
            userId: this.user.id,
            userNome: this.user.nome,
            avatar: this.user.avatar,
            message: this.newComment,
            createdAt: new Date().toISOString()
        };

        this.feed.addComment(comment).subscribe(() => {
            this.comments.push(comment);
            this.newComment = '';
        });
    }

    timeAgo(iso: string) {
        const diff = Date.now() - new Date(iso).getTime();
        const minutes = Math.floor(diff / 60000);
        if (minutes < 60) return `${minutes}m`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h`;
        return `${Math.floor(hours / 24)}d`;
    }
}
