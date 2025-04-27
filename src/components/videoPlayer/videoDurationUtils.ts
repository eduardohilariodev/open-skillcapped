// Utility function to patch video duration
export const patchVideoDuration = (videoElement: HTMLVideoElement, actualDuration: number) => {
  // Only apply if the browser's native duration is significantly different
  // Create a proxy for the duration property
  const durationDescriptor = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, "duration");
  if (durationDescriptor?.get) {
    const originalGetter = durationDescriptor.get;

    // Monkey patch the duration getter
    Object.defineProperty(videoElement, "duration", {
      configurable: true,
      get() {
        return actualDuration;
      },
    });

    // Set data attributes for UI
    videoElement.dataset.actualDuration = String(actualDuration);

    // Ensure the video element's seekable time ranges include our duration
    // This helps the browser's native seek bar correctly represent the duration
    const originalSeekable = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, "seekable");
    if (originalSeekable?.get) {
      Object.defineProperty(videoElement, "seekable", {
        configurable: true,
        get() {
          const original = originalSeekable.get.call(this);
          // Only override if we need to extend the range
          if (original.length > 0) {
            const lastRange = original.length - 1;
            const end = original.end(lastRange);
            if (end < actualDuration) {
              // Create a TimeRanges-like object with our extended range
              return {
                length: original.length,
                start: (index: number) => (index === lastRange ? original.start(lastRange) : original.start(index)),
                end: (index: number) => (index === lastRange ? actualDuration : original.end(index)),
              };
            }
          }
          return original;
        },
      });
    }

    // Also handle the timeupdate event to prevent seeking past our real end
    const handleTimeUpdate = () => {
      if (videoElement.currentTime > actualDuration) {
        videoElement.currentTime = actualDuration;
      }
    };

    videoElement.addEventListener("timeupdate", handleTimeUpdate);

    // Return cleanup function to restore original behavior
    return () => {
      Object.defineProperty(videoElement, "duration", {
        configurable: true,
        get: originalGetter,
      });

      if (originalSeekable?.get) {
        Object.defineProperty(videoElement, "seekable", {
          configurable: true,
          get: originalSeekable.get,
        });
      }

      videoElement.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }
  return () => {}; // Return no-op cleanup if we didn't patch
};

// Format duration for display
export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  return hours > 0
    ? `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    : `${minutes}:${secs.toString().padStart(2, "0")}`;
};
