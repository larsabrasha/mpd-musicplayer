import { Album } from './albums.model';

export class Albums {
  static readonly type = '[Albums] Play Album';
  constructor(public album: Album) {}
}
