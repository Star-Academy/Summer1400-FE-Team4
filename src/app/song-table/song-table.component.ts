import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService, FavoritesService, Song } from '../common';

@Component({
    selector: 'app-song-table',
    templateUrl: './song-table.component.html',
    styleUrls: ['./song-table.component.scss'],
})
export class SongTableComponent implements OnInit, OnChanges {
    @Input() songs: Song[] = [];
    @Input() loaded = false;
    @Input() removeAlbum = false;
    songDuration: { [id: number]: number } = {};
    likeDisabled = new Set<number>();

    constructor(
        public auth: AuthService,
        public favs: FavoritesService,
        private toastr: ToastrService
    ) {}

    ngOnInit(): void {}

    ngOnChanges(): void {
        this.songDuration = {};
        this.songs.forEach((song) => {
            const audio = new Audio();
            audio.preload = 'metadata';
            audio.src = song.file;
            audio.onloadedmetadata = () => {
                this.songDuration[song.id] = audio.duration;
                audio.remove();
            };
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
}
