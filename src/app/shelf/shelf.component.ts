import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

export interface ShelfCard {
  id?: any;
  image: string;
  title: string;
}

@Component({
  selector: 'app-shelf',
  templateUrl: './shelf.component.html',
  styleUrls: ['./shelf.component.scss'],
})
export class ShelfComponent implements OnInit {
  @Input() title?: string;
  @Input() cards: ShelfCard[] = [];

  @Output() click = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  cardClick(id: any) {
    if (this.click) this.click.emit(id);
  }
}
