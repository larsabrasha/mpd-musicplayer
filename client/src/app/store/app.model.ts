export interface AlbumModel {
  title: string;
  albumart: string;
  name: string;
  artist: string;
  uri: string;
}

export interface GenreModel {
  title: string;
  uri: string;
}

export interface QueueItem {
  album: string;
  albumart: string;
  artist: string;
  duration: number;
  name: string;
  service: string;
  trackType: string;
  tracknumber: number;
  type: string;
  uri: string;
}

export interface PlayerState {
  volume: string;
  repeat: string;
  random: string;
  single: string;
  consume: string;
  playlist: string;
  playlistlength: string;
  mixrampdb: string;
  state: string;
  song: string;
  songid: string;
  time: string;
  elapsed: string;
  bitrate: string;
  duration: string;
  audio: string;
  nextsong: string;
  nextsongid: string;
}

export interface AppStateModel {
  albums: AlbumModel[];
  genres: GenreModel[];
  genreAlbums: AlbumModel[];
  queue: QueueItem[];
  playerState: PlayerState;
}

export interface IAppState {
  app: AppStateModel;
}

export const defaults: IAppState = {
  app: {
    albums: [],
    genres: [],
    genreAlbums: [],
    queue: [],
    playerState: null,
  },
};
