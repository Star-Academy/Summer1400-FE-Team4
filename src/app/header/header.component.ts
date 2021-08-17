import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SearchTermService } from '../common';
import { AuthService } from '../common';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
    query: string = '';
    showPopUp: boolean = false;

    constructor(
        public auth: AuthService,
        private router: Router,
        private searchTermService: SearchTermService
    ) {}

    ngOnInit(): void {
        this.searchTermService.current.subscribe((current) => (this.query = current));
    }

    search(value: any) {
        this.router.navigate(['/list', value.query]);
    }
    logOut() {
        this.router.navigate(['/user/login']);
        this.auth.logOut();
    }
}
