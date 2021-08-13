import { Component, ElementRef, OnInit } from '@angular/core';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {
  albumCards = [ { id: 23, image: 'https://songs.code-star.ir/files/covers/Ali-Lohrasbi-Donyaye-Bi-To.jpg', title: 'چشم‌هایتان'} ];

  constructor() { }

  ngOnInit(): void {
  }

}
