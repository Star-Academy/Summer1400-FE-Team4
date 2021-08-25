import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Song } from './song.model';
import { SongService } from './song.service';

@Injectable()
export class ArtistService {
    constructor(private songService: SongService) {}

    getSongsBy(artistName: string): Observable<Song[]> {
        return this.songService.findSongs(artistName, 'name', false, 100000).pipe(
            map((songs: Song[]): Song[] => {
                return songs.filter((song: Song) => song.artist.indexOf(artistName) > -1);
            })
        );
    }
}
