import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
    selector: 'app-landing',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './landing.component.html',
    styleUrls: ['./landing.component.scss']
})
export class LandingComponent {

    public currentYear: number = new Date().getFullYear();
    constructor(private router: Router) {}

    goToLogin() {
        this.router.navigate(['/login']);
    }
}
