import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { LeftSidebarComponent } from '../components/left-sidebar/left-sidebar.component';
import { RightSidebarComponent } from '../components/right-sidebar/right-sidebar.component';
import { Usuario, UsuariosService } from '../../pages/services/usuarios.service';

@Component({
    selector: 'app-main-layout',
    standalone: true,
    imports: [
        CommonModule,
        RouterOutlet,
        NavbarComponent,
        LeftSidebarComponent,
        RightSidebarComponent
    ],
    templateUrl: './main-layout.component.html',
    styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent implements OnInit {
    constructor() { }

    ngOnInit(): void {
    }
}
