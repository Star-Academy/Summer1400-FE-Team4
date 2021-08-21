import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import {
    AuthService,
    FavoritesService,
    PlayerService,
    SharedCommonService,
    Song,
    SongService,
} from '../common';

@Component({
    templateUrl: './song.component.html',
    styleUrls: ['./song.component.scss'],
})
export class SongComponent implements OnInit {
    song?: Song;
    duration?: number;
    likeDisabled = false;

    constructor(
        public sharedCommon: SharedCommonService,
        public auth: AuthService,
        public favs: FavoritesService,
        public player: PlayerService,
        private songService: SongService,
        private route: ActivatedRoute,
        private toastr: ToastrService
    ) {}

    ngOnInit(): void {
        this.sharedCommon.topBarDark.next(true);

        this.route.paramMap.subscribe((params) => {
            this.duration = undefined;

            const id = parseInt(params.get('id') as string);
            this.songService.getSong(id).subscribe((song) => {
                this.song = song;

                const audio = new Audio();
                audio.preload = 'metadata';
                audio.src = song.file;
                audio.onloadedmetadata = () => {
                    this.duration = audio.duration;
                    audio.remove();
                };
            });
        });
    }

    likeSong(song: Song) {
        this.likeDisabled = true;
        this.favs.addSong(song).subscribe(
            () => {
                this.toastr.info(`«${song.name}» به موردعلاقه‌ها افزوده شد`);
                this.likeDisabled = false;
            },
            (error) => {
                this.toastr.error(error.message);
                this.likeDisabled = false;
            }
        );
    }

    dislikeSong(song: Song) {
        this.likeDisabled = true;
        this.favs.removeSong(song).subscribe(
            () => {
                this.toastr.info(`«${song.name}» از موردعلاقه‌ها حذف شد`);
                this.likeDisabled = false;
            },
            (error) => {
                this.toastr.error(error.message);
                this.likeDisabled = false;
            }
        );
    }

    playSong(song: Song) {
        this.player.load([song], song.id);
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
