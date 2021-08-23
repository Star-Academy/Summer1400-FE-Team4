import { of } from 'rxjs';
import { SongService } from './song.service';
import { ApiService } from './api.service';

describe('songService', () => {
    let mockApi: jasmine.SpyObj<ApiService>;
    let songService: SongService;
    let date = new Date(200);
    let songs: any = [
        { id: 1, name: 'yegane', artist: 'chavoshi' },
        { id: 2, name: 'taboot', artist: 'yegane' },
        { id: 3, name: 'sarnevesht', artist: 'shadmehr', lyrics: 'yegane', publish_date: date },
    ];
    beforeEach(() => {
        mockApi = jasmine.createSpyObj('mockApi', ['get', 'post']);
        songService = new SongService(mockApi);
    });
    describe('getSong', () => {
        it('should call with right url', (done) => {
            mockApi.get.and.returnValue(of({ song: songs[1] }));
            songService.getSong(2).subscribe((song) => {
                expect(song.artist).toBe('yegane');
                expect(mockApi.get).toHaveBeenCalledOnceWith('song/one/2');
                done();
            }, done.fail);
        });
    });

    describe('getSongs', () => {
        it('should return song with id ', (done) => {
            mockApi.post.and.returnValue(of({ songs }));
            songService.getSongs('name', true, 10, 1).subscribe((song) => {
                expect(mockApi.post).toHaveBeenCalledOnceWith('song/page', jasmine.anything());
                expect(song[0].id).toBe(1);
                done();
            }, done.fail);
        });
    });
    describe('findSongs', () => {
        it('should return with correct url ', (done) => {
            mockApi.post.and.returnValue(of({ songs }));
            songService.findSongs('yegane', 'name', true, 10).subscribe((song) => {
                expect(mockApi.post).toHaveBeenCalledOnceWith('song/find', jasmine.anything());
                expect(song[0].id).toBe(1);
                done();
            }, done.fail);
        });
    });
    describe('parseSong', () => {
        it('should return song with correct id', () => {
            expect(songService.parseSong(songs[0]).id).toBe(1);
        });
        it('should return song with correct id', () => {
            expect(songService.parseSong(songs[2]).publishDate).toBe(date);
        });
    });
});
