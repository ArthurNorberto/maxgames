import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Usuario } from './usuarios.service';

export interface PostInteraction {
  likes: number;
  comments: number;
  shares: number;
  likedByUser?: boolean;
}

export interface Post {
  id: string;
  userId: string;
  userNome: string;
  userComunidade?: string;
  userTribo?: string;
  avatar?: string;
  type: 'jogo' | 'texto' | 'conquista';
  visibilidade: 'universo' | 'tribo' | 'comunidade';
  message?: string;
  action?: string;
  game?: string;
  points?: number;
  imageUrl?: string;
  createdAt: string;
  interactions: PostInteraction;
  sharedPost?: Post;
}

export interface Comentario {
  id: string;
  postId: string;
  userId: string;
  userNome: string;
  avatar: string;
  message: string;
  createdAt: string;
}


@Injectable({ providedIn: 'root' })
export class FeedService {

  // FEED REATIVO
  private posts$ = new BehaviorSubject<Post[]>([]);

  // MOCK INICIAL
  private mockPosts: Post[] = [
    {
      id: 'p10',
      userId: '1',
      userNome: 'Ana Silva',
      userComunidade: 'Central de Atendimento',
      avatar: 'assets/avatars/ana-silva.jpg',
      type: 'texto',
      visibilidade: 'universo',
      message: 'Bom dia, pessoal! Hoje é dia de bater recorde 🔥',
      createdAt: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
      interactions: { likes: 12, comments: 3, shares: 0 }
    },
    {
      id: 'p1',
      userId: '1',
      userNome: 'Ana Silva',
      userComunidade: 'Central de Atendimento',
      avatar: 'assets/avatars/ana-silva.jpg',
      type: 'jogo',
      visibilidade: 'universo',
      action: 'fez 420 pontos no Acerte ou Erre',
      points: 420,
      game: 'Acerte ou Erre',
      createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
      interactions: { likes: 4, comments: 1, shares: 0 }
    },
    {
      id: 'p2',
      userId: '2',
      userNome: 'Carlos Rocha',
      userComunidade: 'CIM',
      avatar: 'assets/avatars/carlos.jpg',
      type: 'conquista',
      visibilidade: 'universo',
      action: 'bateu recorde no AutoWordle — 5 tentativas',
      game: 'AutoWordle',
      createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      interactions: { likes: 20, comments: 6, shares: 1 }
    },
    {
      id: 'p3',
      userId: '3',
      userNome: 'Mariana',
      userComunidade: 'CIM',
      avatar: 'assets/avatars/mariana.jpg',
      type: 'jogo',
      visibilidade: 'universo',
      action: 'subiu 3 posições no ranking semanal!',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      interactions: { likes: 9, comments: 2, shares: 0 }
    },
    {
      id: 'p7',
      userId: '9',
      userNome: 'Matheus',
      userComunidade: 'Desenvolvimento',
      avatar: 'assets/avatars/matheus.jpg',
      type: 'texto',
      visibilidade: 'universo',
      message: 'Alguém me ajuda no quiz do AutoWordle? 😂',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
      interactions: { likes: 3, comments: 4, shares: 0 }
    }
  ];

  private mockComments: Comentario[] = [
    {
      id: 'c1',
      postId: 'p10',
      userId: '2',
      userNome: 'Carlos Rocha',
      avatar: 'assets/avatars/carlos.jpg',
      message: 'Mandou bem demais!! 🔥🔥🔥',
      createdAt: new Date(Date.now() - 1000 * 60 * 2).toISOString()
    },
    {
      id: 'c2',
      postId: 'p10',
      userId: '3',
      userNome: 'Mariana',
      avatar: 'assets/avatars/mariana.jpg',
      message: 'Bora bater meta! 💙',
      createdAt: new Date(Date.now() - 1000 * 60 * 1).toISOString()
    }
  ];

  constructor() {
    // alimente o observable na inicialização
    this.posts$.next([...this.mockPosts]);
  }

  // ---------------------------- FEED ---------------------------- //

  getFeed(): Observable<Post[]> {
    return this.posts$.asObservable();
  }

  private emitUpdate() {
    this.posts$.next([...this.mockPosts]);
  }

  publishTextPost(user: Usuario, text: string): Observable<boolean> {
    const newPost: Post = {
      id: 'p' + (Math.random() * 999999).toFixed(0),
      userId: user.id,
      userNome: user.nome,
      avatar: user.avatar,
      userComunidade: user.comunidade,
      type: 'texto',
      visibilidade: 'universo',
      message: text,
      createdAt: new Date().toISOString(),
      interactions: { likes: 0, comments: 0, shares: 0 }
    };

    this.mockPosts.unshift(newPost);
    this.emitUpdate();
    return of(true);
  }

  toggleLike(postId: string): void {
    const post = this.mockPosts.find(p => p.id === postId);
    if (!post) return;

    post.interactions.likedByUser = !post.interactions.likedByUser;
    post.interactions.likes += post.interactions.likedByUser ? 1 : -1;

    this.emitUpdate();
  }

  addPost(p: Post) {
    this.mockPosts.unshift(p);
    this.emitUpdate();
  }

  // ---------------------------- COMENTÁRIOS ---------------------------- //

  getComments(postId: string): Observable<Comentario[]> {
    return of(this.mockComments.filter(c => c.postId === postId));
  }

  addComment(comment: Comentario): Observable<boolean> {
    this.mockComments.push(comment);

    const post = this.mockPosts.find(p => p.id === comment.postId);
    if (post) {
      post.interactions.comments++;
    }

    this.emitUpdate();
    return of(true);
  }

  // ---------------------------- COMPARTILHAMENTO ---------------------------- //

  sharePost(original: Post, message: string, user: Usuario) {

    const shared: Post = {
      id: crypto.randomUUID(),
      userId: user.id,
      userNome: user.nome,
      avatar: user.avatar,
      userComunidade: user.comunidade ?? '',
      type: 'texto',
      visibilidade: 'universo',
      message: message || undefined,
      createdAt: new Date().toISOString(),

      sharedPost: original,

      interactions: {
        likes: 0,
        comments: 0,
        shares: 0,
        likedByUser: false
      }
    };

    // adiciona no começo
    this.mockPosts.unshift(shared);

    // incrementa compartilhamento do post original
    const post = this.mockPosts.find(p => p.id === original.id);
    if (post) {
      post.interactions.shares++;
    }

    this.emitUpdate();
  }

}
