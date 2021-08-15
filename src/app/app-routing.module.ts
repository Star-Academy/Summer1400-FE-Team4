import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './landing/landing.component';
import { SongListComponent } from './song-list/song-list.component';

export const routes: Routes = [
    { path: 'list/:term', component: SongListComponent },
    { path: 'list', component: SongListComponent },
    { path: '', component: LandingComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
