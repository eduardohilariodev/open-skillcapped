export interface Watchable {
  uuid: string;
}

export interface WatchStatus {
  item: Watchable;
  isWatched: boolean;
  lastUpdate: Date;
}
