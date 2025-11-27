import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Premio, PremiosService } from '../services/premios.service';

@Component({
  selector: 'app-premios',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './premios.component.html',
  styleUrls: ['./premios.component.scss']
})
export class PremiosComponent {

  premios: Premio[] = [];

  constructor(private premiosService: PremiosService) {}

  ngOnInit() {
    this.premios = this.premiosService.getPremios();
  }
}
