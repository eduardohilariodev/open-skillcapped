import { Commentary } from "../../model/Commentary";
import { Course } from "../../model/Course";
import { Video } from "../../model/Video";
import { Bookmarkable } from "../../model/Bookmark";
import { Watchable } from "../../model/WatchStatus";

export interface OmniSearchableItem extends Bookmarkable, Watchable {
  title: string;
  description: string;
  releaseDate: Date;
  role?: string;
  imageUrl?: string;
  skillCappedUrl?: string;
}

type OmniSearchable = Video | Course | Commentary;

export default OmniSearchable;

export const searchableFields = [
  "title",
  "description",
  "staff",
  "champion",
  "opponent",
  "role",
  "carry",
];
