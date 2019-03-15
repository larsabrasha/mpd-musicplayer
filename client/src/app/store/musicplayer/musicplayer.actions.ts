export class Albums {
  static readonly type = '[Server] Albums';
  constructor(public data: any) {}
}

export class StatusUpdated {
  static readonly type = '[Server] Status Was Updated';
  constructor(public data: any) {}
}
