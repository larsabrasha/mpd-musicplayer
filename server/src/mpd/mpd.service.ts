import { Injectable } from '@nestjs/common';
import * as path from 'path';
import { Observable } from 'rxjs';
import { Album } from 'src/models/album';
import { Genre } from 'src/models/genre';
import { PlayerState } from 'src/models/player-state';
import { MpdServiceListener } from './mpd.listener';

// tslint:disable-next-line: no-var-requires
const mpd = require('mpd');
const cmd = mpd.cmd;
const parseKeyValueMessage = mpd.parseKeyValueMessage;

@Injectable()
export class MpdService {
  private isLocalMpd = true;
  private readonly mpdClient: any;
  private listeners: MpdServiceListener[] = [];

  constructor() {
    if (this.isLocalMpd) {
      this.mpdClient = mpd.connect({
        port: 6600,
        host: 'localhost',
      });
    } else {
      this.mpdClient = mpd.connect({
        port: 6600,
        host: 'volumio.local',
      });
    }

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

  getAlbums(): Observable<Album[]> {
    return new Observable(subscriber => {
      this.mpdClient.sendCommand('listallinfo', (err: any, msg: any) => {
        const files = this.getFiles(msg);
        const filesGroupedByAlbum = this.groupFilesByAlbum(files);
        const albums = this.getAlbumsFromFilesGroupedByAlbum(
          filesGroupedByAlbum,
        );
        const orderedAlbums = this.orderAlbumsByDateAndAlbumArtist(
          albums,
        ).filter(x => x.duration > 20 * 60);

        subscriber.next(orderedAlbums);
        subscriber.complete();
      });
    });
  }

  getGenres(): Observable<Genre[]> {
    return new Observable(subscriber => {
      this.mpdClient.sendCommand('listallinfo', (err: any, msg: any) => {
        const files = this.getFiles(msg);
        const genres = [...new Set(files.map(item => item.Genre))]
          .filter(x => x != null)
          .sort()
          .map(x => ({
            title: x,
            uri: x,
          }));

        subscriber.next(genres);
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
      const key = `${cur.AlbumArtist || cur.Artist} - ${cur.Album}`;

      (prev[key] ? prev[key] : (prev[key] = null || [])).push(cur);

      return prev;
    }, {});
  }

  getAlbumsFromFilesGroupedByAlbum(filesGroupedByAlbum): Album[] {
    return Object.keys(filesGroupedByAlbum).map((key, index) => {
      const albumFiles = filesGroupedByAlbum[key];

      const firstFile = albumFiles[0];
      const directoryPath = path.dirname(firstFile.file);

      const name = albumFiles[0].Album;
      const artist = albumFiles[0].AlbumArtist || albumFiles[0].Artist;
      const date = albumFiles[0].Date;
      const genre = albumFiles[0].Genre;
      const duration = albumFiles.reduce((prev, cur) => {
        return prev + parseInt(cur.duration, 10);
      }, 0);
      const albumart = this.getAlbumArtPath(directoryPath);

      return {
        uri: directoryPath,
        name,
        artist,
        year:
          date != null && date.length >= 4
            ? parseInt(date.substr(0, 4), 10)
            : null,
        genre,
        duration,
        albumart,
      };
    });
  }

  getAlbumArtPath(directoryPath: string): string {
    if (this.isLocalMpd) {
      let p = `/albumart?icon=dot-circle-o&path=${
        this.isLocalMpd ? '/mnt/USB/MUSIC/' : ''
      }${encodeURIComponent(directoryPath)}`;
      p = p.replace(/A%CC%8A/g, '%C3%85'); // Ä
      p = p.replace(/a%CC%8A/g, '%C3%A5'); // ä

      p = p.replace(/A%CC%88/g, '%C3%84'); // Å
      p = p.replace(/a%CC%88/g, '%C3%A4'); // å

      p = p.replace(/O%CC%88/g, '%C3%96'); // Ö
      p = p.replace(/o%CC%88/g, '%C3%B6'); // ö

      p = p.replace(/e%CC%81/g, '%C3%A9'); // é

      return p;
    } else {
      return `/albumart?icon=dot-circle-o&path=${encodeURIComponent(
        directoryPath,
      )}`;
    }
  }

  orderAlbumsByDateAndAlbumArtist(albums: Album[]): Album[] {
    return albums.sort(this.compareAlbums);
  }

  compareAlbums(a: Album, b: Album) {
    const yearA = a.year || 0;
    const yearB = b.year || 0;

    if (yearA < yearB) {
      return 1;
    }
    if (yearA > yearB) {
      return -1;
    }

    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }

    return 0;
  }

  playUri(uri: string) {
    this.clear();
    this.mpdClient.sendCommand(cmd('add', [uri]));
    this.mpdClient.sendCommand(cmd('play', [0]));
  }
}
