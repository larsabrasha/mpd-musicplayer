export class Album {
  album: string;
  albumArtist: string;
  date: number;
  genre: string;
  duration: number;
}

export class AlbumsStateModel {
  albums: Album[];
}

export const defaults: AlbumsStateModel = {
  albums: [],
};
