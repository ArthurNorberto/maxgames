import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-public-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './public-navbar.component.html',
  styleUrls: ['./public-navbar.component.scss']
})
export class PublicNavBarComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void { }

  navigateTo(event: any) {
    const value = event.target.value;

    if (value) {
      this.router.navigate([value]);
    }

    // reseta o select para manter o texto "Entrar"
    event.target.selectedIndex = 0;
  }
}
