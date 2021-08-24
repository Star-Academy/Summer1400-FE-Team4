import { Component, Input, Output, EventEmitter } from '@angular/core';

export interface ShelfCard {
    id?: any;
    link?: any[];
    image: string;
    title: string;
}

@Component({
    selector: 'app-shelf',
    templateUrl: './shelf.component.html',
    styleUrls: ['./shelf.component.scss'],
})
export class ShelfComponent {
    @Input() title?: string;
    @Input() cards: ShelfCard[] = [];
    @Input() collapsed = false;
    @Input() collapsible = false;

    @Output() click = new EventEmitter();

    constructor() {}

    cardClick(id: any) {
        if (this.click) this.click.emit(id);
    }
}
