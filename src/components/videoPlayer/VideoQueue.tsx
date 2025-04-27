import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { VideoQueueProps } from "./types";
import { VideoQueueItem } from "./VideoQueueItem";

export function VideoQueue({
  title,
  description,
  videos,
  currentVideo,
  onClose,
  onVideoSelect,
  formatDuration,
}: VideoQueueProps): React.ReactElement {
  return (
    <div className="w-3/10 h-full flex flex-col overflow-hidden shadow-[-6px_0_16px_rgba(0,0,0,0.4)] bg-[var(--hextech-color-background-dark)] bg-gradient-to-b from-black/40 to-black/20 border-l border-[var(--hextech-color-gold-dark)] relative">
      {/* Decorative left border */}
      <div className="absolute top-0 left-0 w-0.5 h-full bg-gradient-to-b from-[var(--hextech-color-gold-dark)] via-[var(--hextech-color-gold)] to-[var(--hextech-color-gold-dark)] opacity-60" />

      {/* Right panel header */}
      <div className="flex justify-between items-center p-4 bg-[var(--hextech-color-background-dark)] border-b border-[var(--hextech-color-gold-dark)] relative overflow-hidden">
        {/* Decorative corners */}
        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[var(--hextech-color-gold)]" />
        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[var(--hextech-color-gold)]" />

        <h2 className="m-0 text-[var(--hextech-color-gold-light)] text-lg font-[700] flex justify-between w-full items-center font-[Beaufort_for_LOL]">
          {title && <span className="text-[var(--hextech-color-gold)] opacity-90 truncate">{title}</span>}
          <button
            className="w-9 h-9 flex items-center justify-center bg-transparent border border-[var(--hextech-color-gold-dark)] text-[var(--hextech-color-gold-medium)] hover:text-[var(--hextech-color-gold-light)] hover:border-[var(--hextech-color-gold)] hover:shadow-[0_0_8px_rgba(201,172,98,0.3)] ml-2.5 p-0 cursor-pointer relative"
            onClick={onClose}
            aria-label="Close"
          >
            {/* Button corner decorations */}
            <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-[var(--hextech-color-gold)]" />
            <div className="absolute top-0 right-0 w-1.5 h-1.5 border-t border-r border-[var(--hextech-color-gold)]" />
            <div className="absolute bottom-0 left-0 w-1.5 h-1.5 border-b border-l border-[var(--hextech-color-gold)]" />
            <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-[var(--hextech-color-gold)]" />
            <FontAwesomeIcon icon={faTimes} size="lg" className="text-lg" />
          </button>
        </h2>
      </div>

      {/* Course description */}
      {description && (
        <div className="p-4 border-b border-[var(--hextech-color-gold-dark)] bg-[var(--hextech-color-background-medium)]">
          <div className="text-[var(--hextech-color-gold-medium)] text-sm">{description}</div>
        </div>
      )}

      {/* Video list */}
      <div className="flex-1 overflow-y-auto bg-[var(--hextech-color-background-dark)] text-sm leading-snug text-[13px]">
        <div className="overflow-y-auto">
          {videos.map((queueVideo, index) => (
            <VideoQueueItem
              key={queueVideo.uuid}
              video={queueVideo}
              index={index}
              isActive={queueVideo.uuid === currentVideo.uuid}
              onClick={() => onVideoSelect(index)}
              formatDuration={formatDuration}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
