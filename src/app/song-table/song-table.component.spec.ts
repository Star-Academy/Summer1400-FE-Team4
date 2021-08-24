import { ToastrService } from 'ngx-toastr';
import { EMPTY, of, throwError } from 'rxjs';
import { AuthService, FavoritesService, PlayerService, Song } from '../common';
import { SongTableComponent } from './song-table.component';

describe('SongTableComponent', () => {
    let component: SongTableComponent;
    let mockAuth: AuthService;
    let mockFavs: jasmine.SpyObj<FavoritesService>;
    let mockPlayer: jasmine.SpyObj<PlayerService>;
    let mockToastr: jasmine.SpyObj<ToastrService>;

    let dummyPlaylist: Song[];

    beforeEach(() => {
        dummyPlaylist = [
            { id: 1, name: 'eins' },
            { id: 2, name: 'zwei' },
            { id: 3, name: 'drei' },
        ] as Song[];

        mockAuth = {} as AuthService;
        mockFavs = jasmine.createSpyObj<FavoritesService>(['addSong', 'removeSong']);
        mockPlayer = jasmine.createSpyObj<PlayerService>(['play', 'pause', 'load', 'songDuration']);
        mockToastr = jasmine.createSpyObj<ToastrService>(['error', 'info']);

        component = new SongTableComponent(mockAuth, mockFavs, mockPlayer, mockToastr);
    });

    describe('ngOnChanges', () => {
        it('should call songDuration', () => {
            component.songs = dummyPlaylist;
            component.ngOnChanges();
            expect(mockPlayer.songDuration).toHaveBeenCalledTimes(dummyPlaylist.length);
        });
    });

    describe('likeSong', () => {
        it('should call addSong', () => {
            mockFavs.addSong.and.returnValue(EMPTY);
            component.likeSong(dummyPlaylist[1]);
            expect(mockFavs.addSong).toHaveBeenCalledOnceWith(dummyPlaylist[1]);
        });

        it('should handle success', () => {
            mockFavs.addSong.and.callFake(() => {
                expect(component.likeDisabled.has(dummyPlaylist[1].id)).toBeTrue();
                return of(void 0);
            });
            component.likeSong(dummyPlaylist[1]);

            expect(mockToastr.info).toHaveBeenCalled();
            expect(component.likeDisabled.has(dummyPlaylist[1].id)).toBeFalse();
        });

        it('should handle failure', () => {
            mockFavs.addSong.and.callFake(() => {
                expect(component.likeDisabled.has(dummyPlaylist[1].id)).toBeTrue();
                return throwError(new Error('argh'));
            });
            component.likeSong(dummyPlaylist[1]);

            expect(mockToastr.error).toHaveBeenCalledWith('argh');
            expect(component.likeDisabled.has(dummyPlaylist[1].id)).toBeFalse();
        });
    });

    describe('dislikeSong', () => {
        it('should call removeSong', () => {
            mockFavs.removeSong.and.returnValue(EMPTY);
            component.dislikeSong(dummyPlaylist[1]);
            expect(mockFavs.removeSong).toHaveBeenCalledOnceWith(dummyPlaylist[1]);
        });

        it('should handle success', () => {
            mockFavs.removeSong.and.callFake(() => {
                expect(component.likeDisabled.has(dummyPlaylist[1].id)).toBeTrue();
                return of(void 0);
            });
            component.dislikeSong(dummyPlaylist[1]);

            expect(mockToastr.info).toHaveBeenCalled();
            expect(component.likeDisabled.has(dummyPlaylist[1].id)).toBeFalse();
        });

        it('should handle failure', () => {
            mockFavs.removeSong.and.callFake(() => {
                expect(component.likeDisabled.has(dummyPlaylist[1].id)).toBeTrue();
                return throwError(new Error('argh'));
            });
            component.dislikeSong(dummyPlaylist[1]);

            expect(mockToastr.error).toHaveBeenCalledWith('argh');
            expect(component.likeDisabled.has(dummyPlaylist[1].id)).toBeFalse();
        });
    });

    describe('playSong', () => {
        it('should pass all songs if songs are of a playlist', () => {
            mockPlayer.play.and.returnValue(EMPTY);

            component.songs = dummyPlaylist;
            component.isPlaylist = true;
            component.playlistLink = '/favorites';
            component.playSong(dummyPlaylist[1]);

            expect(mockPlayer.load).toHaveBeenCalledOnceWith(
                dummyPlaylist,
                dummyPlaylist[1].id,
                '/favorites'
            );
        });

        it('should pass a single song if songs are not of a playlist', () => {
            mockPlayer.play.and.returnValue(EMPTY);

            component.songs = dummyPlaylist;
            component.isPlaylist = false;
            component.playlistLink = '/favorites';
            component.playSong(dummyPlaylist[1]);

            expect(mockPlayer.load).toHaveBeenCalledOnceWith(
                [dummyPlaylist[1]],
                dummyPlaylist[1].id
            );
        });

        it('should call play', () => {
            mockPlayer.play.and.returnValue(of(void 0));
            component.playSong(dummyPlaylist[1]);

            expect(mockPlayer.play).toHaveBeenCalled();
        });

        it('should handle play failure', () => {
            mockPlayer.play.and.returnValue(throwError(Error()));
            component.playSong(dummyPlaylist[1]);

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
