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
  imageFile: File | null = null;
  previewImage: string | null = null;

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.imageFile = file;

    const reader = new FileReader();
    reader.onload = () => this.previewImage = reader.result as string;
    reader.readAsDataURL(file);
  }

  removerImagem() {
    this.imageFile = null;
    this.previewImage = null;
  }

  publicar() {
    if (!this.user) return;
    if (!this.text.trim() && !this.previewImage) return;

    const post: Post = {
      id: this.generateUUID(),
      userId: this.user.id,
      userNome: this.user.nome,
      avatar: this.user.avatar,
      userComunidade: this.user.comunidade,
      type: this.previewImage ? 'texto' : 'texto',
      message: this.text.trim() || undefined,
      imageUrl: this.previewImage || undefined,
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
    this.previewImage = null;
    this.imageFile = null;
  }

  private generateUUID(): string {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    array[6] = (array[6] & 0x0f) | 0x40;
    array[8] = (array[8] & 0x3f) | 0x80;
    return [...array].map(b => b.toString(16).padStart(2, '0')).join('');
  }
}
