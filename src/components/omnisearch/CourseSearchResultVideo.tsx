import { Video } from "../../model/Video";
import { Course } from "../../model/Course";
import Highlighter from "react-highlight-words";
import React from "react";
import { Bookmarkable } from "../../model/Bookmark";
import { Watchable } from "../../model/WatchStatus";
import classNames from "classnames";
import "./SearchResult.css";
import "../../styles/Episode.css";
import "../../styles/card-states.css";
import { useVideoPlayer } from "../../components/VideoPlayerPortal";
import { WatchButton } from "../../components/WatchButton";

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
  const { course, video, matchedStrings, isWatched } = props;
  const { showVideoPlayer } = useVideoPlayer();

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
      <div className="episode-card" onClick={handleVideoClick}>
        <div className="episode-content">
          {episodeNumber && <div className="episode-number">{episodeNumber}</div>}
          {episodeNumber && <span className="episode-separator">|</span>}
          <Highlighter
            highlightClassName="bg-yellow-300"
            searchWords={matchedStrings}
            autoEscape={true}
            textToHighlight={video.title}
            className={classNames("episode-title", isWatched ? "watched" : "")}
          />
        </div>
        <div className="episode-actions">
          <WatchButton video={video} course={course} />
        </div>
      </div>
    </li>
  );
}
