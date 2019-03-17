import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PlayerState } from './models/player-state';
import { MpdServiceListener } from './mpd/mpd.listener';
import { MpdService } from './mpd/mpd.service';

@WebSocketGateway()
export class EventsGateway implements MpdServiceListener {
  @WebSocketServer() server;

  constructor(private mpdService: MpdService) {
    mpdService.registerListener(this);
  }

  onEvent(event: any, data: any) {
    console.log('event recieved from mpd server');
  }

  onPlayerState(playerState: PlayerState) {
    console.log('playerState');

    this.broadcast(
      JSON.stringify({
        event: '[Server] Status Was Updated',
        data: playerState,
      }),
    );
  }

  broadcast(data: any) {
    this.server.clients.forEach((client: any) => {
      if (client.readyState === 1) {
        client.send(data);
      }
    });
  }

  @SubscribeMessage('play')
  play(client, data): string {
    this.mpdService.play();
    return '';
  }

  @SubscribeMessage('pause')
  pause(client, data): string {
    this.mpdService.pause();
    return '';
  }

  @SubscribeMessage('getAlbums')
  getAlbums(client: any, data: any): Observable<any> {
    console.log('getAlbums');
    return this.mpdService.getAlbums().pipe(
      map(x => ({
        event: '[Server] Albums',
        data: x,
      })),
    );
  }

  @SubscribeMessage('getGenres')
  getGenres(client: any, data: any): Observable<any> {
    console.log('getGenres');
    return this.mpdService.getGenres().pipe(
      map(x => ({
        event: '[Server] Genres',
        data: x,
      })),
    );
  }

  @SubscribeMessage('playUri')
  playUri(client: any, data: any): string {
    this.mpdService.playUri(data);
    console.log(data);
    return '';
  }
}
