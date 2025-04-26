import React from "react";
import { Video } from "../model/Video";
import { Course } from "../model/Course";
import { ToggleButton } from "./ToggleButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import { useVideoPlayer } from "./VideoPlayerPortal";
import "../styles/button-states.css";

export interface WatchButtonProps {
  video: Video;
  course?: Course;
  disabled?: boolean;
  compact?: boolean;
}

export function WatchButton(props: WatchButtonProps): React.ReactElement {
  const { video, course, disabled = false, compact = true } = props;
  const { showVideoPlayer } = useVideoPlayer();

  // Apply League of Legends styling
  const buttonType = "primary";

  const handleWatchClick = () => {
    showVideoPlayer(video, course);
  };

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <ToggleButton
        status={false}
        onToggle={handleWatchClick}
        type={buttonType}
        disabled={disabled}
        classes={`watch-button ${compact ? "py-1 px-2 min-w-0 h-auto" : ""}`}
        buttonText={() => {
          return (
            <React.Fragment>
              <span className={`flex items-center justify-center ${!compact ? "mr-2" : ""}`}>
                <FontAwesomeIcon icon={faPlay} />
              </span>
              {!compact && <span>Watch</span>}
            </React.Fragment>
          );
        }}
      />
    </div>
  );
}
