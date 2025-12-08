import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Post } from '../../../services/feed.service';
import { Usuario } from '../../../services/usuarios.service';


@Component({
  selector: 'app-post-box',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './post-box.component.html',
  styleUrls: ['./post-box.component.scss']
})
export class PostBoxComponent implements OnInit {


  @Input() user!: Usuario | null;
  @Output() publicarPost = new EventEmitter<Post>();

  toggleSelect = false;
  visibilidade: 'universo' | 'tribo' | 'comunidade' = 'universo';
  text: string = '';
  imageFile: File | null = null;
  previewImage: string | null = null;
  audienceIcon = 'bi bi-globe2';

  ngOnInit(): void {
    document.addEventListener('click', () => {
      this.toggleSelect = false;
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.imageFile = file;

    const reader = new FileReader();
    reader.onload = () => this.previewImage = reader.result as string;
    reader.readAsDataURL(file);
  }

  setVisibilidade(tipo: 'universo' | 'tribo' | 'comunidade') {
    this.visibilidade = tipo;
    this.toggleSelect = false;

    const icons: any = {
      universo: 'bi bi-globe2',
      tribo: 'bi bi-diagram-3',
      comunidade: 'bi bi-people'
    };

    this.audienceIcon = icons[tipo];
  }

  onSelectorClick(event: MouseEvent) {
    event.stopPropagation();
    this.toggleSelect = !this.toggleSelect;
  }

  removerImagem() {
    this.imageFile = null;
    this.previewImage = null;
  }

  updateIcon() {
    const icons: any = {
      universo: 'bi bi-globe2',
      tribo: 'bi bi-diagram-3',
      comunidade: 'bi bi-people'
    };

    this.audienceIcon = icons[this.visibilidade];
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
      userTribo: this.user.tribo,

      type: 'texto',
      visibilidade: this.visibilidade,

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
    this.visibilidade = 'universo';
  }


  private generateUUID(): string {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    array[6] = (array[6] & 0x0f) | 0x40;
    array[8] = (array[8] & 0x3f) | 0x80;
    return [...array].map(b => b.toString(16).padStart(2, '0')).join('');
  }
}
