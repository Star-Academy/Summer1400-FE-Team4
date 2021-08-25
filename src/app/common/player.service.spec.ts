import { first } from 'rxjs/operators';
import { PlayerService } from './player.service';
import { Song } from './song.model';

describe('PlayerService', () => {
    let player: PlayerService;
    let mockAudio: jasmine.SpyObj<HTMLAudioElement>;
    let mockAudioSrc: string;
    let dummyPlaylist: Song[];

    beforeEach(() => {
        mockAudio = spyOnAllFunctions(new Audio());
        spyOnProperty(mockAudio, 'duration', 'get').and.returnValue(24);
        spyOnProperty(mockAudio, 'src', 'get').and.callFake(() => mockAudioSrc);
        spyOnProperty(mockAudio, 'src', 'set').and.callFake((src) => (mockAudioSrc = src));

        mockAudio.play.and.callFake(async () => {
            if (mockAudio.onplaying) mockAudio.onplaying(new Event('playing'));
        });
        mockAudio.pause.and.callFake(() => {
            if (mockAudio.onpause) mockAudio.onpause(new Event('pause'));
        });

        player = new PlayerService(mockAudio);

        dummyPlaylist = [
            { id: 1, file: 'file1' },
            { id: 2, file: 'file2' },
            { id: 3, file: 'file3' },
        ] as Song[];
    });

    describe('load', () => {
        it('should set audio src, but not play', () => {
            player.load([{ id: 1, file: 'file' }] as Song[], 1);
            expect(mockAudio.src).toBe('file');
            expect(mockAudio.play).not.toHaveBeenCalled();
        });

        it("should throw error if song id isn't in the playlist", () => {
            expect(() => {
                player.load([{ id: 1, file: 'file' }] as Song[], 2);
            }).toThrowError();
        });

        it('should only set audio src if song id is new', () => {
            mockAudio.src = 'old';
            player.currentSong.next({ id: 2, file: 'old' } as Song);
            player.load([{ id: 2, file: 'new' }] as Song[], 2);
            expect(mockAudio.src).toBe('old');
        });

        it('should update subjects correctly', () => {
            for (const i of [0, 1, 2]) {
                player.load(dummyPlaylist, i + 1, '/favorites');

                expect(player.playlist.value).toEqual(dummyPlaylist);
                expect(player.playlistLink.value).toEqual('/favorites');
                expect(player.currentSong.value).toEqual(dummyPlaylist[i]);
                expect(player.currentSongIndex.value).toEqual(i);
            }
        });
    });

    describe('play', () => {
        it('should call audio play', (done) => {
            player.play().subscribe(() => {
                expect(mockAudio.play).toHaveBeenCalled();
                expect(player.state.value).toBe('playing');
                done();
            }, done.fail);
        });
    });

    describe('pause', () => {
        it('should call audio pause', () => {
            player.pause();
            expect(mockAudio.pause).toHaveBeenCalled();
            expect(player.state.value).toBe('paused');
        });
    });

    describe('seek', () => {
        it('should call audio fast seek', () => {
            player.seek(12);
            expect(mockAudio.currentTime).toBe(12);
        });
    });

    describe('next', () => {
        it('should go to the next song in playlist', () => {
            player.load(dummyPlaylist, 2);
            player.next();

            expect(player.currentSong.value?.id).toBe(3);
            expect(mockAudio.src).toBe('file3');
            expect(mockAudio.play).toHaveBeenCalled();
        });

        it('should repeat playlist when repeat set to true', () => {
            player.load(dummyPlaylist, 3);
            player.next();

            expect(player.currentSong.value?.id).toBe(1);
            expect(mockAudio.src).toBe('file1');
            expect(mockAudio.play).toHaveBeenCalled();
        });

        it('should stop playback when repeat set to false', () => {
            player.load(dummyPlaylist, 3);
            player.next(false);

            expect(player.currentSong.value?.id).toBe(3);
            expect(mockAudio.src).toBe('file3');
            expect(mockAudio.play).not.toHaveBeenCalled();
        });
    });

    describe('previous', () => {
        it('should go to the previous song in playlist', () => {
            player.load(dummyPlaylist, 2);
            player.previous();

            expect(player.currentSong.value?.id).toBe(1);
            expect(mockAudio.src).toBe('file1');
            expect(mockAudio.play).toHaveBeenCalled();
        });

        it('should repeat playlist when repeat set to true', () => {
            player.load(dummyPlaylist, 1);
            player.previous();

            expect(player.currentSong.value?.id).toBe(3);
            expect(mockAudio.src).toBe('file3');
            expect(mockAudio.play).toHaveBeenCalled();
        });

        it('should stop playback when repeat set to false', () => {
            player.load(dummyPlaylist, 1);
            player.previous(false);

            expect(player.currentSong.value?.id).toBe(1);
            expect(mockAudio.src).toBe('file1');
            expect(mockAudio.play).not.toHaveBeenCalled();
        });
    });

    describe('songState', () => {
        it('should work', (done) => {
            player.load(dummyPlaylist, 2);
            player
                .songState(dummyPlaylist[1])
                .pipe(first((state) => state === 'paused'))
                .subscribe((state1) => {
                    player
                        .songState(dummyPlaylist[1])
                        .pipe(first((state2) => state2 === 'playing'))
                        .subscribe((state2) => {
                            expect(state2).toBe('playing');
                            player.songState(dummyPlaylist[0]).subscribe((state3) => {
                                expect(state3).toBe('paused');
                                done();
                            }, done.fail);
                        }, done.fail);

                    expect(state1).toBe('paused');
                    player.play().subscribe({ error: done.fail });
                }, done.fail);
        });
    });

    describe('audio', () => {
        describe('onwaiting', () => {
            it('should change state to loading', () => {
                if (mockAudio.onwaiting) {
                    mockAudio.onwaiting(new Event('waiting'));
                    expect(player.state.value).toBe('loading');
                }
            });
        });

        describe('ontimeupdate', () => {
            it('should update progress', () => {
                if (mockAudio.ontimeupdate) {
                    mockAudio.currentTime = 15;
                    mockAudio.ontimeupdate(new Event('timeupdate'));
                    expect(player.progress.value.progress).toBe(15);
                    expect(player.progress.value.total).toBe(24);
                }
            });
        });

        describe('onended', () => {
            describe('should go to next song', () => {
                for (const repeat of [false, true]) {
                    it(`when repeat set to ${repeat}`, () => {
                        spyOn(player, 'next');
                        player.repeat.next(repeat);
                        if (mockAudio.onended) {
                            mockAudio.onended(new Event('ended'));
                            expect(player.next).toHaveBeenCalledOnceWith(repeat);
                        }
                    });
                }
            });
        });
    });
});
