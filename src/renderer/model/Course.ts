import { Video } from "./Video";
import { Bookmarkable } from "./Bookmark";
import { CourseVideo } from "./CourseVideo";

export interface Course extends Bookmarkable {
  uuid: string;
  title: string;
  description?: string;
  releaseDate: Date;
  role: string;
  image: string;
  videos: CourseVideo[];
}

export interface Chapter {
  id: string;
  title: string;
  videos: Video[];
}

export function isCourse(item: any): item is Course {
  return item?.uuid !== undefined && item?.videos !== undefined;
}
