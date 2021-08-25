import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SharedCommonService, AuthService } from '../common';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
    query: string = '';
    showPopUp: boolean = false;

    constructor(
        public sharedCommon: SharedCommonService,
        public auth: AuthService,
        private router: Router,
        private toastr: ToastrService
    ) {}

    ngOnInit(): void {
        this.sharedCommon.currentSearchTerm.subscribe((current) => (this.query = current));
    }

    search(value: any) {
        this.router.navigate(['/list', value.query]);
    }

    logOut() {
        this.auth.logOut();
        this.showPopUp = false;
        this.toastr.info('شما از حساب کاربری خود خارج شدید');
    }
}
