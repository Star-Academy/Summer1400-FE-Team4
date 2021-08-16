import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { Song } from '../common';

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

    constructor() {}

    ngOnInit(): void {}

    ngOnChanges(): void {
        this.songDuration = {};
        this.songs.forEach(song => {
            const audio = new Audio();
            audio.preload = 'metadata';
            audio.src = song.file;
            audio.onloadedmetadata = () => {
                this.songDuration[song.id] = audio.duration;
                audio.remove();
            };
        });
    }
}
