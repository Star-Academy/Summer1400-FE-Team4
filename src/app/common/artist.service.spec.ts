import { SongService } from './song.service';
import { Song } from './song.model';
import { of } from 'rxjs';
import { ArtistService } from './artist.service';

describe('ArtistService', () => {
    let mockSongService: jasmine.SpyObj<SongService>;
    let artistService: ArtistService;
    let songs: Partial<Song>[] = [
        { id: 1, name: 'yegane', artist: 'chavoshi' },
        { id: 2, name: 'taboot', artist: 'yegane' },
        { id: 3, name: 'sarnevesht', artist: 'shadmehr', lyrics: 'yegane' },
    ];
    beforeEach(() => {
        mockSongService = jasmine.createSpyObj<SongService>('songService', ['findSongs']);
        artistService = new ArtistService(mockSongService);
    });
    it('should filter artists by name', (done) => {
        mockSongService.findSongs.and.returnValue(of(songs as Song[]));

        artistService.getSongsBy('yegane').subscribe((songs) => {
            expect(songs.length).toBe(1);
            expect(songs[0].id).toBe(2);
            done();
        }, done.fail);
    });
});
