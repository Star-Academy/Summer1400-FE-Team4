import { UserSignUpModel } from './user-signup.model';
import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { User, UserInfo } from './user.model';
import { map, take, tap } from 'rxjs/operators';
import { Observable, ReplaySubject } from 'rxjs';

@Injectable()
export class AuthService {
    currentUser = new ReplaySubject<User | null>(1);

    constructor(private api: ApiService) {
        if (this.authToken !== null) {
            this.api
                .post<{ id: number }>('user/auth', { token: this.authToken })
                .subscribe(({ id }) =>
                    this.getUser(id).subscribe((user) => this.currentUser.next(user))
                );
        } else {
            this.currentUser.next(null);
        }
    }

    public signUp(user: UserSignUpModel) {
        return this.api.post<{ id: number; token: string }>('user/register', user).pipe(
            tap((value) => {
                this.authToken = value.token;
                this.getUser(value.id).subscribe((user) => this.currentUser.next(user));
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
                this.getUser(value.id).subscribe((user) => this.currentUser.next(user));
            })
        );
    }

    public editProfile(user: UserInfo) {
        const alterUser = { ...user, token: this.authToken };

        return this.api.post<void>('user/alter', alterUser).pipe(
            tap(() => {
                this.currentUser.pipe(take(1)).subscribe((nextUser) => {
                    if (nextUser !== null) {
                        this.getUser(nextUser.id).subscribe((newUser) => {
                            this.currentUser.next(newUser)
                            console.log(newUser);
                        });
                    }
                });
            })
        );
    }

    logOut() {
        this.authToken = null;
        this.currentUser.next(null);
    }

    getUser(id: number): Observable<User> {
        return this.api.get<{ user: any }>('user/one/' + `${id}`).pipe(
            map(
                ({ user }): User => ({
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    firstName: user.first_name,
                    lastName: user.last_name,
                    avatar: user.avatar,
                })
            )
        );
    }

    set authToken(value: string | null) {
        if (value === null) {
            localStorage.removeItem('authToken');
        } else localStorage.setItem('authToken', value);
    }

    get authToken(): string | null {
        return localStorage.getItem('authToken');
    }

    get isAuthenticated() {
        return this.currentUser.pipe(map((user) => user !== null));
    }

    private validateEmail(info: string) {
        const result =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return result.test(String(info).toLowerCase());
    }
}
