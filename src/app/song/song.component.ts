import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Song, SongService } from '../common';

@Component({
    templateUrl: './song.component.html',
    styleUrls: ['./song.component.scss'],
})
export class SongComponent implements OnInit {
    song?: Song;
    duration?: number;

    constructor(private songService: SongService, private route: ActivatedRoute) {}

    ngOnInit(): void {
        this.route.paramMap.subscribe((params) => {
            this.duration = undefined;

            const id = parseInt(params.get('id') as string);
            this.songService.getSong(id).subscribe((song) => {
                this.song = song;
                console.log(song);
                
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
}
