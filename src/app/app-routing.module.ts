import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './landing/landing.component';
import { SongListComponent } from './song-list/song-list.component';
//import {SongComponent} from "./song/song.component";
import { SongService } from "./common/song.service";

export const routes: Routes = [
  { path: 'list', component: SongListComponent },
//  {path:'list/:id',component:SongComponent },
//  {path:'', redirectTo:'/list/1', pathMatch:'full' },
  { path: '', component: LandingComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
