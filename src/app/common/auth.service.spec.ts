import { of } from 'rxjs';
import { first } from 'rxjs/operators';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';
import { UserSignUpModel } from './user-signup.model';
import { User, UserInfo } from './user.model';

describe('AuthService', () => {
    let mockApi: jasmine.SpyObj<ApiService>;
    let auth: AuthService;

    let storage: { [key: string]: any };

    beforeEach(() => {
        storage = {};
        spyOn(localStorage, 'getItem').and.callFake(function (key) {
            return storage[key] !== undefined ? storage[key] : null;
        });
        spyOn(localStorage, 'setItem').and.callFake(function (key, value) {
            storage[key] = value;
        });
        spyOn(localStorage, 'removeItem').and.callFake(function (key) {
            storage[key] = undefined;
        });

        mockApi = jasmine.createSpyObj<ApiService>('ApiService', ['get', 'post']);
        auth = new AuthService(mockApi);
    });

    describe('constructor', () => {
        const realGetUser = AuthService.prototype.getUser;

        beforeEach(() => {
            // spy on prototype, because it is called in the constructor
            spyOn(AuthService.prototype, 'getUser').and.returnValue(
                of({ id: 12, firstName: 'Sam' } as User)
            );

            auth = new AuthService(mockApi);
        });

        afterEach(() => {
            // restore the original method
            AuthService.prototype.getUser = realGetUser;
        });

        describe('when user is not logged in', () => {
            it('should update currentUser to null', (done) => {
                auth.currentUser.subscribe((user) => {
                    expect(user).toBeNull();
                    done();
                }, done.fail);
            });

            it('should not call get auth and get user', (done) => {
                auth.currentUser.subscribe((user) => {
                    expect(mockApi.get).not.toHaveBeenCalled();
                    expect(mockApi.post).not.toHaveBeenCalled();
                    expect(AuthService.prototype.getUser).not.toHaveBeenCalled();
                    done();
                }, done.fail);
            });
        });

        describe('when user is logged in', () => {
            beforeEach(() => {
                storage['authToken'] = 'tok';
                mockApi.post.and.returnValue(of({ id: 12 }));

                auth = new AuthService(mockApi);
            });

            it('should update currentUser', (done) => {
                auth.currentUser.subscribe((user) => {
                    if (user !== null) {
                        expect(user.id).toBe(12);
                        expect(user.firstName).toBe('Sam');
                        done();
                    }
                }, done.fail);
            });

            it('should call get auth and get user correctly', (done) => {
                auth.currentUser.subscribe((user) => {
                    expect(mockApi.post).toHaveBeenCalledOnceWith('user/auth', { token: 'tok' });
                    expect(AuthService.prototype.getUser).toHaveBeenCalledOnceWith(12);
                    done();
                }, done.fail);
            });
        });
    });

    describe('signUp', () => {
        const dummyInfo: UserSignUpModel = {
            username: 'username',
            email: 'email',
            password: 'password',
            firstName: 'Sam',
            lastName: '',
        };

        beforeEach(() => {
            mockApi.post.and.returnValue(of({ id: 12, token: 'tok' }));
            spyOn(auth, 'getUser').and.returnValue(of({ id: 12 } as User));
        });

        it('should call post with correct url and body', (done) => {
            auth.signUp(dummyInfo).subscribe(() => {
                expect(mockApi.post).toHaveBeenCalledOnceWith('user/register', dummyInfo);
                expect(auth.getUser).toHaveBeenCalledOnceWith(12);
                done();
            }, done.fail);
        });

        it('should update currentUser', (done) => {
            auth.currentUser.subscribe((user) => {
                if (user !== null) {
                    expect(user?.id).toBe(12);
                    done();
                }
            }, done.fail);

            auth.signUp(dummyInfo).subscribe();
        });

        it('should store auth token', (done) => {
            auth.signUp(dummyInfo).subscribe(() => {
                expect(auth.authToken).toBe('tok');
                done();
            }, done.fail);
        });
    });

    describe('signIn', () => {
        beforeEach(() => {
            mockApi.post.and.returnValue(of({ id: 13, token: 'tok' }));
            spyOn(auth, 'getUser').and.returnValue(of({ id: 13, firstName: 'Sam' } as User));
        });

        describe('if username is given', () => {
            it('should call post with correct url and body', (done) => {
                auth.signIn('username', 'password').subscribe(() => {
                    expect(mockApi.post).toHaveBeenCalledOnceWith('user/login', {
                        username: 'username',
                        password: 'password',
                    });
                    expect(auth.getUser).toHaveBeenCalledOnceWith(13);
                    done();
                }, done.fail);
            });
        });

        describe('if email is given', () => {
            it('should call post with correct url and body', (done) => {
                auth.signIn('Sam@emailing.company', 'password').subscribe(() => {
                    expect(mockApi.post).toHaveBeenCalledOnceWith('user/login', {
                        email: 'Sam@emailing.company',
                        password: 'password',
                    });
                    expect(auth.getUser).toHaveBeenCalledOnceWith(13);
                    done();
                }, done.fail);
            });
        });

        it('should update currentUser', (done) => {
            auth.currentUser.subscribe((user) => {
                if (user !== null) {
                    expect(user?.id).toBe(13);
                    done();
                }
            }, done.fail);

            auth.signIn('username', 'password').subscribe();
        });

        it('should store auth token', (done) => {
            auth.signIn('username', 'password').subscribe(() => {
                expect(auth.authToken).toBe('tok');
                done();
            }, done.fail);
        });
    });

    describe('editProfile', () => {
        const dummyOldUser = {
            id: 12,
            username: 'username',
            email: 'email',
            firstName: 'Sam',
        } as User;

        const dummyNewUser = {
            id: 12,
            username: 'username2',
            email: 'email2',
            firstName: 'Sam',
        } as User;

        const dummyInfo: UserInfo = {
            username: 'username2',
            email: 'email2',
            password: 'password2',
            firstName: 'Sam',
            lastName: '',
        };

        beforeEach(() => {
            auth.authToken = 'tok';
            auth.currentUser.next(dummyOldUser as User);

            mockApi.post.and.returnValue(of(undefined));
            spyOn(auth, 'getUser').and.returnValue(of(dummyNewUser));
        });

        it('should call post with correct url and body', (done) => {
            auth.editProfile(dummyInfo).subscribe(() => {
                expect(mockApi.post).toHaveBeenCalledOnceWith('user/alter', {
                    token: 'tok',
                    ...dummyInfo,
                });
                done();
            }, done.fail);
        });

        it('should update currentUser', (done) => {
            auth.currentUser.subscribe((user) => {
                if (user !== dummyOldUser) {
                    expect(user).toEqual(dummyNewUser);
                    expect(auth.getUser).toHaveBeenCalledOnceWith(dummyOldUser.id!);
                    done();
                }
            }, done.fail);

            auth.editProfile(dummyInfo).subscribe();
        });
    });

    describe('logOut', () => {
        beforeEach(() => {
            auth.authToken = 'tok';
            auth.currentUser.next({ id: 12 } as User);
            spyOn(auth, 'getUser').and.returnValue(of());
        });

        it('should clear stored auth token', () => {
            auth.logOut();
            expect(auth.authToken).toBeNull();
        });

        it('should update currentUser to null', (done) => {
            auth.currentUser.subscribe((user) => {
                if (user === null) {
                    expect(user).toBeNull();
                    expect(auth.getUser).not.toHaveBeenCalled();
                    done();
                }
            }, done.fail);
            auth.logOut();
        });
    });

    describe('getUser', () => {
        const dummyServerUser = {
            user: {
                id: 12,
                username: 'username',
                email: 'email',
                first_name: 'Sam',
                last_name: '',
                avatar: null,
                gender: null,
            },
        };

        const dummyUser: User = {
            id: 12,
            username: 'username',
            email: 'email',
            firstName: 'Sam',
            lastName: '',
            avatar: null,
        };

        beforeEach(() => {
            mockApi.get.and.returnValue(of(dummyServerUser));
        });

        it('should call post with correct url', (done) => {
            auth.getUser(12).subscribe(() => {
                expect(mockApi.get).toHaveBeenCalledOnceWith('user/one/12');
                done();
            }, done.fail);
        });

        it('should correctly parse the user', (done) => {
            auth.getUser(12).subscribe((user) => {
                expect(user).toEqual(dummyUser);
                done();
            }, done.fail);
        });
    });

    describe('authToken', () => {
        it('should return null when not set', () => {
            expect(auth.authToken).toBeNull();
        });

        it('should return token when set', () => {
            auth.authToken = 'tok';
            expect(auth.authToken).toBe('tok');
        });

        it('should store token on set', () => {
            auth.authToken = 'tok';
            expect(storage['authToken']).toBe('tok');
        });

        it('should remove token on set to null', () => {
            auth.authToken = 'tok';
            expect(storage['authToken']).toBe('tok');
            auth.authToken = null;
            expect(storage['authToken']).toBeUndefined();
        });
    });

    describe('isAuthenticated', () => {
        it('should be false when currentUser is null, otherwise false', (done) => {
            auth.currentUser.next({ id: 12 } as User);
            auth.isAuthenticated.pipe(first((authed) => authed === true)).subscribe((authed) => {
                expect(authed).toBeTrue();
                auth.currentUser.next(null);

                auth.isAuthenticated
                    .pipe(first((authed) => authed === false))
                    .subscribe((authed) => {
                        expect(authed).toBeFalse();
                        done();
                    }, done.fail);
            }, done.fail);
        });
    });
});
