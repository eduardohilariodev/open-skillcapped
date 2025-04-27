import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { VideoPlayerProps } from "./types";

export function VideoPlayer({
  video,
  actualDuration,
  isLoading,
  isBuffering,
  status,
  errorMessage,
  playbackSpeed,
  videoRef,
  onPlaybackRateChange,
}: VideoPlayerProps): React.ReactElement {
  return (
    <div className="relative w-full h-3/5 bg-black">
      {isLoading && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/70 text-white p-3 rounded flex items-center gap-2 z-10">
          <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
          <span>{status}</span>
        </div>
      )}

      {errorMessage && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/90 text-white p-4 rounded-lg z-10 text-center w-4/5 max-w-md border border-red-600">
          <h3 className="text-lg font-bold mb-2">Error loading video</h3>
          <p>{errorMessage}</p>
        </div>
      )}

      {isBuffering && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/70 text-[var(--hextech-color-gold)] p-3 rounded z-10 border border-[var(--hextech-color-gold-dark)]">
          Loading...
        </div>
      )}

      <video ref={videoRef} className="absolute top-0 left-0 w-full h-full" controls playsInline />
    </div>
  );
}
