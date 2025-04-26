import React, { useEffect, useRef, useState, useMemo } from "react";
import ReactDOM from "react-dom";
import Hls from "hls.js";
import { Video } from "../model/Video";
import { Course } from "../model/Course";
import { VideoUtils } from "../utils/VideoUtils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStepForward,
  faStepBackward,
  faTimes,
  faTrash,
  faSpinner,
  faClock,
  faCalendarAlt,
  faUserAlt,
  faListAlt,
  faTachometerAlt,
} from "@fortawesome/free-solid-svg-icons";
import "../styles/components/_button.css";
import "../styles/components/_modal.css";
import "../styles/components/_tag.css";
import "../styles/Episode.css";

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

// Extend HTMLVideoElement type to include our custom property
declare global {
  interface HTMLVideoElement {
    _durationObserver?: MutationObserver;
    _periodicUpdateId?: ReturnType<typeof setInterval>;
    _timeoutId?: ReturnType<typeof setTimeout>;
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
  // Initialize VideoUtils error silencer
  useEffect(() => {
    if (isOpen) {
      VideoUtils.silenceCORSErrors();
    }
  }, [isOpen]);

  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [actualDuration, setActualDuration] = useState<number | null>(null);

  // New state for video queue
  const [videoQueue, setVideoQueue] = useState<Video[]>(() => {
    return storageUtils.getItem(STORAGE_KEYS.VIDEO_QUEUE, []);
  });
  const [currentQueueIndex, setCurrentQueueIndex] = useState(-1);

  // Filter queue to only show videos from the current course if a course is available
  const filteredQueue = useMemo(() => {
    if (course && course.videos) {
      // If we have a course, return all videos from this course
      return course.videos.map((cv) => cv.video);
    }
    return videoQueue;
  }, [course, videoQueue]);

  // Use filtered queue for display
  const displayQueue = course ? filteredQueue : videoQueue;

  // Get initial playback speed from localStorage or default to 1
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(() => {
    return storageUtils.getItem(STORAGE_KEYS.PLAYBACK_SPEED, 1);
  });

  // Effect to apply playback speed when it changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackSpeed;
    }

    // Save to localStorage when speed changes
    storageUtils.setItem(STORAGE_KEYS.PLAYBACK_SPEED, playbackSpeed);
  }, [playbackSpeed]);

  // Handle speed change
  const changePlaybackSpeed = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
    // Store the selected speed in localStorage
    storageUtils.setItem(STORAGE_KEYS.PLAYBACK_SPEED, speed);
  };

  // Queue management functions
  const addToQueue = (videoToAdd: Video) => {
    const newQueue = [...videoQueue];
    if (!newQueue.some((v) => v.uuid === videoToAdd.uuid)) {
      newQueue.push(videoToAdd);
      setVideoQueue(newQueue);
      storageUtils.setItem(STORAGE_KEYS.VIDEO_QUEUE, newQueue);
    }
  };

  const removeFromQueue = (index: number) => {
    // Don't allow removing videos if we're in course context
    if (course) return;

    // If using filtered queue, find the actual video in the main queue
    const videoToRemove = displayQueue[index];
    if (!videoToRemove) return;

    const mainQueueIndex = videoQueue.findIndex((v) => v.uuid === videoToRemove.uuid);
    if (mainQueueIndex === -1) return;

    const newQueue = [...videoQueue];
    newQueue.splice(mainQueueIndex, 1);
    setVideoQueue(newQueue);
    storageUtils.setItem(STORAGE_KEYS.VIDEO_QUEUE, newQueue);

    // Adjust current index if needed
    if (index === currentQueueIndex && displayQueue.length > 0) {
      // If we removed the current video, play the next one
      if (index < displayQueue.length) {
        // Keep index the same to play next video
        playQueueItem(index);
      } else {
        // We removed the last item, play the new last item
        playQueueItem(displayQueue.length - 1);
      }
    } else if (index < currentQueueIndex) {
      // We removed a video before the current one, adjust index
      setCurrentQueueIndex(currentQueueIndex - 1);
    }
  };

  const playQueueItem = (index: number) => {
    if (index >= 0 && index < displayQueue.length) {
      setCurrentQueueIndex(index);

      // Get the video to play
      const videoToPlay = displayQueue[index];

      // Clean up current video playback
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }

      // Reset states
      setIsLoading(true);
      setErrorMessage(null);
      setActualDuration(videoToPlay.durationInSeconds || null);

      // Setup the new stream
      setupStreamForVideo(videoToPlay);
    }
  };

  // Create a function to set up stream for a specific video
  const setupStreamForVideo = async (videoToPlay: Video) => {
    if (!videoRef.current) return;

    try {
      setIsLoading(true);
      setErrorMessage(null);
      setStatus("Preparing stream...");

      // Extract video ID
      const videoId = videoToPlay.uuid;

      // Set the actual duration if available from the video object
      if (videoToPlay.durationInSeconds) {
        setActualDuration(videoToPlay.durationInSeconds);
      }

      // Get an estimate of the last part (now more accurate with binary search)
      const lastPart = await VideoUtils.findLastPart(videoId, setStatus);

      if (lastPart === 0) {
        setErrorMessage("Could not prepare video stream");
        setIsLoading(false);
        return;
      }

      // If we didn't get the duration from the video object, use the parts estimate
      const calculatedDuration = videoToPlay.durationInSeconds || lastPart * 10;
      setActualDuration(calculatedDuration);

      // Set fixed duration metadata so the browser knows it upfront
      if (videoRef.current) {
        videoRef.current.dataset.actualDuration = formatDuration(calculatedDuration);
        videoRef.current.dataset.fixedDuration = "true";

        // Create and insert a metadata track with the duration info
        const metadataTrack = document.createElement("track");
        metadataTrack.kind = "metadata";
        metadataTrack.label = "Duration";
        metadataTrack.default = true;

        // Create a WebVTT text track with duration metadata
        const trackContent = `WEBVTT

00:00:00.000 --> ${formatDuration(calculatedDuration)}
Duration=${calculatedDuration}`;

        const trackBlob = new Blob([trackContent], { type: "text/vtt" });
        metadataTrack.src = URL.createObjectURL(trackBlob);

        // Add the track to the video
        videoRef.current.appendChild(metadataTrack);
      }

      // Generate M3U8 data directly
      const m3u8Data = VideoUtils.generateM3U8(videoId, lastPart);

      // Clean up previous HLS instance if it exists
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }

      if (Hls.isSupported()) {
        const hls = new Hls({
          maxBufferSize: 0,
          maxBufferLength: 30,
          startPosition: 0,
          // Add additional configuration for handling network errors
          maxMaxBufferLength: 60,
          maxBufferHole: 0.5,
          lowLatencyMode: false,
        });

        hlsRef.current = hls;

        // Use data URL to load the M3U8 content directly with Base64 encoding
        // This approach bypasses CORS restrictions for the manifest
        hls.loadSource("data:application/x-mpegURL;base64," + btoa(m3u8Data));
        hls.attachMedia(videoRef.current);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          if (videoRef.current) {
            // Set the video duration information as a data attribute
            if (calculatedDuration && videoRef.current) {
              videoRef.current.dataset.actualDuration = formatDuration(calculatedDuration);

              // Directly override the duration property on the video element
              // This forces the HTML5 player to use our duration value
              Object.defineProperty(videoRef.current, "duration", {
                configurable: true,
                get: function () {
                  return calculatedDuration;
                },
              });
            }

            // Apply the stored playback speed to the video
            videoRef.current.playbackRate = playbackSpeed;

            // Try to play the video normally first
            const playPromise = videoRef.current.play();

            if (playPromise !== undefined) {
              playPromise.catch((err) => {
                console.warn("Initial autoplay was prevented:", err);
                setStatus("Autoplay blocked. Trying with muted audio...");

                // Try again with muted audio - more likely to be allowed by browsers
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

        // Add error handling - use the existing setup
        setupHlsErrorHandling(hls);
      } else if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
        // For Safari with native HLS support - use the existing setup
        setupSafariPlayback(m3u8Data, calculatedDuration);
      }

      setStatus("");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unknown error occurred");
      console.error("Stream setup error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Extract HLS error handling to a separate function
  const setupHlsErrorHandling = (hls: Hls) => {
    // Add more detailed error handling
    hls.on(Hls.Events.ERROR, (_event: unknown, data: any) => {
      console.warn("HLS error:", data);

      // Don't show CORS errors to the user, just handle them silently
      if (data.fatal) {
        switch (data.type) {
          case Hls.ErrorTypes.NETWORK_ERROR:
            hls.startLoad();
            break;
          case Hls.ErrorTypes.MEDIA_ERROR:
            hls.recoverMediaError();
            break;
          default:
            // Try to reinitialize HLS
            if (hlsRef.current) {
              hlsRef.current.destroy();
              hlsRef.current = null;
            }
            break;
        }
      }
    });

    // Add a listener for when the video ends segment loading
    hls.on(Hls.Events.FRAG_LOADED, () => {
      // Clear any error messages if we successfully loaded a fragment
      setErrorMessage(null);
    });
  };

  // Extract Safari playback setup to a separate function
  const setupSafariPlayback = (m3u8Data: string, calculatedDuration: number) => {
    if (!videoRef.current) return;

    // Create a data URL for Safari
    const dataUrl = "data:application/x-mpegURL;base64," + btoa(m3u8Data);
    videoRef.current.src = dataUrl;

    videoRef.current.addEventListener("loadedmetadata", () => {
      // Set the video duration information as a data attribute
      if (calculatedDuration && videoRef.current) {
        videoRef.current.dataset.actualDuration = formatDuration(calculatedDuration);

        // Directly override the duration property on the video element
        // This forces the HTML5 player to use our duration value
        Object.defineProperty(videoRef.current, "duration", {
          configurable: true,
          get: function () {
            return calculatedDuration;
          },
        });
      }

      // Apply the stored playback speed to the video
      if (videoRef.current) {
        videoRef.current.playbackRate = playbackSpeed;
      }

      // Try to play with the same fallback approach
      const playPromise = videoRef.current?.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn("Safari autoplay was prevented:", err);
          setStatus("Autoplay blocked in Safari. Trying with muted audio...");

          // Try again with muted audio
          if (videoRef.current) {
            videoRef.current.muted = true;
            videoRef.current.play().catch((muteErr) => {
              console.error("Safari muted autoplay also failed:", muteErr);
              setStatus("Autoplay blocked. Press play to start video.");
            });
          }
        });
      }
    });
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

  // Video ended handler to auto-play next in queue
  const handleVideoEnded = () => {
    if (currentQueueIndex >= 0 && currentQueueIndex < displayQueue.length - 1) {
      playNextInQueue();
    }
  };

  // Add this video to queue when opened
  useEffect(() => {
    if (isOpen && video) {
      // Always add to the main queue if not already there and we're not in a course
      if (!course && !videoQueue.some((v) => v.uuid === video.uuid)) {
        addToQueue(video);
      }

      // Find the index of this video in the display queue
      const index = displayQueue.findIndex((v) => v.uuid === video.uuid);
      if (index !== -1) {
        setCurrentQueueIndex(index);
      }
    }
  }, [isOpen, video, videoQueue.length, displayQueue, course]);

  // When the dialog opens, play the currently selected video
  useEffect(() => {
    if (isOpen && video) {
      setupStreamForVideo(video);
    }

    // Add keyboard event listener for Escape key and arrow navigation
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      } else if (event.key === "ArrowRight" && event.altKey) {
        // Alt+Right Arrow to play next video
        playNextInQueue();
      } else if (event.key === "ArrowLeft" && event.altKey) {
        // Alt+Left Arrow to play previous video
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

  // Apply playback speed as soon as possible after video loads
  useEffect(() => {
    if (videoRef.current) {
      const applyPlaybackSpeed = () => {
        if (videoRef.current) {
          videoRef.current.playbackRate = playbackSpeed;
        }
      };

      // Apply immediately
      applyPlaybackSpeed();

      // Also apply on these events to ensure it sticks
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

  // Create a custom video element before rendering
  useEffect(() => {
    if (isOpen && videoRef.current && actualDuration) {
      // Override the duration property early, before any streaming starts
      try {
        // Create a fixed duration definition for this video element
        const fixDuration = {
          configurable: true,
          get: function () {
            return actualDuration;
          },
        };

        // Apply the fixed duration to the video element
        Object.defineProperty(videoRef.current, "duration", fixDuration);

        // Force the value early
        videoRef.current.dataset.actualDuration = formatDuration(actualDuration);

        // Add a custom property to signal our fixed duration
        videoRef.current.dataset.fixedDuration = "true";
      } catch (err) {
        console.error("Failed to set initial duration", err);
      }
    }
  }, [videoRef.current, actualDuration, isOpen]);

  // Format the duration for display
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

  // Find video index in course videos (for episode number)
  const getVideoIndex = (): number | undefined => {
    if (!course || !course.videos) return undefined;

    const index = course.videos.findIndex((cv) => cv.video.uuid === video.uuid);
    return index !== -1 ? index + 1 : undefined;
  };

  // Format title with course name and episode number (simplified)
  const formattedTitle = (): string => {
    const videoIndex = getVideoIndex();
    const episodeText = videoIndex ? `#${videoIndex}: ` : "";
    const courseName = course ? `${course.title} ` : "";
    return `${courseName}${episodeText}${video.title}`;
  };

  // Set up direct streaming that bypasses CORS - wrapper for setupStreamForVideo
  const setupStream = async () => {
    await setupStreamForVideo(video);
  };

  // Update the video duration display
  useEffect(() => {
    if (!videoRef.current || !actualDuration) return;

    const videoElement = videoRef.current;

    // Function to update duration display in the HTML5 player
    const updateTimeDisplay = () => {
      const currentTime = videoElement.currentTime || 0;
      const remainingTime = Math.max(0, actualDuration - currentTime);

      // Store actual values in data attributes with formatted values
      videoElement.dataset.actualDuration = formatDuration(actualDuration);
      videoElement.dataset.currentTime = formatDuration(currentTime);
      videoElement.dataset.remainingTime = formatDuration(remainingTime);

      // Try to modify the time display through a MutationObserver
      // This watches for changes in the video controls and updates them
      if (!videoElement._durationObserver) {
        const observer = new MutationObserver((mutations) => {
          try {
            // Try to find time displays in the shadow DOM
            const timeDisplay =
              videoElement.querySelector(".time-display") || videoElement.shadowRoot?.querySelector(".time-display");

            if (timeDisplay) {
              const durationEl =
                timeDisplay.querySelector(".duration-display") || timeDisplay.querySelector(".time-remaining");
              if (durationEl) {
                durationEl.textContent = formatDuration(actualDuration);
              }
            }

            // Try to find time in other common formats
            const timeRemaining =
              videoElement.querySelector('*[class*="time-remaining"]') ||
              videoElement.shadowRoot?.querySelector('*[class*="time-remaining"]');
            if (timeRemaining) {
              timeRemaining.textContent = formatDuration(actualDuration);
            }
          } catch (err) {
            // Shadow DOM access errors can be ignored
          }
        });

        // Observe the video element for changes to its children
        observer.observe(videoElement, {
          childList: true,
          subtree: true,
          characterData: true,
          attributes: true,
        });

        // Store observer reference for cleanup
        videoElement._durationObserver = observer;
      }
    };

    // Apply a CSS solution as well
    const styleEl = document.createElement("style");
    styleEl.textContent = `
      /* Playback speed controls - ensure they're visible */
      .playback-speed-controls {
        position: absolute;
        bottom: 50px;
        right: 20px;
        background-color: rgba(0, 0, 0, 0.7);
        border-radius: 8px;
        padding: 6px;
        display: flex;
        gap: 5px;
        z-index: 100;
        opacity: 0.9;
        transition: opacity 0.3s ease;
      }
      
      /* Fix for the video duration display */
      video::-webkit-media-controls-current-time-display,
      video::-webkit-media-controls-time-remaining-display {
        visibility: visible !important;
        opacity: 1 !important;
        display: inline-block !important;
      }
      
      /* Override time displays in the controls */
      video::-webkit-media-controls-time-remaining-display::after {
        content: "${formatDuration(actualDuration)}" !important;
      }
    `;
    document.head.appendChild(styleEl);

    // Force a refresh of the controls by triggering events
    setTimeout(() => {
      // Update display immediately
      updateTimeDisplay();

      // Also trigger durationchange event to update any native displays
      const durationEvent = new Event("durationchange");
      videoElement.dispatchEvent(durationEvent);
    }, 100);

    // Update duration display on relevant events
    videoElement.addEventListener("timeupdate", updateTimeDisplay);
    videoElement.addEventListener("loadedmetadata", updateTimeDisplay);
    videoElement.addEventListener("durationchange", updateTimeDisplay);
    videoElement.addEventListener("playing", updateTimeDisplay);
    videoElement.addEventListener("progress", updateTimeDisplay);

    // Handle cleanup
    return () => {
      // Clean up event listeners and styles
      videoElement.removeEventListener("timeupdate", updateTimeDisplay);
      videoElement.removeEventListener("loadedmetadata", updateTimeDisplay);
      videoElement.removeEventListener("durationchange", updateTimeDisplay);
      videoElement.removeEventListener("playing", updateTimeDisplay);
      videoElement.removeEventListener("progress", updateTimeDisplay);

      if (videoElement._durationObserver) {
        videoElement._durationObserver.disconnect();
        delete videoElement._durationObserver;
      }

      document.head.removeChild(styleEl);
    };
  }, [videoRef.current, actualDuration]);

  useEffect(() => {
    if (!isOpen || !videoRef.current) return;

    // Set the formatted duration directly on the video element
    if (videoRef.current && actualDuration) {
      videoRef.current.dataset.actualDuration = formatDuration(actualDuration);

      // Force the duration value directly on the video element
      try {
        // Set hard duration value
        Object.defineProperty(videoRef.current, "duration", {
          configurable: true,
          get: function () {
            return actualDuration;
          },
        });

        // Create a script to override the duration in the player
        const script = document.createElement("script");
        script.innerHTML = `
          // Force the duration on all video elements to prevent 50:00 display
          (function() {
            const videos = document.querySelectorAll('video');
            videos.forEach(video => {
              const actualDuration = ${actualDuration};
              // Override the duration getter
              Object.defineProperty(video, 'duration', {
                configurable: true,
                get: function() { return actualDuration; }
              });
              
              // Force update the controls
              const event = new Event('durationchange');
              video.dispatchEvent(event);
              
              // Add a MutationObserver to replace "50:00" text wherever it appears
              const observer = new MutationObserver(mutations => {
                // Find all text nodes in the document
                const walkDOM = (node) => {
                  if (node.nodeType === 3 && node.textContent && node.textContent.includes('50:00')) {
                    node.textContent = node.textContent.replace('50:00', '${formatDuration(actualDuration)}');
                  }
                  if (node.childNodes) {
                    node.childNodes.forEach(walkDOM);
                  }
                };
                
                // Check entire document for "50:00" text
                document.body.childNodes.forEach(walkDOM);
              });
              
              // Observe document body for any changes
              observer.observe(document.body, {
                childList: true,
                subtree: true,
                characterData: true
              });
            });
          })();
        `;
        document.head.appendChild(script);

        // Remove script after execution
        setTimeout(() => {
          document.head.removeChild(script);
        }, 100);
      } catch (err) {
        console.error("Error setting duration:", err);
      }
    }

    setupStream();

    // Add keyboard event listener for Escape key
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
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
  }, [isOpen, video, onClose, actualDuration]);

  // Function to handle backdrop clicks
  const handleBackdropClick = (e: React.MouseEvent) => {
    // Only close if clicking the backdrop itself, not its children
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Helper to stop event propagation
  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  // Find the portal target node
  let modalRoot = document.getElementById("modal-root");

  // If modal root doesn't exist, create one
  useEffect(() => {
    if (!document.getElementById("modal-root")) {
      const div = document.createElement("div");
      div.id = "modal-root";
      document.body.appendChild(div);
      modalRoot = div;
    }
  }, []);

  if (!isOpen) return null;

  // Get the current modal root (might have been created in the effect)
  const currentModalRoot = document.getElementById("modal-root");
  if (!currentModalRoot) return null;

  // Use Portal to render the dialog with Tailwind classes
  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black/95 flex justify-center items-center z-[1000]" onClick={handleBackdropClick}>
      <div
        className="bg-[var(--hextech-color-background-medium)] w-full h-full flex flex-row overflow-hidden"
        onClick={stopPropagation}
      >
        {/* Left panel (60%) - Video Only */}
        <div className="w-3/5 h-full flex flex-col border-r border-[var(--hextech-color-gold-dark)] bg-black">
          {/* Video content takes up full space */}
          <div className="flex-1 relative flex items-center justify-center w-full h-full p-0">
            <div className="relative w-full h-full overflow-hidden">
              {isLoading && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/70 text-white p-3 rounded flex items-center gap-2 z-2">
                  <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                  <span>{status}</span>
                </div>
              )}
              {errorMessage && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/90 text-white p-4 rounded-lg z-3 text-center w-4/5 max-w-md border border-red-600">
                  <h3 className="text-lg font-bold mb-2">Error loading video</h3>
                  <p className="mb-2">{errorMessage}</p>
                  <p className="text-sm opacity-70 mt-3">
                    Please try again later or contact support if the problem persists.
                  </p>
                </div>
              )}
              <video
                ref={videoRef}
                className="w-full h-full object-contain bg-black"
                controls
                autoPlay
                playsInline
                onEnded={handleVideoEnded}
              />
              {/* Custom video controls */}
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-2 flex flex-col gap-2 z-10 opacity-100 transition-opacity duration-300">
                {/* Progress bar */}
                <div className="w-full h-2.5 relative cursor-pointer">
                  <progress
                    className="w-full h-2 bg-white/20 rounded overflow-hidden appearance-none"
                    value="0"
                    max="100"
                  />
                </div>
                {/* Control buttons */}
                <div className="flex items-center justify-between w-full mt-2">
                  <div className="flex items-center">
                    <button
                      className="bg-transparent border-none text-white cursor-pointer p-1.5 flex items-center justify-center rounded transition-colors hover:bg-white/10"
                      onClick={playPreviousInQueue}
                      title="Previous video"
                    >
                      <FontAwesomeIcon icon={faStepBackward} className="w-5 h-5" />
                    </button>
                    <button
                      className="bg-transparent border-none text-white cursor-pointer p-1.5 flex items-center justify-center rounded transition-colors hover:bg-white/10"
                      onClick={playNextInQueue}
                      title="Next video"
                    >
                      <FontAwesomeIcon icon={faStepForward} className="w-5 h-5" />
                    </button>
                    <span className="text-white text-xs ml-2.5">
                      0:00 / {actualDuration ? formatDuration(actualDuration) : "..."}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className="absolute bottom-[60px] right-5 bg-black/70 rounded-lg p-1.5 flex gap-1.5 z-10 opacity-90 transition-opacity duration-300 items-center hover:opacity-100">
                      <span className="text-white text-xs mr-1.5">{playbackSpeed}x</span>
                      <div className="flex gap-1.5">
                        <button
                          className={`bg-[rgba(50,50,50,0.6)] text-white border-none rounded p-1 text-xs cursor-pointer transition-all duration-200 min-w-9 font-sans hover:bg-[rgba(80,80,80,0.8)] ${playbackSpeed === 0.5 ? "bg-red-600 font-bold" : ""}`}
                          onClick={() => changePlaybackSpeed(0.5)}
                        >
                          0.5x
                        </button>
                        <button
                          className={`bg-[rgba(50,50,50,0.6)] text-white border-none rounded p-1 text-xs cursor-pointer transition-all duration-200 min-w-9 font-sans hover:bg-[rgba(80,80,80,0.8)] ${playbackSpeed === 0.75 ? "bg-red-600 font-bold" : ""}`}
                          onClick={() => changePlaybackSpeed(0.75)}
                        >
                          0.75x
                        </button>
                        <button
                          className={`bg-[rgba(50,50,50,0.6)] text-white border-none rounded p-1 text-xs cursor-pointer transition-all duration-200 min-w-9 font-sans hover:bg-[rgba(80,80,80,0.8)] ${playbackSpeed === 1 ? "bg-red-600 font-bold" : ""}`}
                          onClick={() => changePlaybackSpeed(1)}
                        >
                          1x
                        </button>
                        <button
                          className={`bg-[rgba(50,50,50,0.6)] text-white border-none rounded p-1 text-xs cursor-pointer transition-all duration-200 min-w-9 font-sans hover:bg-[rgba(80,80,80,0.8)] ${playbackSpeed === 1.25 ? "bg-red-600 font-bold" : ""}`}
                          onClick={() => changePlaybackSpeed(1.25)}
                        >
                          1.25x
                        </button>
                        <button
                          className={`bg-[rgba(50,50,50,0.6)] text-white border-none rounded p-1 text-xs cursor-pointer transition-all duration-200 min-w-9 font-sans hover:bg-[rgba(80,80,80,0.8)] ${playbackSpeed === 1.5 ? "bg-red-600 font-bold" : ""}`}
                          onClick={() => changePlaybackSpeed(1.5)}
                        >
                          1.5x
                        </button>
                        <button
                          className={`bg-[rgba(50,50,50,0.6)] text-white border-none rounded p-1 text-xs cursor-pointer transition-all duration-200 min-w-9 font-sans hover:bg-[rgba(80,80,80,0.8)] ${playbackSpeed === 2 ? "bg-red-600 font-bold" : ""}`}
                          onClick={() => changePlaybackSpeed(2)}
                        >
                          2x
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right panel (40%) - All metadata and controls */}
        <div className="w-2/5 h-full flex flex-col overflow-hidden">
          {/* Right panel header with close button */}
          <div className="flex justify-between items-center p-3 bg-[var(--hextech-color-background-dark)] border-b border-[var(--hextech-color-gold-dark)]">
            <h2 className="m-0 text-[var(--hextech-color-gold-light)] text-lg font-semibold flex justify-between w-full items-center">
              {course && <span className="text-[var(--hextech-color-gold-medium)] opacity-80">{course.title}</span>}
              <button
                className="bg-transparent border-none text-[var(--hextech-color-gold-medium)] text-2xl cursor-pointer p-0 px-2 hover:text-[var(--hextech-color-gold-light)]"
                onClick={onClose}
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </h2>
          </div>

          {/* Video title section */}
          <div className="p-3 bg-black/20 border-b border-[var(--hextech-color-gold-dark)]">
            <h2 className="m-0 text-lg text-[var(--hextech-color-gold-light)] flex flex-wrap items-center gap-2.5">
              {getVideoIndex() && (
                <span className="text-[var(--hextech-color-gold-medium)] font-normal bg-black/30 py-0.5 px-1.5 rounded">
                  #{getVideoIndex()}
                </span>
              )}
              {getVideoIndex() && <span className="text-[var(--hextech-color-gold-dark)]">|</span>}
              <span className="font-bold flex-grow">{video.title}</span>
              <span className="text-[var(--hextech-color-gold-medium)] text-sm py-0.5 px-1.5 bg-black/30 rounded">
                {actualDuration ? formatDuration(actualDuration) : "..."}
              </span>
            </h2>
          </div>

          {/* Course information if available */}
          {course && course.description && (
            <div className="p-4 border-b border-[var(--hextech-color-gold-dark)] bg-[var(--hextech-color-background-dark)]">
              <h3 className="text-xl text-[var(--hextech-color-gold-medium)] font-serif mb-2">{course.title}</h3>
              <div className="text-[var(--hextech-color-gold-light)]">{course.description}</div>
            </div>
          )}

          {/* Video metadata */}
          <div className="p-4 flex flex-wrap gap-3 bg-black/20 border-b border-[var(--hextech-color-gold-dark)]">
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
            {course && (
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faListAlt} className="text-[var(--hextech-color-gold)] mr-2" />
                <span className="text-gray-400 text-sm">Course:</span>
                <span className="text-white text-sm font-medium">{course.title}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faTachometerAlt} className="text-[var(--hextech-color-gold)] mr-2" />
              <span className="text-gray-400 text-sm">Speed:</span>
              <span className="text-white text-sm font-medium">{playbackSpeed}x</span>
            </div>
          </div>

          {/* Video queue - Takes up remaining space */}
          {course ? (
            <div className="flex-1 overflow-y-auto border-t border-[var(--hextech-color-gold-dark)] bg-[rgba(16,31,45,0.9)]">
              <div className="sticky top-0 z-10 flex justify-between items-center p-3.5 bg-[rgba(56,40,17,0.3)] border-b border-[var(--hextech-color-gold-dark)]">
                <h3 className="m-0 text-base font-semibold text-[var(--hextech-color-gold-light)] flex items-center">
                  <FontAwesomeIcon icon={faListAlt} className="text-[var(--hextech-color-gold-medium)] mr-2" />
                  Course Videos
                </h3>
              </div>
              <div className="overflow-y-auto">
                {displayQueue.map((queueVideo, index) => (
                  <div
                    key={queueVideo.uuid}
                    className={`flex items-center justify-between p-3 rounded cursor-pointer transition-colors mb-2 hover:bg-[var(--hextech-color-background-medium)] ${queueVideo.uuid === video.uuid ? "bg-[var(--hextech-color-background-light)] border-l-3 border-l-[var(--hextech-color-blue-medium)]" : ""}`}
                    onClick={() => playQueueItem(index)}
                  >
                    <div className="flex items-center justify-center min-w-8 h-8 bg-[var(--hextech-color-background-medium)] rounded-full mr-3.5 text-[var(--hextech-color-gold-medium)] text-sm font-medium">
                      {index + 1}
                    </div>
                    <div className="flex-1 text-[var(--hextech-color-gold-light)] text-sm whitespace-nowrap overflow-hidden text-ellipsis mr-4">
                      {queueVideo.title}
                    </div>
                    <div className="text-[var(--hextech-color-gold-medium)] text-xs p-0 px-2 bg-black/30 rounded whitespace-nowrap">
                      {queueVideo.durationInSeconds ? formatDuration(queueVideo.durationInSeconds) : "..."}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto">
              <div className="sticky top-0 z-10 flex justify-between items-center p-3.5 bg-[var(--hextech-color-background-medium)] border-b border-[var(--hextech-color-gold-dark)]">
                <h3 className="m-0 text-base font-semibold text-[var(--hextech-color-gold-light)] flex items-center">
                  <FontAwesomeIcon icon={faListAlt} className="text-[var(--hextech-color-gold)] mr-2" />
                  Video Queue
                </h3>
              </div>
              <div className="overflow-y-auto">
                {displayQueue.length > 0 ? (
                  displayQueue.map((queueVideo, index) => (
                    <div
                      key={queueVideo.uuid}
                      className={`flex items-center justify-between p-3 rounded cursor-pointer transition-colors mb-2 hover:bg-[var(--hextech-color-background-medium)] ${queueVideo.uuid === video.uuid ? "bg-[var(--hextech-color-background-light)] border-l-3 border-l-[var(--hextech-color-blue-medium)]" : ""}`}
                      onClick={() => playQueueItem(index)}
                    >
                      <div className="flex items-center justify-center min-w-8 h-8 bg-[var(--hextech-color-background-medium)] rounded-full mr-3.5 text-[var(--hextech-color-gold-medium)] text-sm font-medium">
                        {index + 1}
                      </div>
                      <div className="flex-1 text-[var(--hextech-color-gold-light)] text-sm whitespace-nowrap overflow-hidden text-ellipsis mr-4">
                        {queueVideo.title}
                      </div>
                      <div className="text-[var(--hextech-color-gold-medium)] text-xs p-0 px-2 bg-black/30 rounded whitespace-nowrap">
                        {queueVideo.durationInSeconds ? formatDuration(queueVideo.durationInSeconds) : "..."}
                      </div>
                      {!course && (
                        <button
                          className="bg-transparent border-none text-[var(--hextech-color-gold-medium)] text-lg cursor-pointer p-0 px-1 ml-2 flex items-center justify-center w-6 h-6 rounded-full transition-all hover:text-[var(--hextech-color-gold-light)] hover:bg-[rgba(190,49,68,0.2)]"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFromQueue(index);
                          }}
                          title="Remove from queue"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center text-[var(--hextech-color-gold-medium)] p-4 italic">
                    No videos in queue. Add videos to watch them in sequence.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>,
    currentModalRoot,
  );
}
