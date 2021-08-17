import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
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
        private searchTermService: SearchTermService,
        private toastr: ToastrService
    ) {}

    ngOnInit(): void {
        this.searchTermService.current.subscribe((current) => (this.query = current));
    }

    search(value: any) {
        this.router.navigate(['/list', value.query]);
    }

    logOut() {
        this.auth.logOut();
        this.showPopUp = false;
        this.toastr.info('شما از حساب کاربری خود خارج شدید')
    }
}
