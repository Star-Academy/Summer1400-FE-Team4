import { ArtistService, SharedCommonService, Song } from '../common';
import { ActivatedRoute, convertToParamMap, ParamMap } from '@angular/router';
import { ArtistComponent } from './artist.component';
import { of, Subject } from 'rxjs';

describe('artistComponent', () => {
    let sharedCommon: SharedCommonService;
    let mockArtistService: jasmine.SpyObj<ArtistService>;
    let mockRouteParamMap: Subject<ParamMap>;
    let mockRoute: ActivatedRoute;
    let component: ArtistComponent;

    let dummySongs: Song[];

    beforeEach(() => {
        dummySongs = [
            { id: 1, name: 'eins', artist: 'Mohsen 1ganeh2', cover: 'url' },
            { id: 2, name: 'zwei', artist: 'Mohsen 1ganeh', cover: 'url' },
            { id: 3, name: 'drei', artist: 'Mohsen 1ganeh and 2ganeh', cover: 'url' },
        ] as Song[];

        sharedCommon = new SharedCommonService();
        mockArtistService = jasmine.createSpyObj<ArtistService>(['getSongsBy']);
        mockRouteParamMap = new Subject<ParamMap>();
        mockRoute = { paramMap: mockRouteParamMap.asObservable() } as ActivatedRoute;

        component = new ArtistComponent(sharedCommon, mockArtistService, mockRoute);
    });

    describe('ngOnInit', () => {
        it('should update topBarDark', () => {
            spyOn(sharedCommon.topBarDark, 'next').and.callThrough();
            component.ngOnInit();
            expect(sharedCommon.topBarDark.next).toHaveBeenCalled();
        });

        it('should handle paramMap changes and call getSongsBy', () => {
            mockArtistService.getSongsBy.and.returnValue(of(dummySongs));
            component.ngOnInit();

            const artistName = 'Mohsen 1ganeh';
            mockRouteParamMap.next(convertToParamMap({ name: artistName }));

            expect(mockArtistService.getSongsBy).toHaveBeenCalledOnceWith(artistName);
            expect(component.cards.length).toEqual(dummySongs.length);
            expect(component.artistImage).toBeTruthy();
            expect(component.artistName).toBe(artistName);
        });
    });
});
