import { ApiError, SharedCommonService, Song, SongService } from '../common';
import { ToastrService } from 'ngx-toastr';
import { LandingComponent } from './landing.component';
import { of, Subject, throwError } from 'rxjs';

describe('landingComponent', () => {
    let sharedCommon: SharedCommonService;
    let mockSongService: jasmine.SpyObj<SongService>;
    let mockToastr: ToastrService;
    let component: LandingComponent;

    let dummySongs: Song[];

    beforeEach(() => {
        dummySongs = [
            { id: 5, artist: '123', name: 'fünf' },
            { id: 6, artist: '12', name: 'sechs' },
            { id: 7, artist: '12', name: 'sieben' },
            { id: 8, artist: '123', name: 'acht' },
        ] as Song[];

        sharedCommon = new SharedCommonService();
        mockSongService = jasmine.createSpyObj<SongService>({ getSongs: of() });
        mockToastr = jasmine.createSpyObj<ToastrService>(['error']);

        component = new LandingComponent(sharedCommon, mockSongService, mockToastr);
    });

    describe('ngOnInit', () => {
        it('should update topBarDark', () => {
            spyOn(sharedCommon.topBarDark, 'next').and.callThrough();
            component.ngOnInit();

            expect(sharedCommon.topBarDark.next).toHaveBeenCalled();
        });

        it('should update songs on success', () => {
            mockSongService.getSongs.and.returnValue(of(dummySongs));
            component.ngOnInit();

            expect(component.albumCards.length).toBe(4);
            expect(component.singerCards.length).toBe(2);
            expect(component.newAlbumCards.length).toBe(4);

            expect(mockSongService.getSongs).toHaveBeenCalledTimes(3);
            expect(mockToastr.error).not.toHaveBeenCalled();
        });

        it('should handle error on failure', () => {
            mockSongService.getSongs.and.returnValue(throwError(new ApiError('argh!')));
            component.ngOnInit();

            expect(component.albumCards.length).toBe(0);
            expect(component.singerCards.length).toBe(0);
            expect(component.newAlbumCards.length).toBe(0);

            expect(mockSongService.getSongs).toHaveBeenCalledTimes(3);
            expect(mockToastr.error).toHaveBeenCalledTimes(3);
            expect(mockToastr.error).toHaveBeenCalledWith('argh!');
        });
    });
});
