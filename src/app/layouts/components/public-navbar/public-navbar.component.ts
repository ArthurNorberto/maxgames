import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Usuario, UsuariosService } from '../../../pages/services/usuarios.service';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-public-navbar',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './public-navbar.component.html',
    styleUrls: ['./public-navbar.component.scss']
})
export class PublicNavBarComponent implements OnInit {


    constructor() { }

    ngOnInit(): void {

    }
}
