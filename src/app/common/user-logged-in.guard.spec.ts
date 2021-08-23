// auth.guard.spec.ts
import { Router, UrlTree } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';

import { AuthService } from './auth.service';
import { UserLoggedInGuard } from './user-logged-in.guard';

describe('UserLoggedInGuard', () => {
    let guard: UserLoggedInGuard;
    let mockRouter: jasmine.SpyObj<Router>;
    let mockAuth: jasmine.SpyObj<AuthService>;
    let mockToastr: jasmine.SpyObj<ToastrService>;

    beforeEach(() => {
        mockRouter = jasmine.createSpyObj<Router>('Router', ['createUrlTree']);
        mockToastr = jasmine.createSpyObj<ToastrService>('toastr', ['info']);
    });

    describe('when the user is logged in', () => {
        beforeEach(() => {
            mockAuth = jasmine.createSpyObj<AuthService>('AuthService', [], {
                isAuthenticated: of(true),
            });
            guard = new UserLoggedInGuard(mockAuth as AuthService, mockRouter, mockToastr);
        });

        it('should grant access', (done: DoneFn) => {
            guard.canActivate().subscribe((result) => {
                expect(result).toBeTrue();
                done();
            }, done.fail);
        });
    });

    describe('when the user is not logged in', () => {
        const urlTree = new UrlTree();

        beforeEach(() => {
            mockAuth = jasmine.createSpyObj<AuthService>('AuthService', [], {
                isAuthenticated: of(false),
            });
            guard = new UserLoggedInGuard(mockAuth as AuthService, mockRouter, mockToastr);

            mockRouter.createUrlTree.and.returnValue(urlTree);
        });

        it('should navigate to login page', (done: DoneFn) => {
            guard.canActivate().subscribe((result) => {
                expect(mockRouter.createUrlTree).toHaveBeenCalledOnceWith([jasmine.any(String)]);
                expect(result).toBe(urlTree);
                done();
            }, done.fail);
        });
    });
});
