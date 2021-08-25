import { FavoritesService, SharedCommonService, Song } from '../common';
import { FavoritesComponent } from './favorites.component';
import { ReplaySubject } from 'rxjs';

describe('FavoritesComponent', () => {
    let sharedCommon: SharedCommonService;
    let mockFavoriteService: FavoritesService;
    let component: FavoritesComponent;

    let dummyPlaylist: Song[];

    beforeEach(() => {
        dummyPlaylist = [
            { id: 1, name: 'eins' },
            { id: 2, name: 'zwei' },
            { id: 3, name: 'drei' },
        ] as Song[];

        mockFavoriteService = {
            songs: new ReplaySubject<Song[] | undefined>(1),
        } as FavoritesService;
        sharedCommon = new SharedCommonService();
        component = new FavoritesComponent(sharedCommon, mockFavoriteService);
    });

    describe('ngOnInit', () => {
        it('should update topBarDark', () => {
            spyOn(sharedCommon.topBarDark, 'next').and.callThrough();
            component.ngOnInit();

            expect(sharedCommon.topBarDark.next).toHaveBeenCalled();
        });

        it('should update songs', () => {
            component.ngOnInit();
            expect(component.loaded).toBe(false);

            mockFavoriteService.songs.next(dummyPlaylist);

            expect(component.songs.length).toBe(dummyPlaylist.length);
            expect(component.loaded).toBe(true);

            mockFavoriteService.songs.next(undefined);

            expect(component.songs.length).toBe(0);
            expect(component.loaded).toBe(true);
        });
    });
});
