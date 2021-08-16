import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SearchTermService } from '../common';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
    query: string = '';
    constructor(private router: Router, private searchTermService: SearchTermService) {}

    ngOnInit(): void {
        this.searchTermService.current.subscribe((current) => (this.query = current));
    }

    search(value: any) {
        this.router.navigate(['list', value.query]);
    }
}
