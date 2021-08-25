import { ToastrService } from 'ngx-toastr';
import { of, throwError } from 'rxjs';
import { AuthService } from '../../common';
import { Router } from '@angular/router';
import { SignUpComponent } from './sign-up.component';

describe('SignUpComponent', () => {
    let mockAuthService: jasmine.SpyObj<AuthService>;
    let router: jasmine.SpyObj<Router>;
    let mockToastr: jasmine.SpyObj<ToastrService>;
    let signUpComponent: SignUpComponent;

    beforeEach(() => {
        mockAuthService = jasmine.createSpyObj<AuthService>(['signUp']);
        mockToastr = jasmine.createSpyObj<ToastrService>(['success', 'error']);
        router = jasmine.createSpyObj<Router>(['navigate']);

        signUpComponent = new SignUpComponent(mockAuthService, router, mockToastr);
    });
    describe('register', () => {
        it('should call register', () => {
            mockAuthService.signUp.and.returnValue(of({} as any));
            signUpComponent.register({});

            expect(mockAuthService.signUp).toHaveBeenCalled();
            expect(router.navigate).toHaveBeenCalled();
        });
        it('should call toastr', () => {
            mockAuthService.signUp.and.returnValue(throwError(Error('error')));
            signUpComponent.register({});

            expect(mockAuthService.signUp).toHaveBeenCalled();
            expect(mockToastr.error).toHaveBeenCalledOnceWith(
                'error',
                undefined,
                jasmine.anything()
            );
        });
    });
});
