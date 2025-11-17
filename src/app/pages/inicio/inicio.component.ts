import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeedComponent } from './feed/feed.component';




@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, FeedComponent],
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss']
})
export class InicioComponent implements OnInit {



  constructor() { }

  ngOnInit(): void {

  }
}
