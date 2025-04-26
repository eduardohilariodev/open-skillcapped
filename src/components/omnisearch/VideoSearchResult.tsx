import { roleToString } from "../../model/Role";
import React from "react";
import { Video } from "../../model/Video";
import { ToggleWatchStatusButton } from "../ToggleWatchStatusButton";
import { ToggleBookmarkButton } from "../BookmarkToggleButton";
import { Bookmarkable } from "../../model/Bookmark";
import { Watchable } from "../../model/WatchStatus";
import { getStreamUrl } from "../../utils/UrlUtilities";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudDownloadAlt } from "@fortawesome/free-solid-svg-icons";
import Highlighter from "react-highlight-words";
import { useVideoPlayer } from "../../components/VideoPlayerPortal";
import "./SearchResult.css";
import "../../styles/card-states.css";

export interface VideoSearchResultProps {
  video: Video;
  isBookmarked: boolean;
  isWatched: boolean;
  onToggleBookmark: (item: Bookmarkable) => void;
  onToggleWatchStatus: (item: Watchable) => void;
  matchedStrings: string[];
  isDownloadEnabled: boolean;
}

export function VideoSearchResult(props: VideoSearchResultProps): React.ReactElement {
  const { video, matchedStrings, isDownloadEnabled } = props;
  const { showVideoPlayer } = useVideoPlayer();
  const buttonProps = {
    ...props,
    item: video,
  };

  const handleVideoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    showVideoPlayer(video);
  };

  return (
    <div key={video.uuid} className="box hextech-card">
      <div className="box-content">
        <div className="corner-top-right"></div>
        <div className="corner-bottom-left"></div>
        <div className="columns">
          {/* First column - Image */}
          <div className="column is-3">
            <figure className="image course-image">
              <img
                src={video.imageUrl}
                alt="Video thumbnail"
                className="thumbnail"
                onClick={handleVideoClick}
                style={{ cursor: "pointer" }}
              />
            </figure>

            <div className="buttons mt-3">
              <ToggleBookmarkButton {...buttonProps} />
              <ToggleWatchStatusButton {...buttonProps} />
              {isDownloadEnabled && (
                <a href={getStreamUrl(video)} className="button is-small bookmark">
                  <span className="icon is-small">
                    <FontAwesomeIcon icon={faCloudDownloadAlt} />
                  </span>
                  <span>Download</span>
                </a>
              )}
            </div>
          </div>

          {/* Second column - Title, description, metadata */}
          <div className="column is-9">
            <h3 className="title is-4 mb-2">
              <a href={video.skillCappedUrl} onClick={handleVideoClick}>
                <Highlighter searchWords={matchedStrings} textToHighlight={video.title} autoEscape={true} />
              </a>
            </h3>
            <p className="mb-3">
              <Highlighter searchWords={matchedStrings} textToHighlight={video.description} autoEscape={true} />
            </p>
            <div className="tags mb-4">
              <span className="tag is-primary">Content Type: Video</span>
              <span className="tag is-primary is-light">Role: {roleToString(video.role)}</span>
              <span className="tag is-primary is-light" title={video.releaseDate.toLocaleString()}>
                Released: {video.releaseDate.toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
