import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserModule } from './user/user.module';
import { LandingComponent } from './landing/landing.component';
import { SongListComponent } from './song-list/song-list.component';
import { PageComponent } from './page/page.component';
import { ArtistComponent } from './artist/artist.component';
import { AlbumComponent } from './album/album.component';
import { SongComponent } from './song/song.component';
import { FavoritesComponent } from './favorites/favorites.component';
import { UserLoggedInGuard } from './common';

export const routes: Routes = [
    {
        path: 'user',
        loadChildren: () => import('./user/user.module').then((module) => module.UserModule),
    },
    {
        path: '',
        children: [
            { path: 'list/:term', component: SongListComponent },
            { path: 'list', component: SongListComponent },
            {
                path: 'favorites',
                component: FavoritesComponent,
                canActivate: [UserLoggedInGuard],
            },
            { path: 'artist/:name', component: ArtistComponent },
            { path: 'album/:id', component: AlbumComponent },
            { path: 'song/:id', component: SongComponent },
            { path: '', component: LandingComponent },
        ],
        component: PageComponent,
    },

    { path: '**', redirectTo: '' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes), UserModule],
    exports: [RouterModule],
    providers: [UserLoggedInGuard],
})
export class AppRoutingModule {}
