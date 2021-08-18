import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SharedCommonService, Song, SongService } from '../common';

@Component({
    selector: 'app-album',
    templateUrl: './album.component.html',
    styleUrls: ['./album.component.scss'],
})
export class AlbumComponent implements OnInit {
    song?: Song;

    constructor(
        public sharedCommon: SharedCommonService,
        private songService: SongService,
        private route: ActivatedRoute
    ) {}

    ngOnInit(): void {
        this.sharedCommon.topBarDark.next(true);

        this.route.paramMap.subscribe((params) => {
            const id = parseInt(params.get('id') as string);
            this.songService.getSong(id).subscribe((song) => {
                this.song = song;
                console.log(song);
            });
        });
    }
}
