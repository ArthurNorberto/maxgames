import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Post, FeedService } from '../../../services/feed.service';
import { Usuario, UsuariosService } from '../../../services/usuarios.service';

@Component({
    selector: 'app-share-modal',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './share-modal.component.html',
    styleUrls: ['./share-modal.component.scss']
})
export class ShareModalComponent implements OnInit {

    @Input() post!: Post;
    @Output() close = new EventEmitter<void>();

    user!: Usuario;
    message = '';

    constructor(private feed: FeedService, private usuariosService: UsuariosService) { }
    ngOnInit(): void {

        this.usuariosService.getUsuarioAtual().subscribe((u: Usuario) => {
            this.user = u;
        });
    }

    timeAgo(iso?: string) {
        if (!iso) return '';
        const diff = Date.now() - new Date(iso).getTime();
        const minutes = Math.floor(diff / 60000);
        if (minutes < 60) return `${minutes}m`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h`;
        const days = Math.floor(hours / 24);
        return `${days}d`;
    }

    sendShare() {
        this.feed.sharePost(this.post, this.message, this.user);
        this.close.emit();
    }

}
