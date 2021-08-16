import { Component, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SongService } from '../common';
import { ShelfCard } from '../shelf/shelf.component';

@Component({
    selector: 'app-landing',
    templateUrl: './landing.component.html',
    styleUrls: ['./landing.component.scss'],
})
export class LandingComponent implements OnInit {
    albumCards: ShelfCard[] = [];
    singerCards: ShelfCard[] = [];
    newAlbumCards: ShelfCard[] = [];

    constructor(
        private songService: SongService,
        private toastr: ToastrService,
        private route: Router
    ) {}

    ngOnInit(): void {
        this.songService.getSongs().subscribe(
            (songs) => {
                this.albumCards = songs.map((song) => ({
                    link: ['album', song.id],
                    title: song.name,
                    image: song.cover,
                }));
            },
            (error) => this.toastr.error(error.message)
        );

        this.songService.getSongs('name', undefined, 20, 2).subscribe(
            (songs) => {
                this.singerCards = songs
                    // remove duplicates
                    .filter((value, index, self) => {
                        return self.findIndex((other) => other.artist === value.artist) === index;
                    })
                    .map((song) => ({
                        link: ['artist', song.artist],
                        title: song.artist,
                        image: song.cover,
                    }));
            },
            (error) => this.toastr.error(error.message)
        );

        this.songService.getSongs(undefined, undefined, 10, 2).subscribe(
            (songs) => {
                this.newAlbumCards = songs.map((song) => ({
                    link: ['album', song.id],
                    title: song.name,
                    image: song.cover,
                }));
            },
            (error) => this.toastr.error(error.message)
        );
    }
}
