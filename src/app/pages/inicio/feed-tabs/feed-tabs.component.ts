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
        { key: 'universo', label: 'Universo' },
        { key: 'tribo', label: 'Tribo' },
        { key: 'comunidade', label: 'Comunidade' }
    ];

    active: string = 'universo';

    @Output() tabChange = new EventEmitter<string>();

    setTab(tab: string) {
        this.active = tab;
        this.tabChange.emit(tab);
    }
}
