import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { ClearQueue, PlayQueueItemAtIndex } from '../store/app.actions';
import { IAppState, PlayerState, QueueItem } from '../store/app.model';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlaylistComponent implements OnInit {
  @Select((state: IAppState) => state.app.playerState)
  playerState$: Observable<PlayerState>;

  @Select((state: IAppState) => state.app.queue)
  queue$: Observable<QueueItem[]>;

  constructor(private store: Store) {}

  ngOnInit() {}

  playQueueItemAtIndex(index: number) {
    this.store.dispatch(new PlayQueueItemAtIndex(index));
  }

  clearQueue() {
    this.store.dispatch(new ClearQueue());
  }
}
