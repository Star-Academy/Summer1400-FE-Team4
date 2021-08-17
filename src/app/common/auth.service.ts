import { UserSignUpModel } from './userSignUp.model';
import { Injectable } from '@angular/core';
import { root } from 'rxjs/internal-compatibility';
import { HttpClient, HttpHeaders } from '@angular/common/http';
const TOKEN_KEY = '__token__';
import { ApiService } from './api.service';
import { User } from './user.model';
import { tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    constructor(private api: ApiService) {}
    public signUp(user: UserSignUpModel) {
        return this.api
            .post<{ id: number; token: string }>('user/register', user)
            .pipe(tap((value) => localStorage.setItem('token', value.token)));
    }

    public signIn(userNameOrEmail: string, password: string) {
        let body: any;
        if (this.validateEmail(userNameOrEmail)) {
            body = { email: userNameOrEmail, password };
        } else body = { username: userNameOrEmail, password };

        return this.api
            .post<{ id: number; token: string }>('user/login', body)
            .pipe(tap((value) => localStorage.setItem('token', value.token)));
    }
    getUser(id: number) {
        return this.api.get<User>('user/one/' + `${id}`);
    }

    validateEmail(info: string) {
        const result =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return result.test(String(info).toLowerCase());
    }
}
