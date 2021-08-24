import { ActivatedRoute, convertToParamMap, ParamMap } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EMPTY, Observable, of, Subject, throwError } from 'rxjs';
import {
    AuthService,
    FavoritesService,
    PlayerService,
    SharedCommonService,
    Song,
    SongService,
} from '../common';
import { SongComponent } from './song.component';

describe('SongComponent', () => {
    let component: SongComponent;
    let sharedCommon: SharedCommonService;
    let mockAuth: AuthService;
    let mockFavs: jasmine.SpyObj<FavoritesService>;
    let mockPlayer: jasmine.SpyObj<PlayerService>;
    let mockSongService: jasmine.SpyObj<SongService>;
    let mockRouteParamMap: Subject<ParamMap>;
    let mockRoute: ActivatedRoute;
    let mockToastr: jasmine.SpyObj<ToastrService>;

    const dummySong = { id: 3, name: 'drei' } as Song;

    beforeEach(() => {
        sharedCommon = new SharedCommonService();
        mockAuth = {} as AuthService;
        mockFavs = jasmine.createSpyObj<FavoritesService>(['addSong', 'removeSong']);
        mockPlayer = jasmine.createSpyObj<PlayerService>(['play', 'pause', 'load', 'songDuration']);
        mockSongService = jasmine.createSpyObj<SongService>(['getSong']);
        mockRouteParamMap = new Subject<ParamMap>();
        mockRoute = { paramMap: mockRouteParamMap.asObservable() } as ActivatedRoute;
        mockToastr = jasmine.createSpyObj<ToastrService>(['error', 'info']);

        spyOn(sharedCommon.topBarDark, 'next').and.callThrough();

        component = new SongComponent(
            sharedCommon,
            mockAuth,
            mockFavs,
            mockPlayer,
            mockSongService,
            mockRoute,
            mockToastr
        );
    });

    describe('ngOnInit', () => {
        it('should update topBarDark', () => {
            component.ngOnInit();
            expect(sharedCommon.topBarDark.next).toHaveBeenCalled();
        });

        it('should handle paramMap changes and call getSong and songDuration', () => {
            const dummyDuration = of(33);

            mockSongService.getSong.and.returnValue(of(dummySong));
            mockPlayer.songDuration.and.returnValue(dummyDuration);
            component.ngOnInit();

            mockRouteParamMap.next(convertToParamMap({ id: ' 3 ' }));

            expect(sharedCommon.topBarDark.next).toHaveBeenCalled();
            expect(mockSongService.getSong).toHaveBeenCalledOnceWith(3);
            expect(mockPlayer.songDuration).toHaveBeenCalledOnceWith(dummySong);

            expect(component.song).toEqual(dummySong);
            expect(component.duration).toBe(dummyDuration);
        });
    });

    describe('likeSong', () => {
        it('should call addSong', () => {
            mockFavs.addSong.and.returnValue(EMPTY);
            component.likeSong(dummySong);
            expect(mockFavs.addSong).toHaveBeenCalledOnceWith(dummySong);
        });

        it('should handle success', () => {
            mockFavs.addSong.and.callFake(() => {
                expect(component.likeDisabled).toBeTrue();
                return of(void 0);
            });
            component.likeSong(dummySong);

            expect(mockToastr.info).toHaveBeenCalled();
            expect(component.likeDisabled).toBeFalse();
        });

        it('should handle failure', () => {
            mockFavs.addSong.and.callFake(() => {
                expect(component.likeDisabled).toBeTrue();
                return throwError(new Error('argh'));
            });
            component.likeSong(dummySong);

            expect(mockToastr.error).toHaveBeenCalledWith('argh');
            expect(component.likeDisabled).toBeFalse();
        });
    });

    describe('dislikeSong', () => {
        it('should call removeSong', () => {
            mockFavs.removeSong.and.returnValue(EMPTY);
            component.dislikeSong(dummySong);
            expect(mockFavs.removeSong).toHaveBeenCalledOnceWith(dummySong);
        });

        it('should handle success', () => {
            mockFavs.removeSong.and.callFake(() => {
                expect(component.likeDisabled).toBeTrue();
                return of(void 0);
            });
            component.dislikeSong(dummySong);

            expect(mockToastr.info).toHaveBeenCalled();
            expect(component.likeDisabled).toBeFalse();
        });

        it('should handle failure', () => {
            mockFavs.removeSong.and.callFake(() => {
                expect(component.likeDisabled).toBeTrue();
                return throwError(new Error('argh'));
            });
            component.dislikeSong(dummySong);

            expect(mockToastr.error).toHaveBeenCalledWith('argh');
            expect(component.likeDisabled).toBeFalse();
        });
    });

    describe('playSong', () => {
        it('should pass a single song as playlist', () => {
            mockPlayer.play.and.returnValue(EMPTY);
            component.playSong(dummySong);

            expect(mockPlayer.load).toHaveBeenCalledOnceWith([dummySong], dummySong.id);
        });

        it('should call play', () => {
            mockPlayer.play.and.returnValue(of(void 0));
            component.playSong(dummySong);

            expect(mockPlayer.play).toHaveBeenCalled();
        });

        it('should handle play failure', () => {
            mockPlayer.play.and.returnValue(throwError(Error()));
            component.playSong(dummySong);

            expect(mockToastr.error).toHaveBeenCalled();
        });
    });

    describe('pauseSong', () => {
        it('should call pause', () => {
            component.pauseSong({} as Song);
            expect(mockPlayer.pause).toHaveBeenCalled();
        });
    });
});
