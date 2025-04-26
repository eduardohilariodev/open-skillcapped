import { Video } from "../../model/Video";
import { Course } from "../../model/Course";
import Highlighter from "react-highlight-words";
import React from "react";
import { Bookmarkable } from "../../model/Bookmark";
import { Watchable } from "../../model/WatchStatus";
import classNames from "classnames";
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
    <li className="mb-3 flex items-center last:mb-0">
      <div
        className="bg-background-medium/30 border border-gold-dark rounded py-2 px-3 flex justify-between items-center cursor-pointer transition-all w-full hover:shadow-hextech-hover hover:bg-background-medium/50 hover:border-gold-medium"
        onClick={handleVideoClick}
      >
        <div className="flex-1 flex items-center">
          {episodeNumber && (
            <div className="relative left-0 min-w-6 h-6 flex items-center justify-center bg-transparent text-blue-medium font-bold font-beaufort border-0 mr-0 flex-shrink-0">
              {episodeNumber}
            </div>
          )}
          {episodeNumber && <span className="text-gold-dark mx-2 opacity-60">|</span>}
          <Highlighter
            highlightClassName="bg-blue-medium/20 text-blue-light px-1 py-0.5 rounded"
            searchWords={matchedStrings}
            autoEscape={true}
            textToHighlight={video.title}
            className={classNames(isWatched ? "text-text-muted" : "text-gold-light", "text-sm font-medium")}
          />
        </div>
        <div className="flex gap-3 ml-3 pl-3 sm:gap-2 sm:ml-2 sm:pl-2">
          <WatchButton video={video} course={course} compact={true} />
        </div>
      </div>
    </li>
  );
}
