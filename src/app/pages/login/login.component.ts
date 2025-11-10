import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  name = '';
  sector = '';

  constructor(private router: Router, private loginService: LoginService) {}

  login() {
    const user = { name: this.name, sector: this.sector };
    this.loginService.saveUser(user);
    this.router.navigate(['/inicio']);
  }
}
