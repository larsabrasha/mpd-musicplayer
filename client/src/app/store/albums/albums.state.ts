import { Action, State, StateContext } from '@ngxs/store';
import { Albums } from '../musicplayer/musicplayer.actions';
import { AlbumsStateModel, defaults } from './albums.model';

@State<AlbumsStateModel>({
  name: 'albums',
  defaults,
})
export class AlbumsState {
  @Action(Albums)
  albums(context: StateContext<AlbumsStateModel>, action: Albums) {
    console.log(JSON.stringify(action.data));

    context.patchState({
      albums: action.data,
    });
  }
}
