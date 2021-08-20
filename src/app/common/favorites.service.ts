import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ApiError, ApiService } from './api.service';
import { AuthService } from './auth.service';
import { Playlist } from './playlist.model';
import { Song } from './song.model';
import { SongService } from './song.service';

// note: this class seems to suffer from race conditions.
@Injectable()
export class FavoritesService {
    PLAYLIST_NAME = 'favorites' as const;
    songs = new BehaviorSubject<Song[] | undefined>(undefined);
    version: number = 0;
    playlistId?: number;

    constructor(
        private api: ApiService,
        private auth: AuthService,
        private songService: SongService
    ) {
        this.auth.currentUser.subscribe((user) => {
            if (user === null) {
                this.version++;
                this.playlistId = undefined;
                this.songs.next([]);
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
                            }
                        });
                    }
                });
            }
        });
    }

    addSong(toAdd: Song): Observable<void> {
        if (this.songs.value === undefined)
            return throwError(new ApiError('کاربر وارد حساب کاربری نشده'));

        if (this.songs.value.find((song) => song.id === toAdd.id) !== undefined) {
            // song already exists
            return of();
        }

        // add for now
        this.version++;
        this.songs.next(this.songs.value.concat([toAdd]));

        return this.api
            .post<void>('playlist/add-song', {
                token: this.auth.authToken,
                playlistId: this.playlistId,
                songId: toAdd.id,
            })
            .pipe(
                tap({
                    error: () => {
                        if (this.songs.value !== undefined) {
                            this.version++;
                            this.songs.next(
                                this.songs.value.filter((song) => song.id !== toAdd.id)
                            );
                        }
                    },
                })
            );
    }

    removeSong(toRemove: Song): Observable<void> {
        if (this.songs.value === undefined)
            return throwError(new ApiError('کاربر وارد حساب کاربری نشده'));

        if (this.songs.value.find((song) => song.id === toRemove.id) === undefined) {
            // song does not exist
            return of();
        }

        // remove for now
        this.version++;
        this.songs.next(this.songs.value.filter((song) => song.id !== toRemove.id));

        return this.api
            .post<void>('playlist/remove-song', {
                token: this.auth.authToken,
                playlistId: this.playlistId,
                songId: toRemove.id,
            })
            .pipe(
                tap({
                    error: () => {
                        if (this.songs.value !== undefined) {
                            this.version++;
                            this.songs.next(this.songs.value.concat([toRemove]));
                        }
                    },
                })
            );
    }

    isFavorite(id: number): Observable<boolean> {
        return this.songs.pipe(map((songs) => songs?.find((song) => song.id === id) !== undefined));
    }
}
