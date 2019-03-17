import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { ConnectWebSocket } from '@ngxs/websocket-plugin';
import { Observable } from 'rxjs';
import { Album, IAppState, PlayerState } from './store/app.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'client';

  @Select((state: IAppState) => state.app.albums)
  albums$: Observable<Album[]>;

  @Select((state: IAppState) => state.app.playerState)
  playerState$: Observable<PlayerState>;

  constructor(private store: Store) {
    this.store.dispatch(new ConnectWebSocket());
  }

  ngOnInit() {
    // this.store.dispatch(
    //   new SendWebSocketMessage({ event: 'getAlbums', data: '' })
    // );
  }

  // play() {
  //   this.store.dispatch(new SendWebSocketMessage({ event: 'play' }));
  // }

  // pause() {
  //   this.store.dispatch(new SendWebSocketMessage({ event: 'pause' }));
  // }

  // playAlbum(album: Album) {
  //   this.store.dispatch(
  //     new SendWebSocketMessage({
  //       event: 'playAlbum',
  //       data: { album: album.album, albumArtist: album.albumArtist },
  //     })
  //   );
  // }
}
