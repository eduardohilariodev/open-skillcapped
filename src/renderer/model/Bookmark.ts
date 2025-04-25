export interface Bookmarkable {
  uuid: string;
}

export interface Bookmark {
  item: Bookmarkable;
  date: Date;
}
