import { Video } from "./Video";
import { Bookmarkable } from "./Bookmark";

export interface Course extends Bookmarkable {
  id: string;
  videos: Video[];
  description: string;
  chapters: Chapter[];
  releaseDate: Date;
}

export interface Chapter {
  id: string;
  title: string;
  videos: Video[];
} 
