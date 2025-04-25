import React from "react";

export interface BookmarkToggleButtonProps {
  isBookmarked: boolean;
  onClick: () => void;
}

export function BookmarkToggleButton({
  isBookmarked,
  onClick,
}: BookmarkToggleButtonProps): React.ReactElement {
  return (
    <button
      className={`button is-small mr-2 ${isBookmarked ? "is-warning" : "is-light"}`}
      onClick={onClick}
      aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
    >
      <span className="icon is-small">
        <i
          className={`fas ${isBookmarked ? "fa-bookmark" : "fa-bookmark"}`}
        ></i>
      </span>
      <span>{isBookmarked ? "Bookmarked" : "Bookmark"}</span>
    </button>
  );
}
