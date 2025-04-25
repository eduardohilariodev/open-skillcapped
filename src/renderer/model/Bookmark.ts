export interface Bookmarkable {
  uuid: string;
  title: string;
  thumbnailUrl: string;
  url: string;
}

export interface Bookmark {
  item: Bookmarkable;
  date: Date;
} 
