import { Component, ElementRef, OnInit } from '@angular/core';
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

    constructor(private songService: SongService) {}

    ngOnInit(): void {
        this.songService.getSongs().subscribe(
            (songs) =>
                (this.albumCards = songs.map((song) => ({
                    id: song.id,
                    title: song.name,
                    image: song.cover,
                }))),
            (error) => alert(error.message) // Use toaster instead
        );

        this.songService.getSongs('name', undefined, 20, 2).subscribe(
            (songs) =>
                (this.singerCards = songs
                    .map((song) => ({
                        id: song.artist,
                        title: song.artist,
                        image: song.cover,
                    }))
                    .filter((value, index, self) => {
                        return (
                            self.findIndex((other) => other.id === value.id) ===
                            index
                        );
                    })),
            (error) => alert(error.message) // Use toaster instead
        );
    }
}
