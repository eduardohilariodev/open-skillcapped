import { Bookmarkable } from "../model/Bookmark";
import React from "react";
import { ToggleButton } from "./ToggleButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark } from "@fortawesome/free-solid-svg-icons";
import { colors } from "../styles";

export interface BookmarkButtonProps {
  item: Bookmarkable;
  isBookmarked: boolean;
  onToggleBookmark: (item: Bookmarkable) => void;
}

export function ToggleBookmarkButton(props: BookmarkButtonProps): React.ReactElement {
  const { item, isBookmarked, onToggleBookmark } = props;

  // Apply League of Legends styling with appropriate button type
  const buttonType = isBookmarked ? "secondary" : "primary";

  // Styling for icon
  const iconStyle = {
    marginRight: "0.5rem",
    color: isBookmarked ? colors.gold.medium : colors.black,
  };

  // Styling for text
  const textStyle = {
    fontSize: "0.875rem",
  };

  return (
    <ToggleButton
      status={isBookmarked}
      onToggle={() => onToggleBookmark(item)}
      type={buttonType}
      buttonText={(status) => {
        return (
          <React.Fragment>
            <span style={iconStyle}>
              <FontAwesomeIcon icon={faBookmark} />
            </span>
            <span style={textStyle}>{status ? "Unbookmark" : "Bookmark"}</span>
          </React.Fragment>
        );
      }}
    />
  );
}
