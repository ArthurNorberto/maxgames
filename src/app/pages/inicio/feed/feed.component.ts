import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Post, FeedService } from '../../../pages/services/feed.service';
import { Usuario, UsuariosService } from '../../services/usuarios.service';
import { PostBoxComponent } from '../post-box/post-box.component';
import { PostItemComponent } from '../post-item/post-item.component';

@Component({
    selector: 'app-feed',
    standalone: true,
    imports: [CommonModule, PostItemComponent, PostBoxComponent],
    templateUrl: './feed.component.html',
    styleUrls: ['./feed.component.scss']
})
export class FeedComponent implements OnInit {
    posts: Post[] = [];
    loading = true;
    user!: Usuario | null;

    constructor(
        private feedService: FeedService,
        private usuarioService: UsuariosService
    ) { }

    ngOnInit(): void {
        this.usuarioService.getUsuarioAtual().subscribe(u => this.user = u);

        this.feedService.getFeed().subscribe(list => {
            this.posts = list;
            this.loading = false;
        });
    }


    handlePublicar(p: Post) {
        this.feedService.addPost(p);
        this.posts.unshift(p);
    }


    likePost(p: Post) {
        console.log('LIKE no post', p.id);
    }
}
