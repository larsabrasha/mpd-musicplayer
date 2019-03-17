export class Album {
  uri: string;
  name: string;
  artist: string;
  year: number;
  genre: string;
  duration: number;
  albumart: string;
}

export interface Genre {
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
  isConnectedToServer: boolean;
  albums: Album[];
  genres: Genre[];
  genreAlbums: Album[];
  queue: QueueItem[];
  playerState: PlayerState;
}

export interface IAppState {
  app: AppStateModel;
}

export const defaults: IAppState = {
  app: {
    isConnectedToServer: false,
    albums: [],
    genres: [],
    genreAlbums: [],
    queue: [],
    playerState: null,
  },
};
