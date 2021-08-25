import { SharedCommonService, Song, SongService } from '../common';
import { ActivatedRoute, convertToParamMap, ParamMap } from '@angular/router';
import { AlbumComponent } from './album.component';
import { of, Subject } from 'rxjs';

describe('albumComponent', () => {
    let sharedCommon: SharedCommonService;
    let mockSongService: jasmine.SpyObj<SongService>;
    let mockRouteParamMap: Subject<ParamMap>;
    let mockRoute: ActivatedRoute;
    let component: AlbumComponent;

    const dummySong = { id: 3, name: 'drei' } as Song;

    beforeEach(() => {
        sharedCommon = new SharedCommonService();
        mockSongService = jasmine.createSpyObj<SongService>(['getSong']);
        mockRouteParamMap = new Subject<ParamMap>();
        mockRoute = { paramMap: mockRouteParamMap.asObservable() } as ActivatedRoute;

        component = new AlbumComponent(sharedCommon, mockSongService, mockRoute);
    });

    describe('ngOnInit', () => {
        it('should update topBarDark', () => {
            spyOn(sharedCommon.topBarDark, 'next').and.callThrough();
            component.ngOnInit();
            expect(sharedCommon.topBarDark.next).toHaveBeenCalled();
        });

        it('should handle paramMap changes and call getSong', () => {
            mockSongService.getSong.and.returnValue(of(dummySong));
            component.ngOnInit();

            mockRouteParamMap.next(convertToParamMap({ id: ' 3 ' }));

            expect(mockSongService.getSong).toHaveBeenCalledOnceWith(3);
            expect(component.song).toEqual(dummySong);
        });
    });
});
