import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { GetAlbums, PlayAlbum } from '../store/app.actions';
import { Album, IAppState } from '../store/app.model';

@Component({
  selector: 'app-albums',
  templateUrl: './albums.component.html',
  styleUrls: ['./albums.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlbumsComponent implements OnInit {
  @Select((state: IAppState) => state.app.albums)
  albums$: Observable<Album[]>;

  constructor(private store: Store) {
    this.store.dispatch(new GetAlbums());
  }

  ngOnInit() {}

  playAlbum(album: Album) {
    this.store.dispatch(new PlayAlbum(album.uri));
  }
}
