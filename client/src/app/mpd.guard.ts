import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
} from '@angular/router';
import { Store } from '@ngxs/store';
import { ConnectWebSocket } from '@ngxs/websocket-plugin';
import { Observable } from 'rxjs';
import { IAppState } from './store/app.model';

@Injectable({
  providedIn: 'root',
})
export class MpdGuard implements CanActivate {
  constructor(private store: Store) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    this.store.dispatch(new ConnectWebSocket());

    return this.store.select(
      (appState: IAppState) => appState.app.isConnectedToServer
    );
  }
}
