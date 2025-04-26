import React from "react";
import { ToggleButton } from "./ToggleButton";
import { Watchable } from "../model/WatchStatus";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { colors } from "../styles";

export interface ToggleWatchStatusButtonProps {
  item: Watchable;
  isWatched: boolean;
  onToggleWatchStatus: (item: Watchable) => void;
}

export function ToggleWatchStatusButton(props: ToggleWatchStatusButtonProps): React.ReactElement {
  const { item, isWatched, onToggleWatchStatus } = props;
  const watchToggleIcon = isWatched ? faEyeSlash : faEye;

  // Apply League of Legends styling with appropriate button type
  const buttonType = isWatched ? "secondary" : "primary";

  // Styling for icon
  const iconStyle = {
    marginRight: "0.5rem",
    color: isWatched ? colors.gold.medium : colors.black,
  };

  // Styling for text
  const textStyle = {
    fontSize: "0.875rem",
  };

  return (
    <ToggleButton
      status={isWatched}
      onToggle={() => onToggleWatchStatus(item)}
      type={buttonType}
      buttonText={(status) => {
        return (
          <React.Fragment>
            <span style={iconStyle}>
              <FontAwesomeIcon icon={watchToggleIcon} />
            </span>
            <span style={textStyle}>{status ? "Mark as unwatched" : "Mark as watched"}</span>
          </React.Fragment>
        );
      }}
    />
  );
}
