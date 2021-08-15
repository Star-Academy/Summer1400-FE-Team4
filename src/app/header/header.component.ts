import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchTermService } from '../song-list/search-term.service';

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
