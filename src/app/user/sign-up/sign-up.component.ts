import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../common/auth.service';
import { Router } from '@angular/router';
import { UserSignUpModel } from '../../common';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-sign-up',
    templateUrl: './sign-up.component.html',
    styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit {
    email: string = '';
    password: string = '';
    username: string = '';
    firstName: string = '';
    lastName: string = '';

    constructor(
        private authService: AuthService,
        private router: Router,
        private toastr: ToastrService
    ) {}

    ngOnInit(): void {}

    register(formValues: any) {
        const user: UserSignUpModel = {
            username: formValues.username,
            email: formValues.email,
            password: formValues.password,
            firstName: formValues.firstName,
            lastName: formValues.lastName,
        };
        this.authService.signUp(user).subscribe(
            (result) => {
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
