import { WatchStatus } from "../model/WatchStatus";
import { WatchStatusDatastore } from "./WatchStatusDatastore";

export class LocalStorageWatchStatusDatastore implements WatchStatusDatastore {
  private static LOCAL_STORAGE_KEY = "watchStatus";

  add(watchStatus: WatchStatus): void {
    const watchStatuses = this.get();
    watchStatuses.push(watchStatus);
    this.save(watchStatuses);
  }

  remove(watchStatus: WatchStatus): void {
    const watchStatuses = this.get();
    const index = watchStatuses.findIndex((item) => item.item.uuid === watchStatus.item.uuid);
    if (index !== -1) {
      watchStatuses.splice(index, 1);
      this.save(watchStatuses);
    }
  }

  get(): WatchStatus[] {
    const watchStatusesJson = localStorage.getItem(LocalStorageWatchStatusDatastore.LOCAL_STORAGE_KEY);
    if (watchStatusesJson === null) {
      return [];
    }

    try {
      const watchStatuses = JSON.parse(watchStatusesJson);
      
      // Convert date strings back to Date objects
      return watchStatuses.map((watchStatus: any) => {
        return {
          ...watchStatus,
          lastUpdate: new Date(watchStatus.lastUpdate)
        };
      });
    } catch (e) {
      console.error("Failed to parse watch statuses from local storage", e);
      return [];
    }
  }

  private save(watchStatuses: WatchStatus[]): void {
    localStorage.setItem(
      LocalStorageWatchStatusDatastore.LOCAL_STORAGE_KEY,
      JSON.stringify(watchStatuses)
    );
  }
} 
