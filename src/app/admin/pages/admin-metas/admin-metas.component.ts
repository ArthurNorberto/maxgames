import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BehaviorSubject, combineLatest, map } from 'rxjs';
import { Meta, MetasService } from '../../../pages/services/metas.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-admin-metas',
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    templateUrl: './admin-metas.component.html',
    styleUrls: ['./admin-metas.component.scss']
})
export class AdminMetasComponent implements OnInit {

    filter$ = new BehaviorSubject<string>('');
    type$ = new BehaviorSubject<'daily' | 'monthly'>('daily');

    metas$: any;

    form!: FormGroup;
    showForm = false;
    editingMeta: Meta | null = null;

    constructor(
        private metasService: MetasService,
        private fb: FormBuilder
    ) { }

    ngOnInit() {

        this.metas$ = combineLatest([
            this.type$,
            this.filter$,
            this.metasService.metas$
        ]).pipe(
            map(([type, filter, list]) => {
                const s = filter.toLowerCase();
                return list
                    .filter(m => m.type === type)
                    .filter(m =>
                        !s ||
                        m.title.toLowerCase().includes(s) ||
                        m.description.toLowerCase().includes(s) ||
                        m.target.toLowerCase().includes(s)
                    )
                    .sort(
                        (a, b) =>
                            Number(b.completed) - Number(a.completed) ||
                            b.progress - a.progress
                    );
            })
        );

        this.form = this.fb.group({
            id: [0],
            title: ['', Validators.required],
            description: ['', Validators.required],
            target: ['', Validators.required],
            reward: ['', Validators.required],
            type: ['daily', Validators.required],
            progress: [0],
            completed: [false],
        });
    }

    newMeta() {
        this.editingMeta = null;
        this.form.reset({
            id: 0,
            title: '',
            description: '',
            target: '',
            reward: '',
            type: 'daily',
            progress: 0,
            completed: false
        });
        this.showForm = true;
    }

    edit(meta: Meta) {
        this.editingMeta = meta;
        this.form.patchValue(meta);
        this.showForm = true;
    }

    delete(meta: Meta) {
        if (!confirm('Deseja realmente excluir esta meta?')) return;

        const all = [...this.metasService['metasSubject'].value];
        const next = all.filter(m => m.id !== meta.id);
        this.metasService['metasSubject'].next(next);
    }

    save() {
        if (this.form.invalid) return;

        const meta = this.form.value as Meta;
        const list = [...this.metasService['metasSubject'].value];

        if (meta.id === 0) {
            meta.id = Math.max(0, ...list.map(m => m.id)) + 1;
            list.push(meta);
        } else {
            const index = list.findIndex(m => m.id === meta.id);
            if (index !== -1) list[index] = meta;
        }

        this.metasService['metasSubject'].next(list);
        this.showForm = false;
    }

    trackById(_: number, meta: Meta) {
        return meta.id;
    }
}
