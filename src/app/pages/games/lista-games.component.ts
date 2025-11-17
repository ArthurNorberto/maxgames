import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
    selector: 'app-lista-games',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './lista-games.component.html',
    styleUrls: ['./lista-games.component.scss']
})
export class ListaGamesComponent {

    public currentYear: number = new Date().getFullYear();

    constructor(private router: Router) { }

    goTo(path: string) {
        this.router.navigate([path]);
    }
}
