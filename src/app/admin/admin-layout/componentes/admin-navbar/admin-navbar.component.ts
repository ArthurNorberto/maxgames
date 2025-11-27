import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { LoginService } from '../../../../pages/services/login.service';
import { Usuario } from '../../../../pages/services/usuarios.service';

@Component({
  selector: 'app-admin-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-navbar.component.html',
  styleUrls: ['./admin-navbar.component.scss']
})
export class AdminNavbarComponent implements OnInit {

  user: Usuario | null = null;
  constructor(
    private router: Router,
    private loginService: LoginService
  ) { }
  ngOnInit(): void {
    this.user = this.loginService.getUser();
  }

  logout() {
    this.loginService.logout();
    this.router.navigate(['/login']);
  }
}
