import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { SearchTermService } from './search-term.service';

@Component({
    templateUrl: './song-list.component.html',
    styleUrls: ['./song-list.component.scss'],
})
export class SongListComponent implements OnInit {
    constructor(private route: ActivatedRoute, private searchTermService: SearchTermService) {}

    ngOnInit(): void {
        this.route.paramMap.pipe(map((params: any) => params.get('term') as string)).subscribe(this.searchTermService.current);
    }
}
