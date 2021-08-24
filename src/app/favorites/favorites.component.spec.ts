import { FavoritesService, SharedCommonService, Song } from '../common';
import { FavoritesComponent } from './favorites.component';
import { ReplaySubject } from 'rxjs';

describe('favoritesComponent', () => {
    let mockSharedCommon: SharedCommonService;
    let mockFavoriteService: FavoritesService;
    let favoriteComponent: FavoritesComponent;

    beforeEach(() => {
        mockFavoriteService = jasmine.createSpyObj('mockFavoriteService', ['addSong']);
        mockSharedCommon = new SharedCommonService();
        favoriteComponent = new FavoritesComponent(mockSharedCommon, mockFavoriteService);
        mockFavoriteService.songs = new ReplaySubject<Song[] | undefined>(1);
    });

    it('should call ngOnInit', () => {
        // spyOnProperty(mockFavoriteService, 'songs').and.returnValue(of([]));
        mockFavoriteService.songs.next(undefined);
        favoriteComponent.ngOnInit();
        expect(favoriteComponent.loaded).toBeFalse();
    });
});
