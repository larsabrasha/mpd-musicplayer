import { State } from '@ngxs/store';
import { defaults, MusicplayerStateModel } from './musicplayer.model';

@State<MusicplayerStateModel>({
  name: 'musicplayer',
  defaults,
})
export class MusicplayerState {}
