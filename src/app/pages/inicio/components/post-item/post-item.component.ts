import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Post } from '../../../services/feed.service';
import { FeedService } from '../../../services/feed.service';
import { CommentsModalComponent } from '../comments-modal/comments-modal.component';
import { ShareModalComponent } from '../share-modal/share-modal.component';

@Component({
  selector: 'app-post-item',
  standalone: true,
  imports: [CommonModule, CommentsModalComponent, ShareModalComponent],
  templateUrl: './post-item.component.html',
  styleUrls: ['./post-item.component.scss']
})
export class PostItemComponent {
  @Input() post!: Post;
  @Input() compact = false;
  @Input() showVisibility = false;
  @Input() showActions = true;

  showCommentsModal = false;
  showShareModal = false;

  constructor(private feed: FeedService) { }

  get hasCounts() {
    return (
      (this.post.interactions.likes ?? 0) > 0 ||
      (this.post.interactions.comments ?? 0) > 0
    );
  }

  toggleLike() {
    this.feed.toggleLike(this.post.id);
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

  openComments() {
    this.showCommentsModal = true;
  }

  closeComments() {
    this.showCommentsModal = false;
  }


  openShare() {
    this.showShareModal = true;
  }

  closeShare() {
    this.showShareModal = false;
  }
}
