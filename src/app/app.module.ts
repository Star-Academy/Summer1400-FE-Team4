import { NgModule, LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

import { AppRoutingModule } from './app-routing.module';
import { UserModule } from './user/user.module';

import {
    ApiService,
    ArtistService,
    AUDIO_TOKEN,
    AuthService,
    DurationPipe,
    FavoritesService,
    PersianNumeralPipe,
    PlayerService,
    SharedCommonService,
    SongService,
} from './common';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { AsideComponent } from './aside/aside.component';
import { SongListComponent } from './song-list/song-list.component';
import { LandingComponent } from './landing/landing.component';
import { ShelfComponent } from './shelf/shelf.component';
import { BannerComponent } from './banner/banner.component';
import { ArtistComponent } from './artist/artist.component';
import { PageComponent } from './page/page.component';
import { SongTableComponent } from './song-table/song-table.component';
import { AlbumComponent } from './album/album.component';
import { SongComponent } from './song/song.component';
import { FavoritesComponent } from './favorites/favorites.component';

import localeFa from '@angular/common/locales/fa';
registerLocaleData(localeFa);

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        AsideComponent,
        BannerComponent,
        SongListComponent,
        LandingComponent,
        ShelfComponent,
        ArtistComponent,
        PageComponent,
        SongTableComponent,
        PersianNumeralPipe,
        DurationPipe,
        AlbumComponent,
        SongComponent,
        FavoritesComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        FormsModule,
        BrowserAnimationsModule,
        ToastrModule.forRoot({
            positionClass: 'toast-top-left-page',
            preventDuplicates: true,
            resetTimeoutOnDuplicate: true,
            progressBar: true,
        }),
        UserModule,
    ],
    providers: [
        { provide: LOCALE_ID, useValue: 'fa-IR' },
        { provide: AUDIO_TOKEN, useFactory: () => new Audio() },
        ApiService,
        SongService,
        ArtistService,
        AuthService,
        SharedCommonService,
        FavoritesService,
        PlayerService,
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
