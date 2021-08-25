import { SharedCommonService, Song, SongService } from '../common';
import { of, Subject } from 'rxjs';
import { SongListComponent } from './song-list.component';
import { ActivatedRoute, convertToParamMap, ParamMap } from '@angular/router';

describe('FavoritesComponent', () => {
    let sharedCommon: SharedCommonService;
    let mockSongService: jasmine.SpyObj<SongService>;
    let mockRouteParamMap: Subject<ParamMap>;
    let mockRoute: ActivatedRoute;
    let component: SongListComponent;

    let dummySongs1: Song[], dummySongs2: Song[];

    beforeEach(() => {
        dummySongs1 = [
            { id: 1, name: 'eins' },
            { id: 2, name: 'zwei' },
            { id: 3, name: 'drei' },
        ] as Song[];

        dummySongs2 = [
            { id: 5, name: 'fünf' },
            { id: 6, name: 'sechs' },
            { id: 7, name: 'sieben' },
            { id: 8, name: 'acht' },
        ] as Song[];

        mockSongService = jasmine.createSpyObj<SongService>({ getSongs: of(), findSongs: of() });
        sharedCommon = new SharedCommonService();
        mockRouteParamMap = new Subject<ParamMap>();
        mockRoute = { paramMap: mockRouteParamMap.asObservable() } as ActivatedRoute;

        component = new SongListComponent(sharedCommon, mockSongService, mockRoute);
    });

    describe('ngOnInit', () => {
        it('should update topBarDark', () => {
            spyOn(sharedCommon.topBarDark, 'next').and.callThrough();
            component.ngOnInit();

            expect(sharedCommon.topBarDark.next).toHaveBeenCalled();
        });

        it('should update currentSearchTerm', () => {
            spyOn(sharedCommon.currentSearchTerm, 'next').and.callThrough();
            component.ngOnInit();

            expect(sharedCommon.currentSearchTerm.next).not.toHaveBeenCalled();

            sharedCommon.currentSearchTerm.next('term ');

            expect(sharedCommon.currentSearchTerm.next).toHaveBeenCalledWith('term ');
        });

        it('should update songs', () => {
            mockSongService.getSongs.and.returnValue(of(dummySongs1));
            mockSongService.findSongs.and.returnValue(of(dummySongs2));

            component.ngOnInit();
            expect(component.loaded).toBe(false);

            mockRouteParamMap.next(convertToParamMap({}));

            expect(mockSongService.getSongs).toHaveBeenCalled();
            expect(mockSongService.findSongs).not.toHaveBeenCalled();

            expect(component.songs.length).toBe(dummySongs1.length);
            expect(component.loaded).toBe(true);

            mockRouteParamMap.next(convertToParamMap({ term: ' term \t ' }));

            expect(mockSongService.getSongs).toHaveBeenCalledTimes(1);
            expect(mockSongService.findSongs).toHaveBeenCalledOnceWith(
                'term',
                jasmine.anything(),
                jasmine.anything(),
                jasmine.anything()
            );

            expect(component.songs.length).toBe(dummySongs2.length);
            expect(component.loaded).toBe(true);
        });
    });
});
