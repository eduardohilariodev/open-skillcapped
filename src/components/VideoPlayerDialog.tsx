import React, { useEffect, useRef, useState, useMemo } from "react";
import ReactDOM from "react-dom";
import Hls from "hls.js";
import { Video } from "../model/Video";
import { Course } from "../model/Course";
import { VideoUtils } from "../utils/VideoUtils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faSpinner,
  faClock,
  faCalendarAlt,
  faUserAlt,
  faStepForward,
  faToggleOn,
  faToggleOff,
} from "@fortawesome/free-solid-svg-icons";
import { roleToString } from "../model/Role";
import "../styles/components/_button.css";
import "../styles/components/_modal.css";
import "../styles/components/_tag.css";
import "../styles/VideoPlayerDialog.css";

// Utility function to patch video duration
const patchVideoDuration = (videoElement: HTMLVideoElement, actualDuration: number) => {
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
      videoElement.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }
  return () => {}; // Return no-op cleanup if we didn't patch
};

// Storage keys
const STORAGE_KEYS = {
  PLAYBACK_SPEED: "better-skill-capped-playback-speed",
  VIDEO_QUEUE: "better-skill-capped-video-queue",
  AUTOPLAY_ENABLED: "better-skill-capped-autoplay-enabled",
};

// Local storage utilities
const storageUtils = {
  getItem: (key: string, defaultValue: any) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error getting item from localStorage: ${error}`);
      return defaultValue;
    }
  },

  setItem: (key: string, value: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error setting item in localStorage: ${error}`);
      return false;
    }
  },
};

// Extend HTMLVideoElement type
declare global {
  interface HTMLVideoElement {
    _durationObserver?: MutationObserver;
  }
}

interface VideoPlayerDialogProps {
  video: Video;
  course?: Course;
  isOpen: boolean;
  onClose: () => void;
}

export function VideoPlayerDialog({
  video: initialVideo,
  course,
  isOpen,
  onClose,
}: VideoPlayerDialogProps): React.ReactElement | null {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [actualDuration, setActualDuration] = useState<number | null>(null);
  const [currentVideo, setCurrentVideo] = useState<Video>(initialVideo);
  const [isBuffering, setIsBuffering] = useState(false);

  // Video queue state
  const [videoQueue, setVideoQueue] = useState<Video[]>(() => storageUtils.getItem(STORAGE_KEYS.VIDEO_QUEUE, []));
  const [currentQueueIndex, setCurrentQueueIndex] = useState(-1);

  // Autoplay setting
  const [autoplayEnabled, setAutoplayEnabled] = useState<boolean>(() =>
    storageUtils.getItem(STORAGE_KEYS.AUTOPLAY_ENABLED, true),
  );

  // Playback speed state
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(() =>
    storageUtils.getItem(STORAGE_KEYS.PLAYBACK_SPEED, 1),
  );

  // Filter queue for current course
  const displayQueue = useMemo(() => {
    if (course?.videos) {
      return course.videos.map((cv) => cv.video);
    }
    return videoQueue;
  }, [course, videoQueue]);

  // Initialize VideoUtils error silencer
  useEffect(() => {
    if (isOpen) {
      VideoUtils.silenceCORSErrors();
    }
  }, [isOpen]);

  // Apply playback speed when it changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackSpeed;
    }
    storageUtils.setItem(STORAGE_KEYS.PLAYBACK_SPEED, playbackSpeed);
  }, [playbackSpeed]);

  // Listen for playback speed changes in the video element
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const handleRateChange = () => {
      const currentRate = videoElement.playbackRate;
      if (currentRate !== playbackSpeed) {
        setPlaybackSpeed(currentRate);
      }
    };

    videoElement.addEventListener("ratechange", handleRateChange);

    return () => {
      videoElement.removeEventListener("ratechange", handleRateChange);
    };
  }, [videoRef.current, playbackSpeed]);

  // Format duration for display
  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    return hours > 0
      ? `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
      : `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  // Handle speed change
  const changePlaybackSpeed = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
    storageUtils.setItem(STORAGE_KEYS.PLAYBACK_SPEED, speed);
  };

  // Queue management
  const addToQueue = (videoToAdd: Video) => {
    const newQueue = [...videoQueue];
    if (newQueue.some((v) => v.uuid === videoToAdd.uuid)) {
      return;
    }
    newQueue.push(videoToAdd);
    setVideoQueue(newQueue);
    storageUtils.setItem(STORAGE_KEYS.VIDEO_QUEUE, newQueue);
  };

  const playQueueItem = async (index: number) => {
    if (!(index >= 0 && index < displayQueue.length)) {
      return;
    }
    setCurrentQueueIndex(index);
    const videoToPlay = displayQueue[index];
    setCurrentVideo(videoToPlay);

    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setActualDuration(videoToPlay.durationInSeconds || null);

    await setupStreamForVideo(videoToPlay);
  };

  const playNextInQueue = async () => {
    if (currentQueueIndex >= 0 && currentQueueIndex < displayQueue.length - 1) {
      await playQueueItem(currentQueueIndex + 1);
    }
  };

  const playPreviousInQueue = async () => {
    if (currentQueueIndex > 0) {
      await playQueueItem(currentQueueIndex - 1);
    }
  };

  // Toggle autoplay
  const toggleAutoplay = () => {
    const newValue = !autoplayEnabled;
    setAutoplayEnabled(newValue);
    storageUtils.setItem(STORAGE_KEYS.AUTOPLAY_ENABLED, newValue);
  };

  // Setup stream for a specific video
  const setupStreamForVideo = async (videoToPlay: Video) => {
    if (!videoRef.current) return;

    try {
      setIsLoading(true);
      setErrorMessage(null);
      setStatus("Preparing stream...");

      const videoId = videoToPlay.uuid;

      // Get exact duration from video metadata
      const exactDuration = videoToPlay.durationInSeconds;
      if (exactDuration) {
        setActualDuration(exactDuration);
      }

      const lastPart = await VideoUtils.findLastPart(videoId, setStatus);

      if (lastPart === 0) {
        setErrorMessage("Could not prepare video stream");
        setIsLoading(false);
        return;
      }

      setActualDuration(exactDuration);

      // Store the expected duration for reference - will be used if HLS doesn't provide a valid one
      if (videoRef.current) {
        videoRef.current.dataset.expectedDuration = formatDuration(exactDuration);
      }

      // Generate M3U8 data
      const m3u8Data = VideoUtils.generateM3U8(videoId, lastPart);

      // Clean up previous HLS instance
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }

      if (Hls.isSupported()) {
        const hls = new Hls({
          maxBufferSize: 0,
          maxBufferLength: 30,
          startPosition: 0,
          maxMaxBufferLength: 60,
          maxBufferHole: 0.5,
          lowLatencyMode: false,
        });

        hlsRef.current = hls;

        // Load M3U8 content directly with Base64 encoding
        hls.loadSource(`data:application/x-mpegURL;base64,${btoa(m3u8Data)}`);
        hls.attachMedia(videoRef.current);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          if (!videoRef.current) {
            return;
          }

          if (exactDuration) {
            setActualDuration(exactDuration);

            // Apply our duration patch
            patchVideoDuration(videoRef.current, exactDuration);
          }

          // Apply playback speed
          videoRef.current.playbackRate = playbackSpeed;
          setStatus("Video ready. Click play to start.");
        });

        // Check again when fragments load
        hls.on(Hls.Events.FRAG_LOADED, () => {
          // Re-check duration if needed
          if (!videoRef.current) {
            return;
          }
          const videoDuration = videoRef.current.duration;

          if (videoDuration && isFinite(videoDuration)) {
            setActualDuration(videoDuration);
            videoRef.current.dataset.actualDuration = formatDuration(videoDuration);
          } else if (actualDuration && isFinite(actualDuration)) {
            // If video duration is still invalid but we have actualDuration, try to set directly
            try {
              Object.defineProperty(videoRef.current, "duration", {
                value: actualDuration,
                writable: false,
              });
              videoRef.current.dataset.actualDuration = formatDuration(actualDuration);
            } catch {
              // Silent fail - property might be non-configurable
            }
          }

          // Clear errors when video loads successfully
          setErrorMessage(null);
        });

        // Error handling
        hls.on(Hls.Events.ERROR, (_event: unknown, data: any) => {
          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                hls.startLoad();
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                hls.recoverMediaError();
                break;
              default:
                if (hlsRef.current) {
                  hlsRef.current.destroy();
                  hlsRef.current = null;
                }
                break;
            }
          }
        });
      } else if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
        // For Safari with native HLS support
        const dataUrl = `data:application/x-mpegURL;base64,${btoa(m3u8Data)}`;
        videoRef.current.src = dataUrl;

        videoRef.current.addEventListener("loadedmetadata", () => {
          if (!videoRef.current) {
            return;
          }
          // Check for native duration first
          const nativeDuration = videoRef.current.duration;
          if (nativeDuration && isFinite(nativeDuration)) {
            setActualDuration(nativeDuration);
            videoRef.current.dataset.actualDuration = formatDuration(nativeDuration);
          } else if (exactDuration) {
            // Fallback to our estimate
            setActualDuration(exactDuration);
            videoRef.current.dataset.actualDuration = formatDuration(exactDuration);

            // Try to directly set duration on video element for seek bar
            try {
              Object.defineProperty(videoRef.current, "duration", {
                value: exactDuration,
                writable: false,
              });
            } catch (e) {
              console.warn("Could not set duration property directly:", e);
            }
          }

          videoRef.current.playbackRate = playbackSpeed;
          setStatus("Video ready. Click play to start.");
        });

        // Also check duration when more data is loaded
        videoRef.current.addEventListener("canplay", () => {
          if (videoRef.current) {
            const nativeDuration = videoRef.current.duration;
            if (nativeDuration && isFinite(nativeDuration)) {
              setActualDuration(nativeDuration);
              videoRef.current.dataset.actualDuration = formatDuration(nativeDuration);
            }
          }
        });
      }

      setStatus("");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unknown error occurred");
      console.error("Stream setup error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Update current video when initial video changes
  useEffect(() => {
    setCurrentVideo(initialVideo);
  }, [initialVideo]);

  // Add video to queue when opened
  useEffect(() => {
    if (!(isOpen && initialVideo)) {
      return;
    }
    if (!course && !videoQueue.some((v) => v.uuid === initialVideo.uuid)) {
      addToQueue(initialVideo);
    }

    const index = displayQueue.findIndex((v) => v.uuid === initialVideo.uuid);
    if (index !== -1) {
      setCurrentQueueIndex(index);
    }
  }, [isOpen, initialVideo, videoQueue.length, displayQueue, course]);

  // Play video when dialog opens and handle keyboard shortcuts
  useEffect(() => {
    if (!(isOpen && initialVideo)) {
      return;
    }

    // Define the async function inside useEffect
    const loadVideo = async () => {
      await setupStreamForVideo(initialVideo);
    };

    // Call the function and catch any errors
    loadVideo().catch(console.error);

    const handleKeyDown = async (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      } else if (event.key === "ArrowRight" && event.altKey) {
        await playNextInQueue();
      } else if (event.key === "ArrowLeft" && event.altKey) {
        await playPreviousInQueue();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [isOpen, initialVideo, onClose]);

  // Apply duration patch when actualDuration is available
  useEffect(() => {
    if (!videoRef.current || !actualDuration) return;

    return patchVideoDuration(videoRef.current, actualDuration);
  }, [videoRef.current, actualDuration]);

  // Apply playback speed after video loads
  useEffect(() => {
    if (!videoRef.current) {
      return;
    }
    const applyPlaybackSpeed = () => {
      if (videoRef.current) {
        videoRef.current.playbackRate = playbackSpeed;
      }
    };

    applyPlaybackSpeed();

    videoRef.current.addEventListener("loadedmetadata", applyPlaybackSpeed);
    videoRef.current.addEventListener("canplay", applyPlaybackSpeed);
    videoRef.current.addEventListener("playing", applyPlaybackSpeed);

    return () => {
      if (!videoRef.current) {
        return;
      }
      videoRef.current.removeEventListener("loadedmetadata", applyPlaybackSpeed);
      videoRef.current.removeEventListener("canplay", applyPlaybackSpeed);
      videoRef.current.removeEventListener("playing", applyPlaybackSpeed);
    };
  }, [playbackSpeed]);

  // Update time display
  useEffect(() => {
    if (!videoRef.current) return;

    const videoElement = videoRef.current;

    const updateTimeDisplay = () => {
      const currentTime = videoElement.currentTime || 0;

      // Get current duration from video element or fall back to state
      const videoDuration = videoElement.duration;
      const duration = videoDuration && isFinite(videoDuration) ? videoDuration : actualDuration;

      // Update actualDuration state if video element has a valid duration that differs from state
      if (videoDuration && isFinite(videoDuration) && videoDuration !== actualDuration) {
        setActualDuration(videoDuration);
      }
      // If video duration is invalid but we have actualDuration in state, try to set directly
      else if ((!videoDuration || !isFinite(videoDuration)) && actualDuration && isFinite(actualDuration)) {
        try {
          Object.defineProperty(videoElement, "duration", {
            value: actualDuration,
            writable: false,
          });
        } catch (e) {
          // Silent fail - property might be non-configurable
        }
      }

      // Prevent seeking past the end if we have a valid duration
      if (duration && currentTime > duration) {
        videoElement.currentTime = duration;
      }

      // Update dataset for UI display
      if (duration) {
        videoElement.dataset.actualDuration = formatDuration(duration);
      }
      videoElement.dataset.currentTime = formatDuration(currentTime);
    };

    // Handle timeupdate to update display and prevent overrun
    const handleTimeUpdate = () => {
      updateTimeDisplay();
    };

    // Prevent seeking beyond the actual duration
    const preventExcessiveSeeking = (e: Event) => {
      const target = e.target as HTMLVideoElement;
      const videoDuration = target.duration;
      const effectiveDuration = videoDuration && isFinite(videoDuration) ? videoDuration : actualDuration || 0;

      if (target.currentTime > effectiveDuration) {
        target.currentTime = effectiveDuration;
      }
    };

    // Add event listeners
    videoElement.addEventListener("timeupdate", handleTimeUpdate);
    videoElement.addEventListener("seeking", preventExcessiveSeeking);
    videoElement.addEventListener("seeked", preventExcessiveSeeking);
    videoElement.addEventListener("loadedmetadata", updateTimeDisplay);
    videoElement.addEventListener("durationchange", updateTimeDisplay);
    videoElement.addEventListener("playing", updateTimeDisplay);

    // Add event listener for playback rate
    const handlePlaybackRateChange = () => {
      if (videoRef.current) {
        videoRef.current.playbackRate = playbackSpeed;
      }
    };
    videoElement.addEventListener("canplay", handlePlaybackRateChange);

    return () => {
      // Remove all event listeners
      videoElement.removeEventListener("timeupdate", handleTimeUpdate);
      videoElement.removeEventListener("seeking", preventExcessiveSeeking);
      videoElement.removeEventListener("seeked", preventExcessiveSeeking);
      videoElement.removeEventListener("loadedmetadata", updateTimeDisplay);
      videoElement.removeEventListener("durationchange", updateTimeDisplay);
      videoElement.removeEventListener("playing", updateTimeDisplay);
      videoElement.removeEventListener("canplay", handlePlaybackRateChange);

      // Remove any mutation observers
      if (videoRef.current?._durationObserver) {
        videoRef.current._durationObserver.disconnect();
        delete videoRef.current._durationObserver;
      }
    };
  }, [actualDuration, playbackSpeed, formatDuration]);

  // Handle buffering state
  useEffect(() => {
    if (!videoRef.current) return;

    const handleWaiting = () => setIsBuffering(true);
    const handlePlaying = () => setIsBuffering(false);
    const handleCanPlay = () => setIsBuffering(false);
    const handleRateChange = () => {
      if (videoRef.current && videoRef.current.playbackRate !== playbackSpeed) {
        setPlaybackSpeed(videoRef.current.playbackRate);
      }
    };

    // Handle video ended inline to avoid dependency issues
    const handleEndedEvent = async () => {
      if (autoplayEnabled) {
        // Check if we're in a course or in the queue
        if (course?.videos) {
          const currentIndex = course.videos.findIndex((cv) => cv.video.uuid === currentVideo.uuid);
          if (currentIndex !== -1 && currentIndex < course.videos.length - 1) {
            // Play the next video in the course
            await playQueueItem(currentIndex + 1);
          }
        } else if (displayQueue.length > 0) {
          // Handle general queue
          const queueIndex =
            currentQueueIndex >= 0 ? currentQueueIndex : displayQueue.findIndex((v) => v.uuid === currentVideo.uuid);
          if (queueIndex !== -1 && queueIndex < displayQueue.length - 1) {
            await playQueueItem(queueIndex + 1);
          }
        }
      }
    };

    videoRef.current.addEventListener("waiting", handleWaiting);
    videoRef.current.addEventListener("playing", handlePlaying);
    videoRef.current.addEventListener("canplay", handleCanPlay);
    videoRef.current.addEventListener("ratechange", handleRateChange);
    videoRef.current.addEventListener("ended", handleEndedEvent);

    return () => {
      if (!videoRef.current) {
        return;
      }
      videoRef.current.removeEventListener("waiting", handleWaiting);
      videoRef.current.removeEventListener("playing", handlePlaying);
      videoRef.current.removeEventListener("canplay", handleCanPlay);
      videoRef.current.removeEventListener("ratechange", handleRateChange);
      videoRef.current.removeEventListener("ended", handleEndedEvent);
    };
  }, [playbackSpeed, autoplayEnabled, course, currentVideo, displayQueue, currentQueueIndex, playQueueItem]);

  // Find video index in course videos
  const getVideoIndex = (): number | undefined => {
    if (!course || !course.videos) return undefined;
    const index = course.videos.findIndex((cv) => cv.video.uuid === currentVideo.uuid);
    return index === -1 ? undefined : index + 1;
  };

  // Handle backdrop clicks
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Stop event propagation
  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  // Create modal root if needed
  useEffect(() => {
    if (document.getElementById("modal-root")) {
      return;
    }
    const div = document.createElement("div");
    div.id = "modal-root";
    document.body.appendChild(div);
  }, []);

  if (!isOpen) return null;

  const currentModalRoot = document.getElementById("modal-root");
  if (!currentModalRoot) return null;

  // Render dialog through portal
  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black/95 flex justify-center items-center z-[1000]" onClick={handleBackdropClick}>
      <div
        className="bg-[var(--hextech-color-background-medium)] w-full h-full flex flex-row overflow-hidden border border-[var(--hextech-color-gold-dark)] font-[Spiegel]"
        onClick={stopPropagation}
      >
        {/* Left panel - Video and info */}
        <div className="w-7/10 h-full flex flex-col border-r-0 flex-1 bg-[var(--hextech-color-background-medium)] relative">
          {/* Video player area */}
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

          {/* Video info area */}
          <div className="bg-[var(--hextech-color-background-dark)] p-6 border-t border-[var(--hextech-color-gold-dark)] flex-1 flex flex-col relative">
            {/* Decorative top border */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--hextech-color-gold-dark)] via-[var(--hextech-color-gold)] to-[var(--hextech-color-gold-dark)]" />

            {/* Video title */}
            <h2 className="m-0 text-lg text-[var(--hextech-color-gold-light)] flex flex-wrap items-center gap-3 mb-4 font-[500] font-[Beaufort_for_LOL]">
              {getVideoIndex() && (
                <span className="text-[var(--hextech-color-gold-medium)] font-normal bg-black/30 py-0.5 px-2 rounded">
                  #{getVideoIndex()}
                </span>
              )}
              {getVideoIndex() && <span className="text-[var(--hextech-color-gold-dark)]">|</span>}
              <span className="font-[700] flex-grow">{currentVideo.title}</span>
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
                <FontAwesomeIcon
                  icon={faCalendarAlt}
                  className="text-[var(--hextech-color-gold)]"
                  title="Release Date"
                />
                <span className="text-white text-sm font-medium">{currentVideo.releaseDate.toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <FontAwesomeIcon icon={faUserAlt} className="text-[var(--hextech-color-gold)]" title="Role" />
                <span className="text-white text-sm font-medium">{roleToString(currentVideo.role)}</span>
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
                      onClick={() => changePlaybackSpeed(speed)}
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
                      onClick={toggleAutoplay}
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
                    onClick={playNextInQueue}
                    disabled={currentQueueIndex >= displayQueue.length - 1}
                    title="Play next video"
                  >
                    <FontAwesomeIcon icon={faStepForward} />
                    <span>Next</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right panel - Course info and list */}
        <div className="w-3/10 h-full flex flex-col overflow-hidden shadow-[-6px_0_16px_rgba(0,0,0,0.4)] bg-[var(--hextech-color-background-dark)] bg-gradient-to-b from-black/40 to-black/20 border-l border-[var(--hextech-color-gold-dark)] relative">
          {/* Decorative left border */}
          <div className="absolute top-0 left-0 w-0.5 h-full bg-gradient-to-b from-[var(--hextech-color-gold-dark)] via-[var(--hextech-color-gold)] to-[var(--hextech-color-gold-dark)] opacity-60" />

          {/* Right panel header */}
          <div className="flex justify-between items-center p-4 bg-[var(--hextech-color-background-dark)] border-b border-[var(--hextech-color-gold-dark)] relative overflow-hidden">
            {/* Decorative corners */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[var(--hextech-color-gold)]" />
            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[var(--hextech-color-gold)]" />

            <h2 className="m-0 text-[var(--hextech-color-gold-light)] text-lg font-[700] flex justify-between w-full items-center font-[Beaufort_for_LOL]">
              {course && <span className="text-[var(--hextech-color-gold)] opacity-90 truncate">{course.title}</span>}
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
          {course?.description && (
            <div className="p-4 border-b border-[var(--hextech-color-gold-dark)] bg-[var(--hextech-color-background-medium)]">
              <div className="text-[var(--hextech-color-gold-medium)] text-sm">{course.description}</div>
            </div>
          )}

          {/* Video list */}
          <div className="flex-1 overflow-y-auto bg-[var(--hextech-color-background-dark)] text-sm leading-snug text-[13px]">
            <div className="overflow-y-auto">
              {displayQueue.map((queueVideo, index) => (
                <div
                  key={queueVideo.uuid}
                  className={`flex items-center p-4 cursor-pointer transition-all duration-200 border-l-2 border-l-transparent hover:outline hover:outline-1 hover:outline-[rgba(201,172,98,0.15)] hover:outline-offset-[-1px] hover:shadow-[0_0_8px_rgba(201,172,98,0.05)] hover:border-l-2 hover:border-l-[rgba(201,172,98,0.3)] ${
                    queueVideo.uuid === currentVideo.uuid
                      ? "border-[var(--hextech-color-gold)] shadow-[0_0_12px_rgba(201,172,98,0.2)] outline outline-1 outline-[rgba(201,172,98,0.3)] outline-offset-[-4px] relative"
                      : ""
                  }`}
                  onClick={() => playQueueItem(index)}
                >
                  {queueVideo.uuid === currentVideo.uuid && (
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
                    {queueVideo.title}
                  </div>
                  <div className="text-[var(--hextech-color-gold-dark)] text-xs whitespace-nowrap">
                    {queueVideo.durationInSeconds ? formatDuration(queueVideo.durationInSeconds) : "..."}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>,
    currentModalRoot,
  );
}
