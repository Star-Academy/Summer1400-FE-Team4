import { EMPTY, of, ReplaySubject, throwError } from 'rxjs';
import { bufferCount, first, take } from 'rxjs/operators';
import { ApiError, ApiService } from './api.service';
import { AuthService } from './auth.service';
import { FavoritesService } from './favorites.service';
import { Song } from './song.model';
import { SongService } from './song.service';
import { User } from './user.model';

describe('FavoritesService', () => {
    let mockApi: jasmine.SpyObj<ApiService>;
    let mockAuth: jasmine.SpyObj<AuthService>;
    let mockSongService: SongService;
    let favService: FavoritesService;
    let dummyPlaylist: Song[];

    beforeEach(() => {
        dummyPlaylist = [
            { id: 1, name: 'eins' },
            { id: 2, name: 'zwei' },
            { id: 3, name: 'drei' },
        ] as Song[];

        mockApi = jasmine.createSpyObj<ApiService>(['post']);
        mockAuth = jasmine.createSpyObj<AuthService>([], { authToken: 'tok' });
        mockAuth.currentUser = new ReplaySubject<User | null>(1);
        mockSongService = {
            parseSong: SongService.prototype.parseSong,
        } as SongService;
    });

    describe('when user is not logged in', () => {
        beforeEach(() => {
            mockAuth.currentUser.next(null);
            favService = new FavoritesService(mockApi, mockAuth, mockSongService);
        });

        describe('constructor', () => {
            it('should update songs to undefined', (done) => {
                favService.songs.subscribe((songs) => {
                    expect(songs).toBeUndefined();
                    done();
                }, done.fail);
            });
        });

        describe('addSong', () => {
            it('should throw an error', (done) => {
                favService.addSong({ id: 12 } as Song).subscribe(
                    () => {
                        done.fail('no error was thrown');
                    },
                    (error) => {
                        expect(error).toBeDefined();
                        done();
                    }
                );
            });
        });

        describe('removeSong', () => {
            it('should throw an error', (done) => {
                favService.removeSong({ id: 12 } as Song).subscribe(
                    () => {
                        done.fail('no error was thrown');
                    },
                    (error) => {
                        expect(error).toBeDefined();
                        done();
                    }
                );
            });
        });
    });

    describe('when user is logged in', () => {
        beforeEach(() => {
            mockAuth.currentUser.next({ id: 12 } as User);
        });

        describe('constructor', () => {
            it('should only update songs if playlist exists', (done) => {
                mockApi.post.and.callFake((path, body): any => {
                    if (path === 'playlist/all') {
                        expect(body).toEqual({ token: 'tok' });
                        return of([{ id: 12, name: 'favorites', songs: dummyPlaylist }]);
                    }
                    done.fail('invalid path argument in call of api post');
                });

                favService = new FavoritesService(mockApi, mockAuth, mockSongService);
                favService.songs.subscribe((songs) => {
                    expect(songs?.length).toEqual(3);
                    expect(mockApi.post).toHaveBeenCalledTimes(1);
                    done();
                }, done.fail);
            });

            it('should create a new playlist if playlist does not exist', (done) => {
                mockApi.post.and.callFake((path, body): any => {
                    if (path === 'playlist/all') {
                        expect(body).toEqual({ token: 'tok' });
                        return of([{ id: 13, name: 'hated', songs: dummyPlaylist }]);
                    } else if (path === 'playlist/create') {
                        expect(body).toEqual({ name: 'favorites', token: 'tok' });
                        return of({ id: 12 });
                    }
                    done.fail('invalid path argument in call of api post');
                });

                favService = new FavoritesService(mockApi, mockAuth, mockSongService);
                favService.songs.subscribe((songs) => {
                    expect(songs?.length).toEqual(0);
                    expect(mockApi.post).toHaveBeenCalledTimes(2);
                    done();
                }, done.fail);
            });
        });

        describe('addSong', () => {
            beforeEach(() => {
                mockApi.post.and.returnValue(
                    of([{ id: 12, name: 'favorites', songs: dummyPlaylist }])
                );
                favService = new FavoritesService(mockApi, mockAuth, mockSongService);
            });

            it('should add song if post succeeded', (done) => {
                favService.songs.pipe(bufferCount(2), first()).subscribe(([songs1, songs2]) => {
                    expect(songs1?.length).toBe(3);
                    expect(songs2?.length).toBe(4);
                    done();
                }, done.fail);

                mockApi.post.and.callFake(() => {
                    return EMPTY;
                });
                favService.addSong({ id: 10, name: 'zen' } as Song).subscribe();
            });

            it('should add then remove song if post failed', (done) => {
                favService.songs
                    .pipe(bufferCount(3), first())
                    .subscribe(([songs1, songs2, songs3]) => {
                        expect(songs1?.length).toBe(3);
                        expect(songs2?.length).toBe(4);
                        expect(songs3?.length).toBe(3);
                        done();
                    }, done.fail);

                mockApi.post.and.callFake(() => {
                    return throwError(new ApiError(''));
                });
                favService.addSong({ id: 10, name: 'zen' } as Song).subscribe(
                    () => {
                        done.fail('an error was thrown but the observable succeeded');
                    },
                    (error) => {}
                );
            });
        });

        describe('removeSong', () => {
            beforeEach(() => {
                mockApi.post.and.returnValue(
                    of([{ id: 12, name: 'favorites', songs: dummyPlaylist }])
                );
                favService = new FavoritesService(mockApi, mockAuth, mockSongService);
            });

            it('should remove song if post succeeded', (done) => {
                favService.songs.pipe(bufferCount(2), first()).subscribe(([songs1, songs2]) => {
                    expect(songs1?.length).toBe(3);
                    expect(songs2?.length).toBe(2);
                    done();
                }, done.fail);

                mockApi.post.and.callFake(() => {
                    return EMPTY;
                });
                favService.removeSong({ id: 2, name: 'zwei' } as Song).subscribe();
            });

            it('should remove then add song if post failed', (done) => {
                favService.songs
                    .pipe(bufferCount(3), first())
                    .subscribe(([songs1, songs2, songs3]) => {
                        expect(songs1?.length).toBe(3);
                        expect(songs2?.length).toBe(2);
                        expect(songs3?.length).toBe(3);
                        done();
                    }, done.fail);

                mockApi.post.and.callFake(() => {
                    return throwError(new ApiError(''));
                });
                favService.removeSong({ id: 2, name: 'zwei' } as Song).subscribe(
                    () => {
                        done.fail('an error was thrown but the observable succeeded');
                    },
                    (error) => {}
                );
            });
        });
    });

    describe('isFavorite', () => {
        it('should work', () => {
            favService = new FavoritesService(mockApi, mockAuth, mockSongService);
            favService.songs.next(dummyPlaylist);
            favService.isFavorite(2).subscribe((faved1) => {
                expect(faved1).toBeTrue();
                favService.isFavorite(5).subscribe((faved2) => {
                    expect(faved2).toBeFalse();
                });
            });
        });
    });
});
