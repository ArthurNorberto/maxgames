import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AdminSidebarComponent } from './componentes/admin-sidebar/admin-sidebar.component';
import { AdminNavbarComponent } from './componentes/admin-navbar/admin-navbar.component';

@Component({
    selector: 'app-admin-layout',
    standalone: true,
    imports: [
        CommonModule,
        RouterOutlet,
        AdminSidebarComponent,
        AdminNavbarComponent
    ],
    templateUrl: './admin-layout.component.html',
    styleUrls: ['./admin-layout.component.scss']
})
export class AdminLayoutComponent implements OnInit {
    constructor() { }

    ngOnInit(): void {
    }
}
