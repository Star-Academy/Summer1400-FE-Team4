import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { ApiService } from "./api.service";
import { AuthService } from "./auth.service";
import { Song } from "./song.model";

@Injectable()
export class FavoritesService {
    playlistName = 'favorites' as const;
    songs = new BehaviorSubject<Song[]>([]);

    constructor(private api: ApiService, private auth: AuthService) {
        this.auth.currentUser.subscribe((user) => {
            if (user) {

            }
            else {
                this.songs.next([]);
            }
        });
    }
}
