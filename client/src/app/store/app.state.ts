import { Action, State, StateContext, Store } from '@ngxs/store';
import { SendWebSocketMessage } from '@ngxs/websocket-plugin';
import * as actions from './app.actions';
import { AppStateModel, defaults } from './app.model';

@State<AppStateModel>({
  name: 'app',
  defaults: defaults.app,
})
export class AppState {
  constructor(private store: Store) {}

  // onPushBrowseLibrary(data: any) {
  //   console.log('onPushBrowseLibrary');
  //   this.store.dispatch(new actions.PushBrowseLibrary(data));
  // }

  // onPushQueue(data: any) {
  //   this.store.dispatch(new actions.PushQueue(data));
  // }

  // onPushState(data: any) {
  //   this.store.dispatch(new actions.PushState(data));
  // }

  @Action(actions.StatusWasUpdated)
  statusWasUpdated(
    context: StateContext<AppStateModel>,
    action: actions.StatusWasUpdated
  ) {
    context.patchState({
      playerState: action.data,
    });
  }

  // @Action(RouterNavigation)
  // routerNavigation(
  //   { getState, setState }: StateContext<AppStateModel>,
  //   { payload }
  // ) {}

  // @Action(actions.GetPlayerState)
  // getPlayerState() {
  //   // this.volumioService.getPlayerState();
  // }

  @Action(actions.GetAlbums)
  getAlbums(context: StateContext<AppStateModel>) {
    context.dispatch(new SendWebSocketMessage({ event: 'getAlbums' }));
  }

  @Action(actions.Albums)
  albums(context: StateContext<AppStateModel>, action: actions.Albums) {
    context.patchState({
      albums: action.data,
    });
  }

  @Action(actions.GetGenres)
  getGenres(context: StateContext<AppStateModel>) {
    context.dispatch(new SendWebSocketMessage({ event: 'getGenres' }));
  }

  @Action(actions.Genres)
  genres(context: StateContext<AppStateModel>, action: actions.Genres) {
    context.patchState({
      genres: action.data,
    });
  }

  // @Action(actions.GetQueue)
  // getQueue() {
  //   // this.volumioService.getQueue();
  // }

  // @Action(actions.PushBrowseLibrary)
  // pushBrowseLibrary(
  //   { getState, setState }: StateContext<AppStateModel>,
  //   { payload }
  // ) {
  //   const state = getState();

  //   if (payload.navigation.lists.length === 3) {
  //     const items = payload.navigation.lists[1].items.map(item => ({
  //       title: item.title,
  //       albumart: item.albumart,
  //       name: item.name,
  //       artist: item.artist,
  //       uri: item.uri,
  //     }));
  //     state.genreAlbums = items;
  //   } else {
  //     const items = payload.navigation.lists[0].items.map(item => ({
  //       title: item.title,
  //       albumart: item.albumart,
  //       name: item.name,
  //       artist: item.artist,
  //       uri: item.uri,
  //     }));

  //     if ((items[0].uri as string).startsWith('genres')) {
  //       state.genres = items;
  //     } else if ((items[0].uri as string).startsWith('albums')) {
  //       state.albums = items;
  //     }
  //   }

  //   setState(state);
  // }

  // @Action(actions.PushQueue)
  // pushQueue({ getState, setState }: StateContext<AppStateModel>, { payload }) {
  //   const state = getState();
  //   state.queue = payload;
  //   setState(state);
  // }

  // @Action(actions.PushState)
  // pushState({ getState, setState }: StateContext<AppStateModel>, { payload }) {
  //   const state = getState();
  //   state.playerState = payload;
  //   setState(state);
  // }

  // @Action(actions.Play)
  // play(context: StateContext<AppStateModel>) {
  //   const state = context.getState();
  //   context.patchState({
  //     playerState: {
  //       ...state.playerState,
  //       state: 'play',
  //     },
  //   });
  //   // this.volumioService.play();
  // }

  // @Action(actions.Pause)
  // pause(context: StateContext<AppStateModel>) {
  //   const state = context.getState();
  //   context.patchState({
  //     playerState: {
  //       ...state.playerState,
  //       state: 'pause',
  //     },
  //   });
  //   // this.volumioService.pause();
  // }

  // @Action(actions.PlayPause)
  // playPause(context: StateContext<AppStateModel>) {
  //   const state = context.getState();

  //   const nextStatus = state.playerState.state == 'play' ? 'pause' : 'play';

  //   context.patchState({
  //     playerState: {
  //       ...state.playerState,
  //       state: nextStatus,
  //     },
  //   });

  //   if (nextStatus == 'play') {
  //     // this.volumioService.play();
  //   } else {
  //     // this.volumioService.pause();
  //   }
  // }

  // @Action(actions.Stop)
  // stop(context: StateContext<AppStateModel>) {
  //   const state = context.getState();
  //   context.patchState({
  //     playerState: {
  //       ...state.playerState,
  //       state: 'stop',
  //     },
  //   });
  //   // this.volumioService.stop();
  // }

  // @Action(actions.Previous)
  // previous() {
  //   // this.volumioService.previous();
  // }

  // @Action(actions.Next)
  // next() {
  //   // this.volumioService.next();
  // }

  // @Action(actions.SetRandom)
  // setRandom(context: StateContext<AppStateModel>, action: actions.SetRandom) {
  //   const state = context.getState();
  //   context.patchState({
  //     playerState: {
  //       ...state.playerState,
  //       random: '' + action.payload,
  //     },
  //   });
  //   // this.volumioService.setRandom(action.payload);
  // }

  // @Action(actions.SetRepeat)
  // setRepeat(context: StateContext<AppStateModel>, action: actions.SetRepeat) {
  //   const state = context.getState();
  //   context.patchState({
  //     playerState: {
  //       ...state.playerState,
  //       repeat: '' + action.payload,
  //     },
  //   });
  //   // this.volumioService.setRepeat(action.payload);
  // }

  // @Action(actions.SetVolume)
  // setVolume(context: StateContext<AppStateModel>, action: actions.SetVolume) {
  //   const state = context.getState();
  //   context.patchState({
  //     playerState: {
  //       ...state.playerState,
  //       volume: '' + action.payload,
  //     },
  //   });
  //   // this.volumioService.setVolume(action.payload);
  // }

  // @Action(actions.VolumeUp)
  // volumeUp() {
  //   // this.volumioService.volumeUp();
  // }

  // @Action(actions.VolumeDown)
  // volumeDown() {
  //   // this.volumioService.volumeDown();
  // }

  @Action(actions.PlayAlbum)
  playAlbum(context: StateContext<AppStateModel>, action: actions.PlayAlbum) {
    context.dispatch(
      new SendWebSocketMessage({ event: 'playUri', data: action.uri })
    );
  }

  // @Action(actions.PlayQueueItemAtIndex)
  // playQueueItemAtIndex(
  //   context: StateContext<AppStateModel>,
  //   action: actions.PlayQueueItemAtIndex
  // ) {
  //   // this.volumioService.playQueueItemAtIndex(action.payload);
  // }

  // @Action(actions.ClearQueue)
  // clearQueue() {
  //   // this.volumioService.clearQueue();
  // }

  // @Action(actions.LoadGenre)
  // loadGenre(context: StateContext<AppStateModel>, action: actions.LoadGenre) {
  //   // this.volumioService.loadGenre(action.payload);
  // }
}
