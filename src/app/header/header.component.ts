import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
    searchTerm: string = '';
    constructor(private route: Router) {}

    ngOnInit(): void {}

    search(value: any) {
        this.route.navigate(['list', value.query]);
    }
}
