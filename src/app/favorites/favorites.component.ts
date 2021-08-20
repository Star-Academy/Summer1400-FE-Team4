import { Component, OnInit } from '@angular/core';
import { FavoritesService, Song } from '../common';

@Component({
    selector: 'app-favorites',
    templateUrl: './favorites.component.html',
    styleUrls: ['./favorites.component.scss'],
})
export class FavoritesComponent implements OnInit {
    songs: Song[] = [];
    loaded = false;

    constructor(public favs: FavoritesService) {}

    ngOnInit(): void {
        this.favs.songs.subscribe((songs) => {
            if (songs === undefined) {
                this.songs = [];
                this.loaded = false;
            } else {
                this.songs = songs;
                this.loaded = true;
            }
        });
    }
}
