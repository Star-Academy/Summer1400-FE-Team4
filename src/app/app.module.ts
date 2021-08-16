import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import { AppRoutingModule, routes } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { AsideComponent } from './aside/aside.component';
import { SongListComponent } from './song-list/song-list.component';
import { LandingComponent } from './landing/landing.component';
import { ShelfComponent } from './shelf/shelf.component';
import { RouterModule } from '@angular/router';
import { SongService } from './common/song.service';
import { BannerComponent } from './banner/banner.component';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from './common';
import { FormsModule } from '@angular/forms';
import { UserModule } from './user/user.module';
import { SearchTermService } from './song-list/search-term.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { ArtistComponent } from './artist/artist.component';
import { UserComponent } from "./user/user.component";
import { PageComponent } from './page/page.component';

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
    providers: [ApiService, SongService, SearchTermService],
    bootstrap: [AppComponent],
})
export class AppModule {
}
