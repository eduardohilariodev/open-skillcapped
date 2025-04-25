import { Bookmark } from "../model/Bookmark";

export interface BookmarkDatastore {
  add(bookmark: Bookmark): void;
  remove(bookmark: Bookmark): void;
  get(): Bookmark[];
} 
