import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Song } from './song.model';
import { ApiService } from './api.service';

type Sorter = 'name' | 'artist';

@Injectable()
export class SongService {
    constructor(private api: ApiService) {}

    getSong(id: number): Observable<Song> {
        return this.api.get<any>(`song/one/${id}`).pipe(
            map((result: any): Song => {
                return this.parseSong(result.song);
            })
        );
    }

    getSongs(
        sortBy?: Sorter,
        descending?: boolean,
        pageSize: number = 10,
        currentPage = 1
    ): Observable<Song[]> {
        return this.api
            .post<any>('song/page', {
                size: pageSize,
                current: currentPage,
                sorter: sortBy,
                desc: descending,
            })
            .pipe(
                map((result: any): Song[] => {
                    return result.songs.map(this.parseSong);
                })
            );
    }

    findSongs(
        phrase: string,
        sortBy?: Sorter,
        descending?: boolean,
        count: number = 10
    ): Observable<Song[]> {
        return this.api
            .post<any>('song/find', {
                phrase: phrase,
                count: count,
                sorter: sortBy,
                desc: descending,
            })
            .pipe(
                map((result: any): Song[] => {
                    return result.songs.map(this.parseSong);
                })
            );
    }

    private parseSong(song: any): Song {
        return {
            id: song.id,
            name: song.name,
            artist: song.artist,
            lyrics: song.lyrics,
            file: song.file,
            cover: song.cover,
            publishDate: song.publish_date,
        };
    }
}
