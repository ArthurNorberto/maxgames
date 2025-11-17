import { Injectable } from '@angular/core';
import { Usuario } from './usuarios.service';

@Injectable({ providedIn: 'root' })
export class LoginService {
  private readonly USER_KEY = 'maxplay_user';

  saveUser(user: any) {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  getUser(): Usuario {
    const data = localStorage.getItem(this.USER_KEY);
    return data ? JSON.parse(data) : null;
  }

  logout() {
    localStorage.removeItem(this.USER_KEY);
  }

  isLoggedIn() {
    return !!localStorage.getItem(this.USER_KEY);
  }
}
