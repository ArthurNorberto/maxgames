import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
    selector: 'app-pagina-not-found',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './pagina-not-found.component.html',
    styleUrls: ['./pagina-not-found.component.scss']
})
export class PaginaNotFoundComponent {

    secretCounter = 0;
    showSecret = false;

    constructor(private router: Router) { }

    goHome() {
        this.router.navigate(['/inicio']);
    }

    secretClick() {
        this.secretCounter++;

        if (this.secretCounter >= 3) {
            this.showSecret = true;
        }

        // limpa depois de 5s
        setTimeout(() => {
            this.secretCounter = 0;
        }, 5000);
    }
}
