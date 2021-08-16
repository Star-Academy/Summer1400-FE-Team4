import { Component, OnInit } from '@angular/core';
import {songservice} from "../common/song.service";

@Component({

  templateUrl: './song.component.html',
  styleUrls: ['./song.component.scss']
})
export class SongComponent implements OnInit {
  song:any
  constructor(private songService:songservice) { }

  ngOnInit() {
    this.song=this.songService.getSong(1);
  }

}
