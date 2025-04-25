import { Bookmarkable } from "./Bookmark";
import { Watchable } from "./WatchStatus";

export interface Commentary extends Bookmarkable, Watchable {
  id: string;
  description: string;
  releaseDate: Date;
  duration: number;
  videoUrl?: string;
} 
