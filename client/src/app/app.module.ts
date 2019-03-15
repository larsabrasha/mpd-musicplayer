import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsRouterPluginModule } from '@ngxs/router-plugin';
import { NgxsModule } from '@ngxs/store';
import { NgxsWebsocketPluginModule } from '@ngxs/websocket-plugin';
import { environment } from 'src/environments/environment';
import { AlbumsComponent } from './albums/albums.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GenreComponent } from './genre/genre.component';
import { LibraryComponent } from './library/library.component';
import { MinutesSecondsPipe } from './minutes-seconds.pipe';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { PlayerstatusComponent } from './playerstatus/playerstatus.component';
import { PlaylistComponent } from './playlist/playlist.component';
import { SliderComponent } from './slider/slider.component';
import { AppState } from './store/app.state';

@NgModule({
  declarations: [
    AppComponent,
    LibraryComponent,
    PlayerstatusComponent,
    AlbumsComponent,
    PageNotFoundComponent,
    GenreComponent,
    PlaylistComponent,
    SliderComponent,
    MinutesSecondsPipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxsModule.forRoot([AppState], {
      developmentMode: !environment.production,
    }),
    NgxsRouterPluginModule.forRoot(),
    NgxsWebsocketPluginModule.forRoot({
      url: 'ws://localhost:3000',
      typeKey: 'event',
    }),
    NgxsReduxDevtoolsPluginModule.forRoot({
      disabled: environment.production,
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
