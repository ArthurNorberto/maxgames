import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { MetasService, Meta } from '../services/metas.service';

@Component({
    selector: 'app-metas',
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule],
    templateUrl: './metas.component.html',
    styleUrls: ['./metas.component.scss']
})
export class MetasComponent implements OnInit {

    activeTab: 'daily' | 'monthly' = 'daily';
    search = '';

    filtered!: Observable<Meta[]>;
    metasAtivas!: Observable<Meta[]>;
    completedMetasCount = 0;

    constructor(private metasService: MetasService) { }

    ngOnInit(): void {
        this.updateStreams();
    }

    updateStreams() {
        this.filtered = this.metasService.filterMetas(this.activeTab, this.search);
        this.metasAtivas = this.metasService.getMetasByType(this.activeTab);

        this.metasAtivas.subscribe(metas => {
            this.completedMetasCount = metas.filter(m => m.completed).length;
        });
    }

    getAverageProgress(metas: Meta[]): number {
        if (!metas || metas.length === 0) return 0;
        const total = metas.reduce((sum, m) => sum + m.progress, 0);
        return total / metas.length;
    }


    switchTab(t: 'daily' | 'monthly') {
        this.activeTab = t;
        this.updateStreams();
    }

    toggleComplete(meta: Meta) {
        this.metasService.toggleComplete(meta);
    }

    addProgress(meta: Meta, amount = 10) {
        this.metasService.addProgress(meta, amount);
    }

}
