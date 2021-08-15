import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './landing/landing.component';
import { SongListComponent } from './song-list/song-list.component';

export const routes: Routes = [
    { path: 'list/:term', component: SongListComponent },
    { path: 'list', component: SongListComponent },
    { path: 'album/:id', component: SongListComponent },
    { path: 'singer/:name', component: SongListComponent },
    { path: '', component: LandingComponent },
    { path: '**', redirectTo: '' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
