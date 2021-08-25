import { Injectable } from '@angular/core';
import { Observable, of, ReplaySubject, throwError } from 'rxjs';
import { first, map, mergeAll, tap } from 'rxjs/operators';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';
import { Song } from './song.model';
import { SongService } from './song.service';

// note: this class might suffer from race conditions.
@Injectable()
export class FavoritesService {
    private PLAYLIST_NAME = 'favorites' as const;
    private version: number = 0;
    private playlistId?: number;
    songs = new ReplaySubject<Song[] | undefined>(1);

    constructor(
        private api: ApiService,
        private auth: AuthService,
        private songService: SongService
    ) {
        this.auth.currentUser.subscribe((user) => {
            if (user === null) {
                this.version++;
                this.playlistId = undefined;
                this.songs.next(undefined);
            } else {
                // the user could suddenly log out in the middle of fetching the playlist.
                // lastVersion is for version control
                const lastVersion = this.version;
                api.post<{ id: number; name: string; songs: any[] }[]>('playlist/all', {
                    token: auth.authToken,
                }).subscribe((playlists) => {
                    const favoritesPlaylist = playlists.find(
                        (playlist) => playlist.name === this.PLAYLIST_NAME
                    );

                    if (favoritesPlaylist !== undefined) {
                        // playlist already exists
                        if (lastVersion === this.version) {
                            this.version++;
                            this.playlistId = favoritesPlaylist.id;
                            this.songs.next(favoritesPlaylist.songs.map(songService.parseSong));
                        }
                    } else {
                        // playlist doesn't exist, so create an empty one
                        api.post<{ id: number }>('playlist/create', {
                            token: auth.authToken,
                            name: this.PLAYLIST_NAME,
                        }).subscribe(({ id }) => {
                            if (lastVersion === this.version) {
                                this.version++;
                                this.playlistId = id;
                                this.songs.next([]);
                            }
                        });
                    }
                });
            }
        });
    }

    addSong(toAdd: Song): Observable<void> {
        return this.songs.pipe(first()).pipe(
            map((songs): Observable<void> => {
                if (songs === undefined)
                    return throwError(new Error('کاربر وارد حساب کاربری نشده'));

                if (songs.find((song) => song.id === toAdd.id) !== undefined) {
                    // song already exists
                    return of(void 0);
                }

                // add for now
                this.version++;
                this.songs.next(songs.concat([toAdd]));

                return this.api
                    .post<void>('playlist/add-song', {
                        token: this.auth.authToken,
                        playlistId: this.playlistId,
                        songId: toAdd.id,
                    })
                    .pipe(
                        tap({
                            error: () => {
                                this.songs.pipe(first()).subscribe((songs) => {
                                    if (songs !== undefined) {
                                        this.version++;
                                        this.songs.next(
                                            songs.filter((song) => song.id !== toAdd.id)
                                        );
                                    }
                                });
                            },
                        })
                    );
            }),
            mergeAll()
        );
    }

    removeSong(toRemove: Song): Observable<void> {
        return this.songs.pipe(first()).pipe(
            map((songs): Observable<void> => {
                if (songs === undefined)
                    return throwError(new Error('کاربر وارد حساب کاربری نشده'));

                if (songs.find((song) => song.id === toRemove.id) === undefined) {
                    // song does not exist
                    return of();
                }

                // remove for now
                this.version++;
                this.songs.next(songs.filter((song) => song.id !== toRemove.id));

                return this.api
                    .post<void>('playlist/remove-song', {
                        token: this.auth.authToken,
                        playlistId: this.playlistId,
                        songId: toRemove.id,
                    })
                    .pipe(
                        tap({
                            error: () => {
                                this.songs.pipe(first()).subscribe((songs) => {
                                    if (songs !== undefined) {
                                        this.version++;
                                        this.songs.next(songs.concat([toRemove]));
                                    }
                                });
                            },
                        })
                    );
            }),
            mergeAll()
        );
    }

    isFavorite(id: number): Observable<boolean> {
        return this.songs.pipe(map((songs) => songs?.find((song) => song.id === id) !== undefined));
    }
}
