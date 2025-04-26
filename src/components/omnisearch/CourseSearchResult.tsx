import { Course } from "../../model/Course";
import React from "react";
import Highlighter from "react-highlight-words";
import "./SearchResult.css";
import "../../styles/card-states.css";
import "../../styles/Episode.css";
import { Watchable } from "../../model/WatchStatus";
import { FuseSearchResult } from "./search/FuseSearch";
import { CourseSearchResultVideo } from "./CourseSearchResultVideo";
import { roleToString } from "../../model/Role";
import { Bookmarkable } from "../../model/Bookmark";

export interface CourseSearchResultProps {
  result: FuseSearchResult<Course>;
  onToggleBookmark: (item: Bookmarkable) => void;
  isBookmarked: (item: Bookmarkable) => boolean;
  isWatched: (item: Watchable) => boolean;
  onToggleWatchStatus: (item: Watchable) => void;
  isDownloadEnabled: boolean;
}

export function CourseSearchResult(props: CourseSearchResultProps): React.ReactElement {
  const { result, isWatched, onToggleWatchStatus, onToggleBookmark, isBookmarked, isDownloadEnabled } = props;
  const { matchedStrings, item: course } = result;

  const videos = course.videos.map(({ video }) => {
    return (
      <CourseSearchResultVideo
        key={video.uuid}
        matchedStrings={matchedStrings}
        course={course}
        video={video}
        onToggleWatchStatus={onToggleWatchStatus}
        isWatched={isWatched(video)}
        onToggleBookmark={onToggleBookmark}
        isBookmarked={isBookmarked(video)}
        isDownloadEnabled={isDownloadEnabled}
      />
    );
  });

  return (
    <div key={course.uuid} className="box hextech-card">
      <div className="box-content">
        <div className="corner-top-right"></div>
        <div className="corner-bottom-left"></div>

        <div className="columns">
          {/* First column - Image */}
          <div className="column is-3">
            <figure className="image course-image">
              <img src={course.image} alt="Course thumbnail" className="thumbnail" />
            </figure>
          </div>

          {/* Second column - Title, metadata, and builds list */}
          <div className="column is-9">
            <span className="tag is-outline">Course</span>
            <h3 className="title is-4 mb-2">
              <Highlighter searchWords={props.result.matchedStrings} textToHighlight={course.title} autoEscape={true} />
            </h3>
            <p className="mb-3">{course.description}</p>
            <div className="tags mb-4">
              <span className="">{roleToString(props.result.item.role)}</span>
              <span className="mx-2">•</span>
              <span className="" title={props.result.item.releaseDate.toLocaleString()}>
                {props.result.item.releaseDate.toLocaleDateString()}
              </span>
            </div>

            {/* Build list */}
            <div className="course-videos-list">
              <ol className="video-list">{videos}</ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
