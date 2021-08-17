import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
    user?: any;
    changeProfile(formValues: any) {}

    constructor() {}

    ngOnInit(): void {
        this.user = {
            username: '',
            password: '',
            email: '',
            firstName: '',
            lastName: '',
        };
    }
}
