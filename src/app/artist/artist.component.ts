import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArtistService } from '../common';
import { ShelfCard } from '../shelf/shelf.component';

@Component({
    selector: 'app-artist',
    templateUrl: './artist.component.html',
    styleUrls: ['./artist.component.scss'],
})
export class ArtistComponent implements OnInit {
    artistName: string = '';
    artistImage: string = '';
    cards: ShelfCard[] = [];

    constructor(private artistService: ArtistService, private route: ActivatedRoute) {}

    ngOnInit(): void {
        this.route.paramMap.subscribe((params) => {
            const artistName = params.get('name') as string;
            this.artistName = artistName;
            this.artistService.getSongsBy(artistName).subscribe((songs) => {
                this.cards = songs.map(
                    (song): ShelfCard => ({
                        image: song.cover,
                        title: song.name,
                        link: ['/album', song.id],
                    })
                );
                if (songs.length != 0) this.artistImage = songs[songs.length - 1].cover;
            });
        });
    }
}
