import { Injectable } from '@nestjs/common';
const mpd = require('mpd'),
  cmd = mpd.cmd;

@Injectable()
export class MpdService {
  private readonly client: any;

  constructor() {
    this.client = mpd.connect({
      port: 6600,
      host: 'localhost',
    });

    this.client.on('ready', () => {
      console.log('ready\n');

      // client.sendCommand("listallinfo", (err, msg) => {
      //   var files = getFiles(msg);
      //   var filesGroupedByAlbum = groupFilesByAlbum(files);
      //   var albums = getAlbumsFromFilesGroupedByAlbum(filesGroupedByAlbum);

      //   var orderedAlbums = orderAlbumsByDateAndAlbumArtist(albums);
      //   console.log(orderedAlbums);
      // });

      this.clear();

      this.client.sendCommand(
        cmd('findadd', [
          'Album',
          'A Curious Thing',
          'AlbumArtist',
          'Amy Macdonald',
        ]),
        (err, msg) => {
          const files = this.getFiles(msg);
          this.client.sendCommand(cmd('play', [0]));
        },
      );
    });

    this.client.on('system', name => {
      console.log('system', name);

      this.listData();
    });

    this.client.on('system-player', () => {
      console.log('system-player');
      // client.sendCommand(cmd("status", []), function(err, msg) {
      //   if (err) throw err;
      //   console.log(msg);
      // });
    });
  }

  lsinfo() {
    this.client.sendCommand(
      'lsinfo',
      ['album', 'group', 'albumartist'],
      (err, msg) => {
        console.log();
      },
    );
  }

  clear() {
    this.client.sendCommand('clear');
  }

  play() {
    this.client.sendCommand(cmd('pause', [0]));
  }

  pause() {
    this.client.sendCommand(cmd('pause', [1]));
  }

  stop() {
    this.client.sendCommand('stop');
  }

  listAlbums() {
    this.client.sendCommand(
      cmd('list', ['album', 'group', 'albumartist']),
      (err, msg) => {
        if (err) {
          throw err;
        }

        const albums = this.parseAlbums(msg);
        console.log(albums);
      },
    );
  }

  parseAlbums(msg) {
    const lines = msg.split('\n');

    const albums = [];

    let currentAlbum = {};

    for (const line of lines) {
      const texts = line.split(':');
      const key = texts[0];
      const value = line.substr(key.length + 2);

      if (key === 'AlbumArtist') {
        currentAlbum = {};
        albums.push(currentAlbum);
      }

      currentAlbum[key] = value;
    }

    return albums;
  }

  listData() {
    this.client.sendCommand(cmd('find', ['Genre', 'Pop']), (err, msg) => {
      if (err) {
        throw err;
      }

      const albums = this.getAlbums(msg);

      console.log(albums);
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

      if (key == '') {
        continue;
      }

      if (key == 'file') {
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

  getAlbums(msg) {
    const files = this.getFiles(msg);
    const filesGroupedByAlbum = this.groupFilesByAlbum(files);

    // var filesGroupedByGenre = files.reduce(function(prev, cur) {
    //   let key = cur["Genre"];

    //   (prev[key] ? prev[key] : (prev[key] = null || [])).push(cur);

    //   return prev;
    // }, {});

    // var genres = Object.keys(filesGroupedByAlbum)
    //   .map(key => {
    //     var albumFiles = filesGroupedByAlbum[key];

    //     return albumFiles[0]["Genre"];
    //   })
    //   .sort();

    const albums = this.getAlbumsFromFilesGroupedByAlbum(filesGroupedByAlbum);

    return this.orderAlbumsByDateAndAlbumArtist(albums);
  }

  compareAlbums(a, b) {
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
