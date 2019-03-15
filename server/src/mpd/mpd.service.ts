import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { PlayerState } from 'src/models/player-state';
import { MpdServiceListener } from './mpd.listener';
// tslint:disable-next-line: no-var-requires
const mpd = require('mpd');
const cmd = mpd.cmd;
const parseKeyValueMessage = mpd.parseKeyValueMessage;

@Injectable()
export class MpdService {
  private readonly mpdClient: any;
  private listeners: MpdServiceListener[] = [];

  constructor() {
    this.mpdClient = mpd.connect({
      port: 6600,
      host: 'localhost',
    });

    this.mpdClient.on('ready', () => {
      console.log('ready');
    });

    this.mpdClient.on('system', (name: string) => {
      console.log('system', name);

      this.mpdClient.sendCommand('status', (err, msg) => {
        if (err) {
          throw err;
        }

        const playerState: PlayerState = parseKeyValueMessage(msg);
        console.log(playerState);

        this.listeners.forEach(listener => {
          listener.onPlayerState(playerState);
        });
      });
    });

    this.mpdClient.on('system-player', () => {});
  }

  registerListener(listener: MpdServiceListener) {
    this.listeners.push(listener);
  }

  clear() {
    this.mpdClient.sendCommand('clear');
  }

  play() {
    this.mpdClient.sendCommand(cmd('pause', [0]));
  }

  pause() {
    this.mpdClient.sendCommand(cmd('pause', [1]));
  }

  stop() {
    this.mpdClient.sendCommand('stop');
  }

  getAlbums(): Observable<any> {
    return new Observable(subscriber => {
      this.mpdClient.sendCommand('listallinfo', (err: any, msg: any) => {
        const files = this.getFiles(msg);
        const filesGroupedByAlbum = this.groupFilesByAlbum(files);
        const albums = this.getAlbumsFromFilesGroupedByAlbum(
          filesGroupedByAlbum,
        );
        const orderedAlbums = this.orderAlbumsByDateAndAlbumArtist(albums);

        subscriber.next(orderedAlbums);
        subscriber.complete();
      });
    });
  }

  getFiles(msg) {
    const lines = msg.split('\n');

    const files = [];
    let currentFile = {};

    for (const line of lines) {
      const texts = line.split(':');
      const key = texts[0];
      const value = line.substr(key.length + 2);

      if (key === '') {
        continue;
      }

      if (key === 'file') {
        currentFile = {};
        files.push(currentFile);
      }

      currentFile[key] = value;
    }

    return files;
  }

  groupFilesByAlbum(files) {
    return files.reduce((prev, cur) => {
      const key = `${cur.Artist} - ${cur.Album}`;

      (prev[key] ? prev[key] : (prev[key] = null || [])).push(cur);

      return prev;
    }, {});
  }

  getAlbumsFromFilesGroupedByAlbum(filesGroupedByAlbum) {
    return Object.keys(filesGroupedByAlbum).map(key => {
      const albumFiles = filesGroupedByAlbum[key];

      const album = albumFiles[0].Album;
      const artist = albumFiles[0].Artist;
      const albumArtist = albumFiles[0].AlbumArtist;
      const date = albumFiles[0].Date;
      const genre = albumFiles[0].Genre;
      const duration = albumFiles.reduce((prev, cur) => {
        return prev + parseInt(cur.duration, 10);
      }, 0);

      return {
        album,
        albumArtist: albumArtist || artist,
        date:
          date != null && date.length >= 4
            ? parseInt(date.substr(0, 4), 10)
            : null,
        genre,
        duration,
      };
    });
  }

  orderAlbumsByDateAndAlbumArtist(albums) {
    return albums.sort(this.compareAlbums);
  }

  compareAlbums(a: any, b: any) {
    const dateA = a.date || 0;
    const dateB = b.date || 0;

    if (dateA < dateB) {
      return 1;
    }
    if (dateA > dateB) {
      return -1;
    }

    if (a.albumArtist < b.albumArtist) {
      return -1;
    }
    if (a.albumArtist > b.albumArtist) {
      return 1;
    }

    return 0;
  }
}
