import { Component } from '@angular/core';
import { AuthService } from '../../common';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
    email: string = '';
    password: string = '';
    username: string = '';

    constructor(
        private authService: AuthService,
        private router: Router,
        private toastr: ToastrService
    ) {}

    login(formValues: any) {
        this.authService.signIn(formValues.email, formValues.password).subscribe(
            () => {
                this.router.navigate(['/']);
            },
            (response) => {
                this.toastr.error(response.message, undefined, {
                    positionClass: 'toast-top-left',
                });
            }
        );
    }
}
