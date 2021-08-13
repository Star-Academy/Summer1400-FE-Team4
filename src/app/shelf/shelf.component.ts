import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-shelf',
  templateUrl: './shelf.component.html',
  styleUrls: ['./shelf.component.scss'],
})
export class ShelfComponent implements OnInit {
  @Input() title?: string;
  @Input() cards: { id: any; image: string; title: string }[] = [];

  @Output() click = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  cardClick(id: any) {
    if (this.click) this.click.emit(id);
  }
}
