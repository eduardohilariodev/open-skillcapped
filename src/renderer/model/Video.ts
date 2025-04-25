import { Bookmarkable } from "./Bookmark";
import { Watchable } from "./WatchStatus";

export interface Video extends Bookmarkable, Watchable {
  uuid: string;
  title: string;
  description: string;
  releaseDate: Date;
  durationInSeconds: number;
  imageUrl: string;
  skillCappedUrl: string;
  role: string;
}

export function isVideo(item: any): item is Video {
  return (
    item?.uuid !== undefined &&
    item?.durationInSeconds !== undefined &&
    item?.staff === undefined
  );
}
