import { PlayerState } from 'src/models/player-state';

export interface MpdServiceListener {
  onEvent(event: any, data: any);
  onPlayerState(playerState: PlayerState);
}
