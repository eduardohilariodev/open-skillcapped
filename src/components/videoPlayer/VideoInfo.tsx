import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClock,
  faCalendarAlt,
  faUserAlt,
  faStepForward,
  faToggleOn,
  faToggleOff,
} from "@fortawesome/free-solid-svg-icons";
import { roleToString } from "../../model/Role";
import { VideoInfoProps } from "./types";

export function VideoInfo({
  video,
  index,
  actualDuration,
  autoplayEnabled,
  playbackSpeed,
  currentQueueIndex,
  queueLength,
  onPlaybackRateChange,
  onAutoplayToggle,
  onPlayNext,
  formatDuration,
}: VideoInfoProps): React.ReactElement {
  // Format the release date safely
  const formatReleaseDate = () => {
    if (!video.releaseDate) {
      return "Unknown";
    }

    // Check if releaseDate is a string that needs to be converted
    if (typeof video.releaseDate === "string") {
      try {
        return new Date(video.releaseDate).toLocaleDateString();
      } catch (error) {
        return "Unknown";
      }
    }

    // Check if it's a number (timestamp)
    if (typeof video.releaseDate === "number") {
      try {
        return new Date(video.releaseDate).toLocaleDateString();
      } catch (error) {
        return "Unknown";
      }
    }

    // Check if it's already a Date object
    if (video.releaseDate instanceof Date) {
      return video.releaseDate.toLocaleDateString();
    }

    // If it's an object with a timestamp
    if (typeof video.releaseDate === "object" && video.releaseDate !== null) {
      try {
        // Try to create a date from the object's valueOf or timestamp
        const dateObj = video.releaseDate as unknown as { valueOf?: () => number };
        if (dateObj.valueOf) {
          return new Date(dateObj.valueOf()).toLocaleDateString();
        }

        // If that fails, try to convert the entire object to a date
        return new Date(video.releaseDate as any).toLocaleDateString();
      } catch (error) {
        return "Unknown";
      }
    }

    return "Unknown";
  };

  return (
    <div className="bg-[var(--hextech-color-background-dark)] p-6 border-t border-[var(--hextech-color-gold-dark)] flex-1 flex flex-col relative">
      {/* Decorative top border */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--hextech-color-gold-dark)] via-[var(--hextech-color-gold)] to-[var(--hextech-color-gold-dark)]" />

      {/* Video title */}
      <h2 className="m-0 text-lg text-[var(--hextech-color-gold-light)] flex flex-wrap items-center gap-3 mb-4 font-[500] font-[Beaufort_for_LOL]">
        {index && (
          <span className="text-[var(--hextech-color-gold-medium)] font-normal bg-black/30 py-0.5 px-2 rounded">
            #{index}
          </span>
        )}
        {index && <span className="text-[var(--hextech-color-gold-dark)]">|</span>}
        <span className="font-[700] flex-grow">{video.title}</span>
      </h2>

      {/* Video metadata */}
      <div className="flex flex-wrap gap-4 mb-2">
        <div className="flex items-center gap-2.5">
          <FontAwesomeIcon icon={faClock} className="text-[var(--hextech-color-gold)]" title="Duration" />
          <span className="text-white text-sm font-medium">
            {actualDuration ? formatDuration(actualDuration) : "..."}
          </span>
        </div>
        <div className="flex items-center gap-2.5">
          <FontAwesomeIcon icon={faCalendarAlt} className="text-[var(--hextech-color-gold)]" title="Release Date" />
          <span className="text-white text-sm font-medium">{formatReleaseDate()}</span>
        </div>
        <div className="flex items-center gap-2.5">
          <FontAwesomeIcon icon={faUserAlt} className="text-[var(--hextech-color-gold)]" title="Role" />
          <span className="text-white text-sm font-medium">{roleToString(video.role)}</span>
        </div>
      </div>

      {/* Spacer to push playback controls to bottom */}
      <div className="flex-grow" />

      {/* Playback controls */}
      <div className="mt-5 border-t border-[var(--hextech-color-gold-dark)] pt-5">
        {/* Combined playback controls in a single line */}
        <div className="flex justify-between items-center w-full">
          {/* Playback speed buttons */}
          <div className="flex gap-0.5 p-2 bg-black/20 rounded">
            {[0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.5, 3].map((speed) => (
              <button
                key={speed}
                className={`text-xs py-2 rounded font-[Spiegel] font-medium w-10 flex justify-center items-center ${
                  playbackSpeed === speed
                    ? "bg-[var(--hextech-color-gold)] text-[var(--hextech-color-background-dark)]"
                    : "bg-[var(--hextech-color-background-dark)] text-[var(--hextech-color-gold-light)] hover:bg-[var(--hextech-color-background-medium)] border border-[var(--hextech-color-gold-dark)]"
                }`}
                onClick={() => onPlaybackRateChange(speed)}
              >
                {speed}x
              </button>
            ))}
          </div>

          {/* Autoplay and Next buttons */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5 mr-4">
              <span className="text-xs text-[var(--hextech-color-gold-light)]">Autoplay</span>
              <button
                className="text-lg flex items-center"
                onClick={onAutoplayToggle}
                title={autoplayEnabled ? "Disable autoplay" : "Enable autoplay"}
              >
                <FontAwesomeIcon
                  icon={autoplayEnabled ? faToggleOn : faToggleOff}
                  className={
                    autoplayEnabled ? "text-[var(--hextech-color-gold)]" : "text-[var(--hextech-color-gold-dark)]"
                  }
                />
              </button>
            </div>
            <button
              className="text-xs px-4 py-2 rounded bg-[var(--hextech-color-background-dark)] text-[var(--hextech-color-gold-light)] hover:bg-[var(--hextech-color-background-medium)] border border-[var(--hextech-color-gold-dark)] flex items-center gap-2 font-[Spiegel] font-medium"
              onClick={onPlayNext}
              disabled={currentQueueIndex >= queueLength - 1}
              title="Play next video"
            >
              <FontAwesomeIcon icon={faStepForward} />
              <span>Next</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
