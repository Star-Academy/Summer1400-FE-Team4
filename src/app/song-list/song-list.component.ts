import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { Song, SongService } from '../common';
import { SearchTermService } from '../common/search-term.service';

@Component({
    templateUrl: './song-list.component.html',
    styleUrls: ['./song-list.component.scss'],
})
export class SongListComponent implements OnInit {
    songs: Song[] = [];

    constructor(
        private songService: SongService,
        private route: ActivatedRoute,
        private searchTermService: SearchTermService
    ) {}

    ngOnInit(): void {
        this.route.paramMap
            .pipe(map((params) => params.get('term') as string))
            .subscribe(this.searchTermService.current);

        this.route.paramMap.subscribe((params) => {
            let term = params.get('term');
            if (term !== null) {
                term = (term as string).trim();
                if (term) {
                    this.songService
                        .findSongs(term, undefined, undefined, 20)
                        .subscribe((songs) => {
                            this.songs = songs;
                        });
                    return;
                }
            }
            this.songService.getSongs(undefined, undefined, 20).subscribe((songs) => {
                this.songs = songs;
            });
        });
    }
}
