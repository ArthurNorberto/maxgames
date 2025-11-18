import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { PublicNavBarComponent } from "../components/public-navbar/public-navbar.component";

@Component({
    selector: 'app-public-layout',
    standalone: true,
    imports: [CommonModule, RouterOutlet, PublicNavBarComponent],
    templateUrl: './public-layout.component.html',
    styleUrls: ['./public-layout.component.scss']
})
export class PublicLayoutComponent {
    name = '';
    sector = '';

    constructor(private router: Router) { }

}
