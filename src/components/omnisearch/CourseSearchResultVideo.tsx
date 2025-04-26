import { Video } from "../../model/Video";
import { Course } from "../../model/Course";
import Highlighter from "react-highlight-words";
import React from "react";
import { getCourseVideoUrl } from "../../utils/UrlUtilities";
import { Bookmarkable } from "../../model/Bookmark";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { Watchable } from "../../model/WatchStatus";
import classNames from "classnames";
import "./SearchResult.css";
import "../../styles/card-states.css";
import { useVideoPlayer } from "../../components/VideoPlayerPortal";

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
  const { showVideoPlayer } = useVideoPlayer();

  const link = getCourseVideoUrl(video, course);

  const bookmarkHint = isBookmarked ? "Unbookmark" : "Bookmark";
  const watchToggleIcon = isWatched ? faEyeSlash : faEye;
  const watchToggleHint = isWatched ? "Mark as unwatched" : "Watch as watched";
  const textStyle = isWatched ? "has-text-grey-lighter" : "";

  const handleVideoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    showVideoPlayer(video, course);
  };

  // Get the index of this video in the course (for episode number)
  const getVideoIndex = (): number | undefined => {
    if (!course || !course.videos) return undefined;
    const index = course.videos.findIndex((cv) => cv.video.uuid === video.uuid);
    return index !== -1 ? index + 1 : undefined;
  };

  const episodeNumber = getVideoIndex();

  return (
    <li className="episode-item">
      {episodeNumber && <div className="episode-number">{episodeNumber}</div>}
      <div className="episode-card" onClick={handleVideoClick}>
        <div className="episode-content">
          <Highlighter
            highlightClassName="bg-yellow-300"
            searchWords={matchedStrings}
            autoEscape={true}
            textToHighlight={video.title}
            className={classNames("episode-title", isWatched ? "watched" : "")}
          />
        </div>
        <div className="episode-actions">
          <button
            className={classNames("episode-action-button", isWatched ? "watched" : "")}
            onClick={(e) => {
              e.stopPropagation();
              props.onToggleWatchStatus(video);
            }}
            title={watchToggleHint}
          >
            <FontAwesomeIcon icon={watchToggleIcon} />
          </button>
          <button
            className={classNames("episode-action-button", isBookmarked ? "bookmarked" : "")}
            onClick={(e) => {
              e.stopPropagation();
              props.onToggleBookmark(video);
            }}
            title={bookmarkHint}
          >
            <FontAwesomeIcon icon={faBookmark} />
          </button>
        </div>
      </div>
    </li>
  );
}
