import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../common';

@Injectable()
export class UserLoggedInGaurd implements CanActivate {
    constructor(private auth: AuthService, private router: Router, private toastr: ToastrService) {}

    canActivate(): Observable<boolean | UrlTree> {
        return this.auth.isAuthenticated.pipe(
            map((authed) => {
                if (authed) return true;
                else {
                    this.toastr.info('برای این بخش باید وارد حساب کاربری شوید');
                    return this.router.createUrlTree(['/user/login']);
                }
            })
        );
    }
}
