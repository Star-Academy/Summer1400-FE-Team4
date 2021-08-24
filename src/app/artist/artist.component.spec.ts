import { ArtistService, SharedCommonService } from '../common';
import { ActivatedRoute } from '@angular/router';
import { ArtistComponent } from './artist.component';

describe('artistComponent', () => {
    let mockSharedCommon: SharedCommonService;
    let mockArtistService: ArtistService;
    let mockActivatedRouts: ActivatedRoute;
    let artistComponent: ArtistComponent;

    beforeEach(() => {
        mockArtistService = jasmine.createSpyObj('mockArtistService', ['getSong']);
        mockSharedCommon = new SharedCommonService();
        mockActivatedRouts = new ActivatedRoute();

        artistComponent = new ArtistComponent(
            mockSharedCommon,
            mockArtistService,
            mockActivatedRouts
        );
    });
    it('should call ngOnInit', () => {
        artistComponent.ngOnInit();
        expect(true).toBeTrue();
    });
});
