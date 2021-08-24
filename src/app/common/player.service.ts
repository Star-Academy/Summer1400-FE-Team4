import { Inject, Injectable, InjectionToken } from '@angular/core';
import { BehaviorSubject, combineLatest, concat, from, fromEvent, Observable, of, ReplaySubject, Subject } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Song } from './song.model';

export type PlayState = 'playing' | 'paused' | 'loading';

export const AUDIO_TOKEN = new InjectionToken<any>('Audio');

@Injectable()
export class PlayerService {
    playlist = new BehaviorSubject<Song[]>([]);
    playlistLink = new BehaviorSubject<string | undefined>(undefined);
    currentSongIndex = new BehaviorSubject<number | undefined>(undefined);
    currentSong = new BehaviorSubject<Song | undefined>(undefined);

    state = new BehaviorSubject<PlayState>('paused');
    progress = new BehaviorSubject<{ progress: number; total: number }>({ progress: 0, total: 0 });

    repeat = new BehaviorSubject<boolean>(false);

    constructor(@Inject(AUDIO_TOKEN) private audio: HTMLAudioElement = new Audio()) {
        this.audio.ontimeupdate = (event) => {
            this.progress.next({ progress: this.audio.currentTime, total: this.audio.duration });
        };

        this.audio.onwaiting = () => {
            this.state.next('loading');
        };

        this.audio.onplaying = () => {
            this.state.next('playing');
        };

        this.audio.onpause = () => {
            this.state.next('paused');
        };

        this.audio.onended = () => {
            this.next(this.repeat.value);
        };
    }

    load(songs: Song[], startSongId: number, sourceLink?: string) {
        const isNewSong = startSongId !== this.currentSong.value?.id;
        const songIndex = songs.findIndex((song) => song.id === startSongId);
        if (songIndex < 0) {
            throw new Error('invalid startSongId');
        }
        const currentSong = songs[songIndex];

        this.playlist.next(songs);
        this.playlistLink.next(sourceLink);
        this.currentSong.next(currentSong);
        this.currentSongIndex.next(songIndex);

        if (isNewSong) {
            this.audio.src = currentSong.file;
        }
    }

    play() {
        return from(this.audio.play());
    }

    pause() {
        this.audio.pause();
    }

    seek(second: number) {
        this.audio.currentTime = second;
    }

    next(repeat = true) {
        if (this.currentSongIndex.value !== undefined) {
            let nextIndex = this.currentSongIndex.value + 1;
            if (nextIndex >= this.playlist.value.length)
                if (repeat) nextIndex = 0;
                else return;

            const song = this.playlist.value[nextIndex];
            this.currentSongIndex.next(nextIndex);
            this.currentSong.next(song);

            this.audio.src = song.file;
            this.audio.play();
        }
    }

    previous(repeat = true) {
        if (this.currentSongIndex.value !== undefined) {
            let prevIndex = this.currentSongIndex.value - 1;
            if (prevIndex < 0)
                if (repeat) prevIndex = this.playlist.value.length - 1;
                else return;

            const song = this.playlist.value[prevIndex];
            this.currentSongIndex.next(prevIndex);
            this.currentSong.next(song);

            this.audio.src = song.file;
            this.audio.play();
        }
    }

    songState(song: Song) {
        return combineLatest([this.currentSong, this.state]).pipe(
            map(([currentSong, state]): PlayState => {
                if (song.id !== currentSong?.id) return 'paused';
                else return state;
            })
        );
    }

    songDuration(song: Song): Observable<number> {
        const duration = new Subject<number>();
        const audio = new Audio();

        audio.preload = 'metadata';
        audio.src = song.file;
        audio.load();

        audio.onloadedmetadata = () => {
            duration.next(audio.duration);
            audio.remove();
        }

        return duration;
    }
}
