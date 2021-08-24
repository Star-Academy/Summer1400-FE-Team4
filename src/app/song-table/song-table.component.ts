import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable, zip } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService, FavoritesService, PlayerService, PlayState, Song } from '../common';

@Component({
    selector: 'app-song-table',
    templateUrl: './song-table.component.html',
    styleUrls: ['./song-table.component.scss'],
})
export class SongTableComponent implements OnChanges {
    @Input() songs: Song[] = [];
    @Input() loaded = false;
    @Input() removeAlbum = false;
    @Input() isPlaylist = false;
    @Input() playlistLink?: string;
    songDuration: { [id: number]: Observable<number> } = {};
    likeDisabled = new Set<number>();

    constructor(
        public auth: AuthService,
        public favs: FavoritesService,
        public player: PlayerService,
        private toastr: ToastrService
    ) {}

    ngOnChanges(): void {
        this.songs.forEach((song) => {
            this.songDuration[song.id] = this.player.songDuration(song);
        });
    }

    likeSong(song: Song) {
        this.likeDisabled.add(song.id);
        this.favs.addSong(song).subscribe(
            () => {
                this.toastr.info(`«${song.name}» به موردعلاقه‌ها افزوده شد`);
                this.likeDisabled.delete(song.id);
            },
            (error) => {
                this.toastr.error(error.message);
                this.likeDisabled.delete(song.id);
            }
        );
    }

    dislikeSong(song: Song) {
        this.likeDisabled.add(song.id);
        this.favs.removeSong(song).subscribe(
            () => {
                this.toastr.info(`«${song.name}» از موردعلاقه‌ها حذف شد`);
                this.likeDisabled.delete(song.id);
            },
            (error) => {
                this.toastr.error(error.message);
                this.likeDisabled.delete(song.id);
            }
        );
    }

    playSong(song: Song) {
        if (this.isPlaylist) {
            this.player.load(this.songs, song.id, this.playlistLink);
        } else {
            this.player.load([song], song.id);
        }

        this.player.play().subscribe({
            error: () => {
                this.toastr.error('پخش آهنگ با مشکل روبرو شد');
            },
        });
    }

    pauseSong(song: Song) {
        this.player.pause();
    }
}
