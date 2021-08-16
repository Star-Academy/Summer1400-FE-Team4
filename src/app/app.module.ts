import { NgModule, LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

import {
    ApiService,
    ArtistService,
    DurationPipe,
    PersianNumeralPipe,
    SearchTermService,
    SongService,
} from './common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { AsideComponent } from './aside/aside.component';
import { SongListComponent } from './song-list/song-list.component';
import { LandingComponent } from './landing/landing.component';
import { ShelfComponent } from './shelf/shelf.component';
import { BannerComponent } from './banner/banner.component';
import { UserModule } from './user/user.module';
import { ArtistComponent } from './artist/artist.component';
import { PageComponent } from './page/page.component';
import { SongTableComponent } from './song-table/song-table.component';

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
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        FormsModule,
        BrowserAnimationsModule,
        ToastrModule.forRoot({
            positionClass: 'toast-bottom-right',
            preventDuplicates: true,
            resetTimeoutOnDuplicate: true,
            disableTimeOut: true,
        }),
        UserModule,
    ],
    providers: [
        { provide: LOCALE_ID, useValue: 'fa-IR' },
        ApiService,
        SongService,
        ArtistService,
        SearchTermService,
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
