import { Bookmarkable } from "./Bookmark";

export interface Watchable extends Bookmarkable {}

export interface WatchStatus {
  item: Watchable;
  isWatched: boolean;
  lastUpdate: Date;
} 
