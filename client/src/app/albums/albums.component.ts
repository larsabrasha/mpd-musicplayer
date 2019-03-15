import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { GetAlbums, PlayAlbum } from '../store/app.actions';
import { AlbumModel, IAppState } from '../store/app.model';

@Component({
  selector: 'app-albums',
  templateUrl: './albums.component.html',
  styleUrls: ['./albums.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlbumsComponent implements OnInit {
  @Select((state: IAppState) => state.app.albums)
  albums$: Observable<AlbumModel[]>;

  constructor(private store: Store) {
    this.store.dispatch(new GetAlbums());
  }

  ngOnInit() {}

  playAlbum(album: AlbumModel) {
    this.store.dispatch(new PlayAlbum({ service: 'mpd', uri: album.uri }));
  }
}
