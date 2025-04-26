import { Video } from "../../model/Video";
import { Course } from "../../model/Course";
import Highlighter from "react-highlight-words";
import React, { useState } from "react";
import { getCourseVideoUrl } from "../../utils/UrlUtilities";
import { Bookmarkable } from "../../model/Bookmark";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { Watchable } from "../../model/WatchStatus";
import classNames from "classnames";
import { VideoPlayerDialog } from "../VideoPlayerDialog";
import "./SearchResult.css";
import "../../styles/card-states.css";

export interface SearchResultVideoProps {
  matchedStrings: string[];
  course: Course;
  video: Video;
  onToggleWatchStatus: (item: Watchable) => void;
  onToggleBookmark: (item: Bookmarkable) => void;
  isWatched: boolean;
  isBookmarked: boolean;
  isDownloadEnabled: boolean;
}

export function CourseSearchResultVideo(props: SearchResultVideoProps): React.ReactElement {
  const { course, video, matchedStrings, isWatched, isBookmarked } = props;
  const { title } = video;
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);

  const link = getCourseVideoUrl(video, course);

  const bookmarkHint = isBookmarked ? "Unbookmark" : "Bookmark";
  const watchToggleIcon = isWatched ? faEyeSlash : faEye;
  const watchToggleHint = isWatched ? "Mark as unwatched" : "Watch as watched";
  const textStyle = isWatched ? "has-text-grey-lighter" : "";

  const handleVideoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsPlayerOpen(true);
  };

  return (
    <li className="mb-2">
      <div
        className={classNames(
          "flex gap-3 m-1 px-3 py-2 rounded-lg cursor-pointer hextech-card-secondary",
          "hextech-card-hover hextech-card-active",
        )}
        onClick={handleVideoClick}
      >
        <div className="flex justify-between items-center w-full gap-3">
          <div className="flex-1">
            <Highlighter
              highlightClassName="bg-yellow-300"
              searchWords={matchedStrings}
              autoEscape={true}
              textToHighlight={video.title}
              className="text-sm"
            />
          </div>
          <div className="flex gap-2">
            <button
              className="text-gray-400 hover:text-gray-200"
              onClick={(e) => {
                e.stopPropagation();
                props.onToggleWatchStatus(video);
              }}
            >
              <FontAwesomeIcon icon={isWatched ? faEye : faEyeSlash} />
            </button>
            <button
              className={classNames("hover:text-gray-200", isBookmarked ? "text-yellow-400" : "text-gray-400")}
              onClick={(e) => {
                e.stopPropagation();
                props.onToggleBookmark(video);
              }}
            >
              <FontAwesomeIcon icon={faBookmark} />
            </button>
          </div>
        </div>
      </div>
      <VideoPlayerDialog video={video} course={course} isOpen={isPlayerOpen} onClose={() => setIsPlayerOpen(false)} />
    </li>
  );
}
