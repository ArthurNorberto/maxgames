import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Post } from '../../../pages/services/feed.service';

@Component({
    selector: 'app-post-item',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './post-item.component.html',
    styleUrls: ['./post-item.component.scss']
})
export class PostItemComponent {
    @Input() post!: Post;
    @Input() compact = false;            // modo compacto (perfil, listagens)
    @Input() showVisibility = false;     // mostra ícone de visibilidade
    @Input() showActions = true;         // mostrar botões/likes/etc


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
}
