import { roleToString } from "../../model/Role";
import React from "react";
import { getStreamUrl } from "../../utils/UrlUtilities";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudDownloadAlt } from "@fortawesome/free-solid-svg-icons";
import { Commentary } from "../../model/Commentary";
import { ToggleBookmarkButton } from "../BookmarkToggleButton";
import { ToggleWatchStatusButton } from "../ToggleWatchStatusButton";
import { Bookmarkable } from "../../model/Bookmark";
import { Watchable } from "../../model/WatchStatus";
import { useVideoPlayer } from "../../components/VideoPlayerPortal";
import "./SearchResult.css";
import "../../styles/card-states.css";

export interface CommentarySearchResultProps {
  commentary: Commentary;
  matchedStrings: string[];
  isBookmarked: boolean;
  isWatched: boolean;
  onToggleBookmark: (item: Bookmarkable) => void;
  onToggleWatchStatus: (item: Watchable) => void;
  isDownloadEnabled: boolean;
}

export function CommentarySearchResult(props: CommentarySearchResultProps): React.ReactElement {
  const { commentary, isDownloadEnabled } = props;
  const { showVideoPlayer } = useVideoPlayer();
  const {
    role,
    uuid,
    skillCappedUrl,
    releaseDate,
    staff,
    champion,
    opponent,
    kills,
    deaths,
    assists,
    gameLengthInMinutes,
    carry,
    type,
  } = commentary;

  const buttonProps = {
    ...props,
    item: commentary,
  };

  const handleVideoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    showVideoPlayer(commentary);
  };

  return (
    <div key={uuid} className="box hextech-card">
      <div className="box-content">
        <div className="corner-top-right"></div>
        <div className="corner-bottom-left"></div>
        <div className="columns">
          {/* First column - Image */}
          <div className="column is-3">
            <figure className="image course-image">
              <img
                src={commentary.imageUrl}
                alt="Commentary thumbnail"
                className="thumbnail"
                onClick={handleVideoClick}
                style={{ cursor: "pointer" }}
              />
            </figure>

            <div className="buttons mt-3">
              <ToggleBookmarkButton {...buttonProps} />
              <ToggleWatchStatusButton {...buttonProps} />
              {isDownloadEnabled && (
                <a href={getStreamUrl(commentary)} className="button bookmark is-small">
                  <span className="icon is-small">
                    <FontAwesomeIcon icon={faCloudDownloadAlt} />
                  </span>
                  <span>Download</span>
                </a>
              )}
            </div>
          </div>

          {/* Second column - Title, metadata */}
          <div className="column is-9">
            <h3 className="title is-4 mb-2">
              <a href={skillCappedUrl} onClick={handleVideoClick}>
                {champion} vs {opponent}
              </a>
            </h3>
            <div className="tags mb-4">
              <span className="tag is-primary">Content Type: Commentary</span>
              <span className="tag is-primary is-light">Role: {roleToString(role)}</span>
              <span className="tag is-primary is-light" title={releaseDate.toLocaleString()}>
                Released: {releaseDate.toLocaleDateString()}
              </span>
              <span className="tag">Player: {staff}</span>
              <span className="tag">
                K/D/A: {kills}/{deaths}/{assists}
              </span>
              <span className="tag">Game Length: {gameLengthInMinutes} minutes</span>
              <span className="tag">Carry Amount: {carry}</span>
              <span className="tag">Account Type: {type}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
