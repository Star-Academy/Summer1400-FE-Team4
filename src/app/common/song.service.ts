import {Injectable } from "@angular/core";
import {HttpClient} from "@angular/common/http";



@Injectable()
export class songservice {
  constructor(private http:HttpClient) {
  }
  getSongs(){
    return SONGS;
  }
  getSong(id:number){

    return SONGS.find(song => song.id ===id)

  }

}
const SONGS=[
  {
    id:1,
    name: "Something",
    artist: "Someone",
    lyrics: "Lots of things",
    file: "some url",
    cover: "some url"
  }

]
