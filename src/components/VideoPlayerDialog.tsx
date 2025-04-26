import React, { useEffect, useRef, useState, useMemo } from "react";
import ReactDOM from "react-dom";
import Hls from "hls.js";
import { Video } from "../model/Video";
import { Course } from "../model/Course";
import { VideoUtils } from "../utils/VideoUtils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faSpinner, faClock, faCalendarAlt, faUserAlt } from "@fortawesome/free-solid-svg-icons";
import "../styles/components/_button.css";
import "../styles/components/_modal.css";
import "../styles/components/_tag.css";
import "../styles/VideoPlayerDialog.css";

// Storage keys
const STORAGE_KEYS = {
  PLAYBACK_SPEED: "better-skill-capped-playback-speed",
  VIDEO_QUEUE: "better-skill-capped-video-queue",
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
  video,
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
  const [formattedCurrentTime, setFormattedCurrentTime] = useState<string>("0:00");

  // Video queue state
  const [videoQueue, setVideoQueue] = useState<Video[]>(() => {
    return storageUtils.getItem(STORAGE_KEYS.VIDEO_QUEUE, []);
  });
  const [currentQueueIndex, setCurrentQueueIndex] = useState(-1);

  // Playback speed state
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(() => {
    return storageUtils.getItem(STORAGE_KEYS.PLAYBACK_SPEED, 1);
  });

  // Filter queue for current course
  const displayQueue = useMemo(() => {
    if (course && course.videos) {
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

  // Format duration for display
  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    } else {
      return `${minutes}:${secs.toString().padStart(2, "0")}`;
    }
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
    if (!newQueue.some((v) => v.uuid === videoToAdd.uuid)) {
      newQueue.push(videoToAdd);
      setVideoQueue(newQueue);
      storageUtils.setItem(STORAGE_KEYS.VIDEO_QUEUE, newQueue);
    }
  };

  const removeFromQueue = (index: number) => {
    if (course) return;

    const videoToRemove = displayQueue[index];
    if (!videoToRemove) return;

    const mainQueueIndex = videoQueue.findIndex((v) => v.uuid === videoToRemove.uuid);
    if (mainQueueIndex === -1) return;

    const newQueue = [...videoQueue];
    newQueue.splice(mainQueueIndex, 1);
    setVideoQueue(newQueue);
    storageUtils.setItem(STORAGE_KEYS.VIDEO_QUEUE, newQueue);

    if (index === currentQueueIndex && displayQueue.length > 0) {
      if (index < displayQueue.length) {
        playQueueItem(index);
      } else {
        playQueueItem(displayQueue.length - 1);
      }
    } else if (index < currentQueueIndex) {
      setCurrentQueueIndex(currentQueueIndex - 1);
    }
  };

  const playQueueItem = (index: number) => {
    if (index >= 0 && index < displayQueue.length) {
      setCurrentQueueIndex(index);
      const videoToPlay = displayQueue[index];

      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }

      setIsLoading(true);
      setErrorMessage(null);
      setActualDuration(videoToPlay.durationInSeconds || null);

      setupStreamForVideo(videoToPlay);
    }
  };

  const playNextInQueue = () => {
    if (currentQueueIndex >= 0 && currentQueueIndex < displayQueue.length - 1) {
      playQueueItem(currentQueueIndex + 1);
    }
  };

  const playPreviousInQueue = () => {
    if (currentQueueIndex > 0) {
      playQueueItem(currentQueueIndex - 1);
    }
  };

  // Handle video ended to autoplay next
  const handleVideoEnded = () => {
    if (currentQueueIndex >= 0 && currentQueueIndex < displayQueue.length - 1) {
      playNextInQueue();
    }
  };

  // Setup stream for a specific video
  const setupStreamForVideo = async (videoToPlay: Video) => {
    if (!videoRef.current) return;

    try {
      setIsLoading(true);
      setErrorMessage(null);
      setStatus("Preparing stream...");

      const videoId = videoToPlay.uuid;

      if (videoToPlay.durationInSeconds) {
        setActualDuration(videoToPlay.durationInSeconds);
      }

      const lastPart = await VideoUtils.findLastPart(videoId, setStatus);

      if (lastPart === 0) {
        setErrorMessage("Could not prepare video stream");
        setIsLoading(false);
        return;
      }

      const calculatedDuration = videoToPlay.durationInSeconds || lastPart * 10;
      setActualDuration(calculatedDuration);

      if (videoRef.current) {
        videoRef.current.dataset.actualDuration = formatDuration(calculatedDuration);
        videoRef.current.dataset.fixedDuration = "true";
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
        hls.loadSource("data:application/x-mpegURL;base64," + btoa(m3u8Data));
        hls.attachMedia(videoRef.current);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          if (videoRef.current) {
            // Set video duration
            if (calculatedDuration) {
              videoRef.current.dataset.actualDuration = formatDuration(calculatedDuration);
              Object.defineProperty(videoRef.current, "duration", {
                configurable: true,
                get: function () {
                  return calculatedDuration;
                },
              });
            }

            // Apply playback speed
            videoRef.current.playbackRate = playbackSpeed;

            // Try to play the video
            const playPromise = videoRef.current.play();

            if (playPromise !== undefined) {
              playPromise.catch((err) => {
                console.warn("Initial autoplay was prevented:", err);
                setStatus("Autoplay blocked. Trying with muted audio...");

                if (videoRef.current) {
                  videoRef.current.muted = true;
                  videoRef.current.play().catch((muteErr) => {
                    console.error("Muted autoplay also failed:", muteErr);
                    setStatus("Autoplay blocked. Press play to start video.");
                  });
                }
              });
            }
          }
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

        // Clear errors when video loads successfully
        hls.on(Hls.Events.FRAG_LOADED, () => {
          setErrorMessage(null);
        });
      } else if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
        // For Safari with native HLS support
        const dataUrl = "data:application/x-mpegURL;base64," + btoa(m3u8Data);
        videoRef.current.src = dataUrl;

        videoRef.current.addEventListener("loadedmetadata", () => {
          if (calculatedDuration && videoRef.current) {
            videoRef.current.dataset.actualDuration = formatDuration(calculatedDuration);
            Object.defineProperty(videoRef.current, "duration", {
              configurable: true,
              get: function () {
                return calculatedDuration;
              },
            });
          }

          if (videoRef.current) {
            videoRef.current.playbackRate = playbackSpeed;
            const playPromise = videoRef.current.play();
            if (playPromise !== undefined) {
              playPromise.catch(() => {
                setStatus("Autoplay blocked in Safari. Trying with muted audio...");
                if (videoRef.current) {
                  videoRef.current.muted = true;
                  videoRef.current.play().catch(() => {
                    setStatus("Autoplay blocked. Press play to start video.");
                  });
                }
              });
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

  // Add video to queue when opened
  useEffect(() => {
    if (isOpen && video) {
      if (!course && !videoQueue.some((v) => v.uuid === video.uuid)) {
        addToQueue(video);
      }

      const index = displayQueue.findIndex((v) => v.uuid === video.uuid);
      if (index !== -1) {
        setCurrentQueueIndex(index);
      }
    }
  }, [isOpen, video, videoQueue.length, displayQueue, course]);

  // Play video when dialog opens and handle keyboard shortcuts
  useEffect(() => {
    if (isOpen && video) {
      setupStreamForVideo(video);
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      } else if (event.key === "ArrowRight" && event.altKey) {
        playNextInQueue();
      } else if (event.key === "ArrowLeft" && event.altKey) {
        playPreviousInQueue();
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
  }, [isOpen, video, onClose]);

  // Apply playback speed after video loads
  useEffect(() => {
    if (videoRef.current) {
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
        if (videoRef.current) {
          videoRef.current.removeEventListener("loadedmetadata", applyPlaybackSpeed);
          videoRef.current.removeEventListener("canplay", applyPlaybackSpeed);
          videoRef.current.removeEventListener("playing", applyPlaybackSpeed);
        }
      };
    }
  }, [videoRef.current, playbackSpeed]);

  // Update time display
  useEffect(() => {
    if (!videoRef.current || !actualDuration) return;

    const videoElement = videoRef.current;

    const updateTimeDisplay = () => {
      const currentTime = videoElement.currentTime || 0;
      setFormattedCurrentTime(formatDuration(currentTime));

      videoElement.dataset.actualDuration = formatDuration(actualDuration);
      videoElement.dataset.currentTime = formatDuration(currentTime);
    };

    // Set duration property
    Object.defineProperty(videoElement, "duration", {
      configurable: true,
      get: function () {
        return actualDuration;
      },
    });

    // Apply styles for duration display
    const styleEl = document.createElement("style");
    styleEl.textContent = `
      .playback-speed-controls {
        position: absolute;
        bottom: 50px;
        right: 20px;
     
        border-radius: 8px;
        padding: 6px;
        display: flex;
        gap: 5px;
        z-index: 100;
        opacity: 0.9;
        transition: opacity 0.3s ease;
      }
      
      video::-webkit-media-controls-current-time-display,
      video::-webkit-media-controls-time-remaining-display {
        visibility: visible !important;
        opacity: 1 !important;
        display: inline-block !important;
      }
      
      video::-webkit-media-controls-time-remaining-display::after {
        content: "${formatDuration(actualDuration)}" !important;
      }
      
      video::-webkit-media-controls,
      video::-webkit-media-controls-enclosure,
      video::-webkit-media-controls-panel {
        background-color: transparent !important;
      }
    `;
    document.head.appendChild(styleEl);

    // Trigger duration change event
    setTimeout(() => {
      updateTimeDisplay();
      const durationEvent = new Event("durationchange");
      videoElement.dispatchEvent(durationEvent);
    }, 100);

    // Update time display on relevant events
    videoElement.addEventListener("timeupdate", updateTimeDisplay);
    videoElement.addEventListener("loadedmetadata", updateTimeDisplay);
    videoElement.addEventListener("durationchange", updateTimeDisplay);
    videoElement.addEventListener("playing", updateTimeDisplay);

    return () => {
      videoElement.removeEventListener("timeupdate", updateTimeDisplay);
      videoElement.removeEventListener("loadedmetadata", updateTimeDisplay);
      videoElement.removeEventListener("durationchange", updateTimeDisplay);
      videoElement.removeEventListener("playing", updateTimeDisplay);

      if (videoElement._durationObserver) {
        videoElement._durationObserver.disconnect();
        delete videoElement._durationObserver;
      }

      document.head.removeChild(styleEl);
    };
  }, [videoRef.current, actualDuration]);

  // Find video index in course videos
  const getVideoIndex = (): number | undefined => {
    if (!course || !course.videos) return undefined;
    const index = course.videos.findIndex((cv) => cv.video.uuid === video.uuid);
    return index !== -1 ? index + 1 : undefined;
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
  let modalRoot = document.getElementById("modal-root");
  useEffect(() => {
    if (!document.getElementById("modal-root")) {
      const div = document.createElement("div");
      div.id = "modal-root";
      document.body.appendChild(div);
      modalRoot = div;
    }
  }, []);

  if (!isOpen) return null;

  const currentModalRoot = document.getElementById("modal-root");
  if (!currentModalRoot) return null;

  // Render dialog through portal
  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black/95 flex justify-center items-center z-[1000]" onClick={handleBackdropClick}>
      <div
        className="bg-[var(--hextech-color-background-medium)] w-full h-full flex flex-row overflow-hidden"
        onClick={stopPropagation}
      >
        {/* Left panel - Video and info */}
        <div className="w-7/10 h-full flex flex-col border-r border-[var(--hextech-color-gold-dark)] flex-1">
          {/* Video player area */}
          <div>
            {isLoading && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/70 text-white p-3 rounded flex items-center gap-2 z-2">
                <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                <span>{status}</span>
              </div>
            )}
            {errorMessage && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/90 text-white p-4 rounded-lg z-3 text-center w-4/5 max-w-md border border-red-600">
                <h3 className="text-lg font-bold mb-2">Error loading video</h3>
                <p>{errorMessage}</p>
              </div>
            )}
            <video
              ref={videoRef}
              className="w-full h-full object-contain lol-hextech-player"
              controls
              autoPlay
              playsInline
              onEnded={handleVideoEnded}
            />
          </div>

          {/* Video info area */}
          <div className="bg-[var(--hextech-color-background-dark)] p-4 border-t border-[var(--hextech-color-gold-dark)]">
            {/* Video title */}
            <h2 className="m-0 text-lg text-[var(--hextech-color-gold-light)] flex flex-wrap items-center gap-2.5 mb-3">
              {getVideoIndex() && (
                <span className="text-[var(--hextech-color-gold-medium)] font-normal bg-black/30 py-0.5 px-1.5 rounded">
                  #{getVideoIndex()}
                </span>
              )}
              {getVideoIndex() && <span className="text-[var(--hextech-color-gold-dark)]">|</span>}
              <span className="font-bold flex-grow">{video.title}</span>
              <div className="flex gap-1">
                {[0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.5, 3].map((speed) => (
                  <button
                    key={speed}
                    className={`text-xs px-2 py-0.5 rounded ${
                      playbackSpeed === speed ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-200 hover:bg-gray-600"
                    }`}
                    onClick={() => changePlaybackSpeed(speed)}
                  >
                    {speed}x
                  </button>
                ))}
              </div>
            </h2>

            {/* Video metadata */}
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faClock} className="text-[var(--hextech-color-gold)] mr-2" />
                <span className="text-gray-400 text-sm">Duration:</span>
                <span className="text-white text-sm font-medium">
                  {actualDuration ? formatDuration(actualDuration) : "..."}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faCalendarAlt} className="text-[var(--hextech-color-gold)] mr-2" />
                <span className="text-gray-400 text-sm">Released:</span>
                <span className="text-white text-sm font-medium">{video.releaseDate.toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faUserAlt} className="text-[var(--hextech-color-gold)] mr-2" />
                <span className="text-gray-400 text-sm">Role:</span>
                <span className="text-white text-sm font-medium">{video.role}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right panel - Course info and list */}
        <div className="w-3/10 h-full flex flex-col overflow-hidden">
          {/* Right panel header */}
          <div className="flex justify-between items-center p-3 bg-[var(--hextech-color-background-dark)] border-b border-[var(--hextech-color-gold-dark)]">
            <h2 className="m-0 text-[var(--hextech-color-gold-light)] text-lg font-semibold flex justify-between w-full items-center">
              {course && (
                <span className="text-[var(--hextech-color-gold-medium)] opacity-80 truncate">{course.title}</span>
              )}
              <button
                className="bg-transparent border-none text-[var(--hextech-color-gold-medium)] text-2xl cursor-pointer p-0 px-2 hover:text-[var(--hextech-color-gold-light)]"
                onClick={onClose}
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </h2>
          </div>

          {/* Course description */}
          {course && course.description && (
            <div className="p-3 border-b border-[var(--hextech-color-gold-dark)] bg-[var(--hextech-color-background-dark)]">
              <div className="text-[var(--hextech-color-gold-light)] text-sm">{course.description}</div>
            </div>
          )}

          {/* Video list */}
          <div className="flex-1 overflow-y-auto bg-[rgba(16,31,45,0.9)]">
            <div className="overflow-y-auto">
              {displayQueue.map((queueVideo, index) => (
                <div
                  key={queueVideo.uuid}
                  className={`flex items-center p-3 cursor-pointer transition-colors mb-1 hover:bg-[var(--hextech-color-background-medium)] ${
                    queueVideo.uuid === video.uuid
                      ? "bg-[var(--hextech-color-background-light)] border-l-2 border-l-[var(--hextech-color-blue-medium)]"
                      : ""
                  }`}
                  onClick={() => playQueueItem(index)}
                >
                  <div className="flex items-center justify-center min-w-6 h-6 bg-[var(--hextech-color-background-medium)] rounded-full mr-2 text-[var(--hextech-color-gold-medium)] text-xs font-medium">
                    {index + 1}
                  </div>
                  <div className="flex-1 text-[var(--hextech-color-gold-light)] text-xs whitespace-nowrap overflow-hidden text-ellipsis mr-2">
                    {queueVideo.title}
                  </div>
                  <div className="text-[var(--hextech-color-gold-medium)] text-xs p-0 px-1.5 bg-black/30 rounded-sm whitespace-nowrap">
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
