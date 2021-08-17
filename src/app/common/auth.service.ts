import { UserSignUpModel } from './userSignUp.model';
import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { User } from './user.model';
import { map, tap } from 'rxjs/operators';
import { Observable, ReplaySubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    currentUser = new ReplaySubject<User | null>();
    constructor(private api: ApiService) {
        if (this.authToken !== null)
            this.api
                .post<{ id: number }>('user/auth', { token: this.authToken })
                .subscribe(({ id }) => this.getUser(id).subscribe(this.currentUser));
    }
    public signUp(user: UserSignUpModel) {
        return this.api.post<{ id: number; token: string }>('user/register', user).pipe(
            tap((value) => {
                this.authToken = value.token;
                this.getUser(value.id).subscribe(this.currentUser);
            })
        );
    }

    public signIn(userNameOrEmail: string, password: string) {
        let body: any;
        if (this.validateEmail(userNameOrEmail)) {
            body = { email: userNameOrEmail, password };
        } else body = { username: userNameOrEmail, password };

        return this.api.post<{ id: number; token: string }>('user/login', body).pipe(
            tap((value) => {
                this.authToken = value.token;
                this.getUser(value.id).subscribe(this.currentUser);
            })
        );
    }
    getUser(id: number): Observable<User> {
        return this.api.get<User>('user/one/' + `${id}`);
    }

    validateEmail(info: string) {
        const result =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return result.test(String(info).toLowerCase());
    }
    set authToken(value: string | null) {
        if (value === null) {
            localStorage.removeItem('token');
        } else localStorage.setItem('token', value);
    }
    get authToken(): string | null {
        return localStorage.getItem('token');
    }

    logOut() {
        this.authToken = null;
        this.currentUser.next(null);
    }

    isAuthenticated() {
        return this.currentUser.pipe(map((user) => user !== null));
    }
}
