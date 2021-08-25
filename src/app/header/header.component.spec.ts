import { AuthService, SharedCommonService } from '../common';
import { ToastrService } from 'ngx-toastr';
import { HeaderComponent } from './header.component';
import { Router } from '@angular/router';

describe('headerComponent', () => {
    let mockSharedCommon: SharedCommonService;
    let mockAuthService: AuthService;
    let mockToastr: ToastrService;
    let headerComponent: HeaderComponent;
    let router: Router;

    beforeEach(() => {
        mockAuthService = jasmine.createSpyObj<AuthService>('mockAuthService', ['logOut']);
        mockToastr = jasmine.createSpyObj<ToastrService>('mockToastr', [
            'success',
            'error',
            'info',
        ]);
        mockSharedCommon = new SharedCommonService();
        router = jasmine.createSpyObj('router', ['navigate']);

        headerComponent = new HeaderComponent(
            mockSharedCommon,
            mockAuthService,
            router,
            mockToastr
        );
    });
    describe('ngOnInit', () => {
        it('should subscribe currentSearchTerm', function () {
            headerComponent.ngOnInit();
            mockSharedCommon.currentSearchTerm.next('ahang');
            expect(headerComponent.query).toBe('ahang');
        });
    });
    describe('search', () => {
        it('should navigate by search ', function () {
            headerComponent.search('yechizi');
            expect(router.navigate).toHaveBeenCalled();
        });
    });
    describe('logOut', () => {
        it('should log out', () => {
            headerComponent.logOut();
            expect(headerComponent.showPopUp).toBeFalse();
        });
    });
});
