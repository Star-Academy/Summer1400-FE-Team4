// import { injectable } from "@angular/core";
// import { httpclient } from '@angular/common/http';
// import { observable, of } from "rxjs";
// import { catcherror } from "rxjs/operators";
// import { song } from "./song.model";


// @injectable()
// export class songservice {
//     api_url = 'https://songs.code-star.ir/';

//     constructor (private http: httpclient) {

//     }

//     getsong(id: number) : observable<song> {
//         return this.http.get<object>(api_url + `song/one/${id}`)
//             .pipe(catcherror(this.handleerror<object>('getsong', {})))
//             .pipe((result: object) : song => {

//             });
//     }

//     handleerror<t> (operation = 'operation', result?: t) {
//         return (error: any): observable<t> => {
//             console.error(error);
//             return of(result as t);
//         }
//     }
// }
