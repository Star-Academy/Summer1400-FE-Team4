import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import {AppRoutingModule, routes} from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { AsideComponent } from './aside/aside.component';
import { SongListComponent } from './song-list/song-list.component';
import { LandingComponent } from './landing/landing.component';
import { ShelfComponent } from './shelf/shelf.component';
import { SongComponent } from './song/song.component';
import {RouterModule} from "@angular/router";
import {songservice} from "./common/song.service";
import { BannerComponent } from './banner/banner.component';
import {HttpClientModule} from "@angular/common/http";
import {UserModule} from "./user/user.module";

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    AsideComponent,
    SongListComponent,
    LandingComponent,
    ShelfComponent,
    SongComponent,
    BannerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot(routes),
    UserModule
  ],
  providers: [
    songservice
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
