import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Usuario } from '../../../pages/services/usuarios.service';
import { Post } from '../../../pages/services/feed.service';

@Component({
  selector: 'app-post-box',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './post-box.component.html',
  styleUrls: ['./post-box.component.scss']
})
export class PostBoxComponent {

  @Input() user!: Usuario | null;
  @Output() publicarPost = new EventEmitter<Post>();

  text: string = '';

  publicar() {
    if (!this.text.trim() || !this.user) return;

    const post: Post = {
      id: crypto.randomUUID(),
      userId: this.user.id,
      userName: this.user.name,
      avatar: this.user.avatar,
      userSector: this.user.sector,

      type: 'texto',
      message: this.text.trim(),

      createdAt: new Date().toISOString(),

      interactions: {
        likes: 0,
        comments: 0,
        shares: 0,
        likedByUser: false
      }
    };

    this.publicarPost.emit(post);
    this.text = '';
  }
}
