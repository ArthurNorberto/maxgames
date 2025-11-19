import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Post, FeedService } from '../../../pages/services/feed.service';
import { Usuario, UsuariosService } from '../../../pages/services/usuarios.service';
import { PostBoxComponent } from '../post-box/post-box.component';
import { PostItemComponent } from '../post-item/post-item.component';
import { FeedTabsComponent } from '../feed-tabs/feed-tabs.component';

@Component({
    selector: 'app-feed',
    standalone: true,
    imports: [CommonModule, PostBoxComponent, PostItemComponent, FeedTabsComponent],
    templateUrl: './feed.component.html',
    styleUrls: ['./feed.component.scss']
})
export class FeedComponent implements OnInit {
    posts: Post[] = [];
    filtered: Post[] = [];
    loading = true;
    user!: Usuario | null;
    activeTab: 'universo' | 'tribo' | 'comunidade' = 'universo';

    constructor(
        private feedService: FeedService,
        private usuarioService: UsuariosService
    ) { }

    ngOnInit(): void {
        this.usuarioService.getUsuarioAtual().subscribe(u => {
            this.user = u;
            // após ter user, podemos aplicar filtro quando posts chegarem
            this.applyFilter();
        });

        this.feedService.getFeed().subscribe(list => {
            this.posts = list;
            this.applyFilter();
            this.loading = false;
        });
    }

    handlePublicar(p: Post) {
        // adiciona localmente e atualiza visual
        this.posts.unshift(p);
        this.applyFilter();
    }

    onTabChange(tabKey: string) {
        if (tabKey === 'universo' || tabKey === 'tribo' || tabKey === 'comunidade') {
            this.activeTab = tabKey;
            this.applyFilter();
            // leve animação de foco poderia ser acionada aqui (classes CSS)
        }
    }

    applyFilter() {
        switch (this.activeTab) {

            case 'universo':
                this.filtered = this.posts.filter(p =>
                    p.visibilidade === 'universo'
                );
                break;

            case 'tribo':
                this.filtered = this.posts.filter(p =>
                    p.visibilidade === 'tribo' &&
                    p.userTribo === this.user?.tribo
                );
                break;

            case 'comunidade':
                this.filtered = this.posts.filter(p =>
                    p.visibilidade === 'comunidade' &&
                    p.userComunidade === this.user?.comunidade
                );
                break;
        }
    }



    likePost(p: Post) {
        console.log('LIKE', p.id);
    }
}
