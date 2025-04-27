import React from "react";
import { VideoQueueItemProps } from "./types";

export function VideoQueueItem({
  video,
  index,
  isActive,
  onClick,
  formatDuration,
}: VideoQueueItemProps): React.ReactElement {
  return (
    <div
      className={`flex items-center p-4 cursor-pointer transition-all duration-200 border-l-2 border-l-transparent hover:outline hover:outline-1 hover:outline-[rgba(201,172,98,0.15)] hover:outline-offset-[-1px] hover:shadow-[0_0_8px_rgba(201,172,98,0.05)] hover:border-l-2 hover:border-l-[rgba(201,172,98,0.3)] ${
        isActive
          ? "border-[var(--hextech-color-gold)] shadow-[0_0_12px_rgba(201,172,98,0.2)] outline outline-1 outline-[rgba(201,172,98,0.3)] outline-offset-[-4px] relative"
          : ""
      }`}
      onClick={onClick}
    >
      {isActive && (
        <>
          {/* Corner decorations for selected item */}
          <div className="absolute top-[-2px] left-[-2px] w-2.5 h-2.5 border-t-2 border-l-2 border-[var(--hextech-color-gold)] z-10" />
          <div className="absolute top-[-2px] right-[-2px] w-2.5 h-2.5 border-t-2 border-r-2 border-[var(--hextech-color-gold)] z-10" />
          <div className="absolute bottom-[-2px] left-[-2px] w-2.5 h-2.5 border-b-2 border-l-2 border-[var(--hextech-color-gold)] z-10" />
          <div className="absolute bottom-[-2px] right-[-2px] w-2.5 h-2.5 border-b-2 border-r-2 border-[var(--hextech-color-gold)] z-10" />
        </>
      )}
      <div className="flex items-center justify-center w-7 h-7 mr-3 border border-[var(--hextech-color-gold-dark)] font-[Beaufort_for_LOL] font-bold text-[15px] text-[var(--hextech-color-gold)] bg-gradient-to-br from-black/70 to-[#141414]/40 shadow-[0_0_3px_rgba(201,172,98,0.5)] tracking-[0.5px] leading-none pb-[1px] flex items-center justify-center">
        {index + 1}
      </div>
      <div className="flex-1 text-[var(--hextech-color-gold-light)] text-xs whitespace-nowrap overflow-hidden text-ellipsis mr-3 font-[500]">
        {video.title}
      </div>
      <div className="text-[var(--hextech-color-gold-dark)] text-xs whitespace-nowrap">
        {video.durationInSeconds ? formatDuration(video.durationInSeconds) : "..."}
      </div>
    </div>
  );
}
