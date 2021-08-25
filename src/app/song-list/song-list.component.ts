import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Song, SongService, SharedCommonService } from '../common';

@Component({
    templateUrl: './song-list.component.html',
    styleUrls: ['./song-list.component.scss'],
})
export class SongListComponent implements OnInit {
    songs: Song[] = [];
    loaded = false;

    constructor(
        private sharedCommon: SharedCommonService,
        private songService: SongService,
        private route: ActivatedRoute
    ) {}

    ngOnInit(): void {
        this.sharedCommon.topBarDark.next(false);

        this.route.paramMap.subscribe((params) =>
            this.sharedCommon.currentSearchTerm.next(params.get('term') as string)
        );

        this.route.paramMap.subscribe((params) => {
            this.loaded = false;

            let term = params.get('term');
            if (term !== null && (term as string).trim()) {
                term = (term as string).trim();

                this.songService.findSongs(term, undefined, undefined, 20).subscribe((songs) => {
                    this.songs = songs;
                    this.loaded = true;
                });
            } else {
                this.songService.getSongs(undefined, undefined, 20).subscribe((songs) => {
                    this.songs = songs;
                    this.loaded = true;
                });
            }
        });
    }
}
