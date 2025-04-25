import React from "react";
import OmniSearchable from "./OmniSearchable";
import { Bookmarkable } from "../../model/Bookmark";
import { Watchable } from "../../model/WatchStatus";
import { BookmarkToggleButton } from "../BookmarkToggleButton";
import { ToggleWatchStatusButton } from "../ToggleWatchStatusButton";

export interface OmniSearchResultProps {
  item: OmniSearchable;
  isWatched: (item: Watchable) => boolean;
  isBookmarked: (item: Bookmarkable) => boolean;
  onToggleBookmark: (item: Bookmarkable) => void;
  onToggleWatchStatus: (item: Watchable) => void;
  matchedStrings: Record<string, string[]>;
  isDownloadEnabled: boolean;
}

export function OmniSearchResult({
  item,
  isWatched,
  isBookmarked,
  onToggleBookmark,
  onToggleWatchStatus,
  matchedStrings,
  isDownloadEnabled,
}: OmniSearchResultProps): React.ReactElement {
  const isItemWatched = isWatched(item);
  const isItemBookmarked = isBookmarked(item);

  return (
    <div className="box mb-4">
      <article className="media">
        <div className="media-left">
          <figure className="image is-128x128 mr-4">
            <img
              src={item.imageUrl}
              alt={item.title}
            />
          </figure>
        </div>
        <div className="media-content">
          <div className="content">
            <div className="mb-2 is-flex is-align-items-center">
              <p className="is-size-5 has-text-weight-bold mr-3 my-0">
                {item.title}
              </p>
              <span className="tag is-info mr-2">{item.role}</span>
              {/* Timestamp here if needed */}
            </div>
            <p>{item.description}</p>
            <div className="is-flex is-align-items-center mt-3">
              <a
                href={item.skillCappedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="button is-primary is-small mr-2"
              >
                View on SkillCapped
              </a>
              <div className="ml-auto">
                <BookmarkToggleButton
                  isBookmarked={isItemBookmarked}
                  onClick={() => onToggleBookmark(item)}
                />
                <ToggleWatchStatusButton
                  isWatched={isItemWatched}
                  onClick={() => onToggleWatchStatus(item)}
                />
              </div>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
