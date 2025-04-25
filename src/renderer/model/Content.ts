import { Course } from "./Course";
import { Video } from "./Video";
import { Commentary } from "./Commentary";

export interface Content {
  courses: Course[];
  videos: Video[];
  commentaries: Commentary[];
} 
