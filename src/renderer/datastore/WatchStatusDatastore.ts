import { WatchStatus } from "../model/WatchStatus";

export interface WatchStatusDatastore {
  add(watchStatus: WatchStatus): void;
  remove(watchStatus: WatchStatus): void;
  get(): WatchStatus[];
}
