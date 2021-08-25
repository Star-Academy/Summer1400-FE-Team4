import { Component, OnInit } from '@angular/core';
import { FavoritesService, SharedCommonService, Song } from '../common';

@Component({
    selector: 'app-favorites',
    templateUrl: './favorites.component.html',
    styleUrls: ['./favorites.component.scss'],
})
export class FavoritesComponent implements OnInit {
    songs: Song[] = [];
    loaded = false;

    constructor(private sharedCommon: SharedCommonService, public favs: FavoritesService) {}

    ngOnInit(): void {
        this.sharedCommon.topBarDark.next(false);
        this.favs.songs.subscribe((songs) => {
            if (songs === undefined) {
                this.songs = [];
                this.loaded = true;
            } else {
                this.songs = songs;
                this.loaded = true;
            }
        });
    }
}
