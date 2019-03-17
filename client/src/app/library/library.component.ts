import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { GetGenres } from '../store/app.actions';
import { Genre, IAppState } from '../store/app.model';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LibraryComponent implements OnInit {
  @Select((state: IAppState) => state.app.genres)
  genres$: Observable<Genre[]>;

  constructor(private store: Store) {}

  ngOnInit() {
    this.store.dispatch(new GetGenres());
  }
}
