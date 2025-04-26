import { Bookmarkable } from "../model/Bookmark";
import React from "react";
import { ToggleButton } from "./ToggleButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark } from "@fortawesome/free-solid-svg-icons";
import "../styles/button-states.css";
import "../styles/button-icons.css";

export interface BookmarkButtonProps {
  item: Bookmarkable;
  isBookmarked: boolean;
  onToggleBookmark: (item: Bookmarkable) => void;
  disabled?: boolean;
}

export function ToggleBookmarkButton(props: BookmarkButtonProps): React.ReactElement {
  const { item, isBookmarked, onToggleBookmark, disabled = false } = props;

  // Apply League of Legends styling with appropriate button type
  const buttonType = isBookmarked ? "secondary" : "primary";

  // Icon classes with animation
  const iconClasses = `bookmark-icon ${isBookmarked ? "bookmarked" : ""}`;

  return (
    <ToggleButton
      status={isBookmarked}
      onToggle={() => onToggleBookmark(item)}
      type={buttonType}
      disabled={disabled}
      classes="bookmark-toggle-button"
      buttonText={(status) => {
        return (
          <React.Fragment>
            <span className={iconClasses}>
              <FontAwesomeIcon icon={faBookmark} />
            </span>
            <span>{status ? "Unbookmark" : "Bookmark"}</span>
          </React.Fragment>
        );
      }}
    />
  );
}
