import React from "react";
import { ToggleButton } from "./ToggleButton";
import { Watchable } from "../model/WatchStatus";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import "../styles/button-states.css";
import "../styles/button-icons.css";

export interface ToggleWatchStatusButtonProps {
  item: Watchable;
  isWatched: boolean;
  onToggleWatchStatus: (item: Watchable) => void;
  disabled?: boolean;
}

export function ToggleWatchStatusButton(props: ToggleWatchStatusButtonProps): React.ReactElement {
  const { item, isWatched, onToggleWatchStatus, disabled = false } = props;
  const watchToggleIcon = isWatched ? faEyeSlash : faEye;

  // Apply League of Legends styling with appropriate button type
  const buttonType = isWatched ? "secondary" : "utility";

  // Icon classes with animation
  const iconClasses = `watch-status-icon ${isWatched ? "watched" : ""}`;

  return (
    <ToggleButton
      status={isWatched}
      onToggle={() => onToggleWatchStatus(item)}
      type={buttonType}
      disabled={disabled}
      classes="watch-status-toggle-button"
      buttonText={(status) => {
        return (
          <React.Fragment>
            <span className={iconClasses}>
              <FontAwesomeIcon icon={watchToggleIcon} />
            </span>
            <span>{status ? "Mark as unwatched" : "Mark as watched"}</span>
          </React.Fragment>
        );
      }}
    />
  );
}
