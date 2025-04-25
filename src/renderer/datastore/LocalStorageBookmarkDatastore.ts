import { Bookmark } from "../model/Bookmark";
import { BookmarkDatastore } from "./BookmarkDatastore";
import { Content } from "../model/Content";

export class LocalStorageBookmarkDatastore implements BookmarkDatastore {
  private static LOCAL_STORAGE_KEY = "bookmarks";
  private content: Content;

  constructor(content: Content) {
    this.content = content;
  }

  add(bookmark: Bookmark): void {
    const bookmarks = this.get();
    bookmarks.push(bookmark);
    this.save(bookmarks);
  }

  remove(bookmark: Bookmark): void {
    const bookmarks = this.get();
    const index = bookmarks.findIndex((item) => item.item.uuid === bookmark.item.uuid);
    if (index !== -1) {
      bookmarks.splice(index, 1);
      this.save(bookmarks);
    }
  }

  get(): Bookmark[] {
    const bookmarksJson = localStorage.getItem(LocalStorageBookmarkDatastore.LOCAL_STORAGE_KEY);
    if (bookmarksJson === null) {
      return [];
    }

    try {
      const bookmarks = JSON.parse(bookmarksJson);
      
      // Convert date strings back to Date objects
      return bookmarks.map((bookmark: any) => {
        return {
          ...bookmark,
          date: new Date(bookmark.date)
        };
      });
    } catch (e) {
      console.error("Failed to parse bookmarks from local storage", e);
      return [];
    }
  }

  private save(bookmarks: Bookmark[]): void {
    localStorage.setItem(
      LocalStorageBookmarkDatastore.LOCAL_STORAGE_KEY,
      JSON.stringify(bookmarks)
    );
  }
} 
