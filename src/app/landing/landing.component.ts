import { Component, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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

    constructor(private songService: SongService, private route: Router) {}

    ngOnInit(): void {
        this.songService.getSongs().subscribe(
            (songs) =>
                (this.albumCards = songs.map((song) => ({
                    link: ['album', song.id],
                    title: song.name,
                    image: song.cover,
                }))),
            (error) => alert(error.message) // Use toaster instead
        );

        this.songService.getSongs('name', undefined, 20, 2).subscribe(
            (songs) =>
                (this.singerCards = songs
                    .filter((value, index, self) => {
                        return (
                            self.findIndex((other) => other.id === value.id) ===
                            index
                        );
                    })
                    .map((song) => ({
                        title: song.artist,
                        image: song.cover,
                    }))),
            (error) => alert(error.message) // Use toaster instead
        );
    }
}
