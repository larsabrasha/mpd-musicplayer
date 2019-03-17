import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { RouterStateSnapshot } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { LoadGenre, PlayAlbum } from '../store/app.actions';
import { Album, IAppState } from '../store/app.model';

@Component({
  selector: 'app-genre',
  templateUrl: './genre.component.html',
  styleUrls: ['./genre.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenreComponent implements OnInit {
  @Select((state: IAppState) => state.app.genreAlbums)
  genreAlbums$: Observable<Album[]>;

  constructor(private store: Store) {
    const router: Observable<any> = this.store.select(state => state.router);

    router.subscribe(x => {
      const state = x.state as RouterStateSnapshot;
      const genre = state.root.firstChild.params.genre;
      console.log('state: ' + JSON.stringify(state));

      store.dispatch(new LoadGenre(genre));
    });
  }

  ngOnInit() {}

  playAlbum(album: Album) {
    console.log(album.uri);
    this.store.dispatch(new PlayAlbum(album.uri));
  }
}
