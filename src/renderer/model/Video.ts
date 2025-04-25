import { Bookmarkable } from "./Bookmark";
import { Watchable } from "./WatchStatus";

export interface Video extends Bookmarkable, Watchable {
  id: string;
  description: string;
  releaseDate: Date;
  duration: number;
  videoUrl?: string;
  courseId?: string;
  chapterId?: string;
} 
