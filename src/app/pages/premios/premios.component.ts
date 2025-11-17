import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
    selector: 'app-premios',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './premios.component.html',
    styleUrls: ['./premios.component.scss']
})
export class PremiosComponent {

    constructor(private router: Router) { }
}
