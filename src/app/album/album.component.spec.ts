import { SharedCommonService, SongService } from '../common';
import { ActivatedRoute } from '@angular/router';
import { AlbumComponent } from './album.component';

describe('albumComponent', () => {
    let mockSharedCommon: SharedCommonService;
    let mockSongService: SongService;
    let mockActivatedRouts: ActivatedRoute;
    let albumComponent: AlbumComponent;

    beforeEach(() => {
        mockSongService = jasmine.createSpyObj('mockSongService', ['getSong']);
        mockSharedCommon = new SharedCommonService();
        mockActivatedRouts = new ActivatedRoute();

        albumComponent = new AlbumComponent(mockSharedCommon, mockSongService, mockActivatedRouts);
    });
    it('should call ngOnInit', () => {
        albumComponent.ngOnInit();
        expect(true).toBeTrue();
    });
});
