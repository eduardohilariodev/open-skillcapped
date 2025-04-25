import React from "react";

export interface ToggleWatchStatusButtonProps {
  isWatched: boolean;
  onClick: () => void;
}

export function ToggleWatchStatusButton({
  isWatched,
  onClick,
}: ToggleWatchStatusButtonProps): React.ReactElement {
  return (
    <button
      className={`button is-small ${isWatched ? "is-success" : "is-light"}`}
      onClick={onClick}
      aria-label={isWatched ? "Mark as unwatched" : "Mark as watched"}
    >
      <span className="icon is-small">
        <i className={`fas ${isWatched ? "fa-check-circle" : "fa-eye"}`}></i>
      </span>
      <span>{isWatched ? "Watched" : "Mark watched"}</span>
    </button>
  );
}
