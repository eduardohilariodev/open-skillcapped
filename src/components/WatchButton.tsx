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
}

export function WatchButton(props: WatchButtonProps): React.ReactElement {
  const { video, course, disabled = false } = props;
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
        classes="watch-button"
        buttonText={() => {
          return (
            <React.Fragment>
              <span className="watch-icon">
                <FontAwesomeIcon icon={faPlay} />
              </span>
              <span>Watch</span>
            </React.Fragment>
          );
        }}
      />
    </div>
  );
}
