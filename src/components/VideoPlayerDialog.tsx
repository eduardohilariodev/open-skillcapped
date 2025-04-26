import React, { useEffect, useRef, useState, useMemo } from "react";
import ReactDOM from "react-dom";
import Hls from "hls.js";
import { Video } from "../model/Video";
import { Course } from "../model/Course";
import { VideoUtils } from "../utils/VideoUtils";
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
      // If we have a course, only show videos from this course
      const courseVideoIds = course.videos.map((cv) => cv.video.uuid);
      return videoQueue.filter((v) => courseVideoIds.includes(v.uuid));
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
    // If using filtered queue, find the actual video in the main queue
    const videoToRemove = displayQueue[index];
    if (!videoToRemove) return;

    const mainQueueIndex = videoQueue.findIndex((v) => v.uuid === videoToRemove.uuid);
    if (mainQueueIndex === -1) return;

    const newQueue = [...videoQueue];
    newQueue.splice(mainQueueIndex, 1);
    setVideoQueue(newQueue);
    storageUtils.setItem(STORAGE_KEYS.VIDEO_QUEUE, newQueue);

    // Get the updated filtered queue after removal
    const updatedFilteredQueue = course?.videos
      ? newQueue.filter((v) => course.videos.some((cv) => cv.video.uuid === v.uuid))
      : newQueue;

    // Adjust current index if needed
    if (index === currentQueueIndex && updatedFilteredQueue.length > 0) {
      // If we removed the current video, play the next one
      if (index < updatedFilteredQueue.length) {
        // Keep index the same to play next video
        playQueueItem(index);
      } else {
        // We removed the last item, play the new last item
        playQueueItem(updatedFilteredQueue.length - 1);
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

            videoRef.current.play().catch((err) => console.error("Failed to autoplay:", err));
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

      videoRef.current?.play().catch((err) => console.error("Failed to autoplay:", err));
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
      // Always add to the main queue if not already there
      if (!videoQueue.some((v) => v.uuid === video.uuid)) {
        addToQueue(video);
      }

      // For showing the correct active item in the display queue
      if (course) {
        // Find the index of this video in the filtered queue
        const filteredIndex = displayQueue.findIndex((v) => v.uuid === video.uuid);
        if (filteredIndex !== -1) {
          setCurrentQueueIndex(filteredIndex);
        }
      } else {
        // Find this video in the main queue
        const index = videoQueue.findIndex((v) => v.uuid === video.uuid);
        setCurrentQueueIndex(index);
      }
    }
  }, [isOpen, video, videoQueue.length, displayQueue]);

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

  // Use Portal to render the dialog
  return ReactDOM.createPortal(
    <div className="video-player-overlay" onClick={onClose}>
      <div className="video-player-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="video-player-header">
          <h2>
            {course && <span className="course-name">{course.title}</span>}
            {getVideoIndex() && <span className="episode-number">#{getVideoIndex()}:</span>}
            <span className="video-title">{video.title}</span>
          </h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="video-player-content">
          {isLoading && (
            <div className="loading-indicator">
              <div className="spinner"></div> {status}
            </div>
          )}
          {errorMessage && !errorMessage.includes("CORS") && !errorMessage.includes("403") && (
            <div className="error-message">
              <p>{errorMessage}</p>
            </div>
          )}
          <div className="video-container">
            <video
              ref={videoRef}
              controls
              autoPlay
              playsInline
              preload="metadata"
              className="video-player lol-hextech-player"
              data-actual-duration={actualDuration ? formatDuration(actualDuration) : undefined}
              {...(actualDuration ? { "data-duration": actualDuration, duration: actualDuration } : {})}
              onLoadStart={(e) => {
                // Set duration as soon as possible
                if (actualDuration && e.currentTarget) {
                  e.currentTarget.dataset.actualDuration = formatDuration(actualDuration);
                  try {
                    Object.defineProperty(e.currentTarget, "duration", {
                      configurable: true,
                      get: function () {
                        return actualDuration;
                      },
                    });
                  } catch (err) {
                    console.error("Failed to set initial duration", err);
                  }
                }
              }}
              onLoadedMetadata={(e) => {
                // Force duration property on load
                if (actualDuration && e.currentTarget) {
                  e.currentTarget.dataset.actualDuration = formatDuration(actualDuration);
                  try {
                    Object.defineProperty(e.currentTarget, "duration", {
                      configurable: true,
                      get: function () {
                        return actualDuration;
                      },
                    });

                    // Force update the time display
                    const event = new Event("durationchange");
                    e.currentTarget.dispatchEvent(event);
                  } catch (err) {
                    console.error("Failed to override duration:", err);
                  }
                }
              }}
              onEnded={handleVideoEnded}
            />
          </div>
        </div>

        {/* New Video Footer */}
        <div className="video-player-footer">
          <div className="video-metadata">
            <div className="metadata-item">
              <span className="metadata-label">Duration:</span>
              <span className="metadata-value">{actualDuration ? formatDuration(actualDuration) : "Loading..."}</span>
            </div>
            <div className="metadata-item">
              <span className="metadata-label">Released:</span>
              <span className="metadata-value">{video.releaseDate.toLocaleDateString()}</span>
            </div>
            <div className="metadata-item">
              <span className="metadata-label">Role:</span>
              <span className="metadata-value">{video.role}</span>
            </div>
          </div>

          {/* Playback Speed Controls in Footer */}
          <div className="footer-playback-controls">
            <div className="speed-label">Playback Speed:</div>
            <div className="speed-buttons">
              {[1, 1.25, 1.5, 1.75, 2, 2.5, 3].map((speed) => (
                <button
                  key={speed}
                  className={`speed-button ${playbackSpeed === speed ? "active" : ""}`}
                  onClick={() => changePlaybackSpeed(speed)}
                  title={`Set ${speed}x speed for all videos`}
                >
                  {speed}x
                </button>
              ))}
              <div className="speed-saved-indicator" title="This speed will be used for all videos">
                <span className="save-icon">💾</span>
              </div>
            </div>
          </div>
        </div>

        {/* Video Queue */}
        <div className="video-queue-container">
          <div className="queue-header">
            <h3>{course ? `${course.title} Videos` : "Video Queue"}</h3>
            <div className="queue-controls">
              <button
                className="queue-control-button"
                onClick={playPreviousInQueue}
                disabled={currentQueueIndex <= 0}
                title="Play previous video (Alt+Left Arrow)"
              >
                ← Previous <span className="keyboard-shortcut">Alt+←</span>
              </button>
              <button
                className="queue-control-button"
                onClick={playNextInQueue}
                disabled={currentQueueIndex >= displayQueue.length - 1}
                title="Play next video (Alt+Right Arrow)"
              >
                Next → <span className="keyboard-shortcut">Alt+→</span>
              </button>
            </div>
          </div>
          <div className="queue-list">
            {displayQueue.length === 0 ? (
              <div className="empty-queue-message">
                {course ? `No videos available in "${course.title}"` : "No videos in queue"}
              </div>
            ) : (
              displayQueue.map((queuedVideo, index) => (
                <div
                  key={queuedVideo.uuid}
                  className={`queue-item ${index === currentQueueIndex ? "active" : ""}`}
                  onClick={() => playQueueItem(index)}
                >
                  <div className="queue-item-index">{index + 1}</div>
                  <div className="queue-item-title">{queuedVideo.title}</div>
                  <div className="queue-item-duration">
                    {queuedVideo.durationInSeconds ? formatDuration(queuedVideo.durationInSeconds) : "Unknown"}
                  </div>
                  <button
                    className="queue-item-remove"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFromQueue(index);
                    }}
                    title="Remove from queue"
                  >
                    ×
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>,
    currentModalRoot,
  );
}
