import { SharedCommonService, SongService } from '../common';
import { ToastrService } from 'ngx-toastr';
import { LandingComponent } from './landing.component';
import { of, Subject } from 'rxjs';

describe('landingComponent', () => {
    let mockSharedCommon: SharedCommonService;
    let mockSongService: SongService;
    let mockToastr: ToastrService;
    let landingComponent: LandingComponent;

    beforeEach(() => {
        mockSongService = jasmine.createSpyObj('mockSongService', { getSongs: of() });
        mockToastr = jasmine.createSpyObj('mockToastr', ['success', 'error']);
        mockSharedCommon = jasmine.createSpyObj('mockSharedCommon', [], {
            topBarDark: new Subject<boolean>(),
        });
        landingComponent = new LandingComponent(mockSharedCommon, mockSongService, mockToastr);
    });
    describe('ngOnInit', () => {
        describe('getSongs', () => {
            it('should call getSongs()', () => {
                landingComponent.ngOnInit();
                expect(mockSongService.getSongs).toHaveBeenCalledTimes(3);
            });
        });
    });
});
