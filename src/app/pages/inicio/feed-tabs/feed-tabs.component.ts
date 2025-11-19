import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-feed-tabs',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './feed-tabs.component.html',
    styleUrls: ['./feed-tabs.component.scss']
})
export class FeedTabsComponent {
    tabs = [
        { key: 'universo', label: 'Universo', icon: 'bi-globe' },
        { key: 'tribo', label: 'Tribo', icon: 'bi-people' },
        { key: 'comunidade', label: 'Comunidade', icon: 'bi-building' }
    ];

    active = 'universo';

    @Output() tabChange = new EventEmitter<string>();

    setTab(key: string) {
        this.active = key;
        this.tabChange.emit(key);
    }

    getSliderPosition() {
        const index = this.tabs.findIndex(x => x.key === this.active);
        return `${index * (100 / this.tabs.length)}%`;
    }
}
