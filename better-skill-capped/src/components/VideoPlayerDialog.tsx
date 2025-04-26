import React, { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { Video } from "../model/Video";
import { Course } from "../model/Course";
import { VideoUtils } from "../utils/VideoUtils";
import "./VideoPlayerDialog.css";

interface VideoPlayerDialogProps {
  video: Video;
  course?: Course;
  isOpen: boolean;
  onClose: () => void;
}

export function VideoPlayerDialog({ video, isOpen, onClose }: VideoPlayerDialogProps): React.ReactElement | null {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const progressBarRef = useRef<HTMLProgressElement | null>(null);
  const timeDisplayRef = useRef<HTMLSpanElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [actualDuration, setActualDuration] = useState<number | null>(null);
  const hasFixedDuration = useRef(false);

  // Set up direct streaming that bypasses CORS
  const setupStream = async () => {
    if (!videoRef.current) return;

    try {
      setIsLoading(true);
      setErrorMessage(null);
      setStatus("Preparing stream...");
      hasFixedDuration.current = false;

      // Extract video ID
      const videoId = video.uuid;

      // Set the actual duration if available from the video object
      if (video.durationInSeconds) {
        setActualDuration(video.durationInSeconds);
      }

      // Get an estimate of the last part (now more accurate with binary search)
      const lastPart = await VideoUtils.findLastPart(videoId, setStatus);

      if (lastPart === 0) {
        setErrorMessage("Could not prepare video stream");
        setIsLoading(false);
        return;
      }

      // If we didn't get the duration from the video object, use the parts estimate
      if (!actualDuration && !video.durationInSeconds) {
        // Each part is 10 seconds
        setActualDuration(lastPart * 10);
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
          // Add custom loader with CORS handling
          xhrSetup: (xhr, url) => {
            // Add CORS headers
            xhr.withCredentials = false; // Ensure no cookies are sent

            // If the URL is to our video provider
            if (url.includes("cloudfront.net")) {
              // Set headers that might help with CORS
              xhr.setRequestHeader("Origin", "https://www.skill-capped.com");
              xhr.setRequestHeader("Access-Control-Request-Method", "GET");
              xhr.setRequestHeader("Access-Control-Request-Headers", "Content-Type, Content-Length");
            }
          },
        });

        hlsRef.current = hls;

        // Use data URL to load the M3U8 content directly with Base64 encoding
        // This approach bypasses CORS restrictions for the manifest
        hls.loadSource("data:application/x-mpegURL;base64," + btoa(m3u8Data));
        hls.attachMedia(videoRef.current);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          if (videoRef.current) {
            videoRef.current.play().catch((err) => console.error("Failed to autoplay:", err));
          }
        });

        // Add more detailed error handling
        hls.on(Hls.Events.ERROR, (_event: unknown, data: any) => {
          console.warn("HLS error:", data);

          // Show a user-friendly message for 403 errors
          if (data.response && data.response.code === 403) {
            setErrorMessage("Access denied to video segments. This may be due to CORS restrictions.");
          }

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
      } else if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
        // For Safari with native HLS support
        // Create a data URL for Safari
        const dataUrl = "data:application/x-mpegURL;base64," + btoa(m3u8Data);
        videoRef.current.src = dataUrl;

        videoRef.current.addEventListener("loadedmetadata", () => {
          videoRef.current?.play().catch((err) => console.error("Failed to autoplay:", err));
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

  // Handle video time display and progress updates to show the correct duration
  useEffect(() => {
    if (!videoRef.current || !actualDuration) return;

    const videoElement = videoRef.current;
    let timer: number | null = null;

    // Create custom controls
    const createCustomControls = () => {
      if (hasFixedDuration.current) return;

      // Create custom control overlay
      const controlsOverlay = document.createElement("div");
      controlsOverlay.className = "custom-video-controls";

      // Create progress container
      const progressContainer = document.createElement("div");
      progressContainer.className = "progress-container";

      // Create progress bar
      const progressBar = document.createElement("progress");
      progressBar.className = "custom-progress";
      progressBar.max = actualDuration;
      progressBar.value = 0;
      progressBarRef.current = progressBar;

      // Add event listeners to progress bar for seeking
      progressBar.addEventListener("click", (e) => {
        const rect = progressBar.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;
        if (videoElement) {
          videoElement.currentTime = pos * (actualDuration || videoElement.duration);
        }
      });

      // Create control buttons container
      const controlButtons = document.createElement("div");
      controlButtons.className = "control-buttons";

      // Create play/pause button
      const playPauseButton = document.createElement("button");
      playPauseButton.className = "control-button play-pause";
      playPauseButton.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>';
      playPauseButton.addEventListener("click", () => {
        if (videoElement.paused) {
          videoElement.play();
        } else {
          videoElement.pause();
        }
      });

      // Create volume button
      const volumeButton = document.createElement("button");
      volumeButton.className = "control-button volume";
      volumeButton.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>';
      const volumeControls = false;
      volumeButton.addEventListener("click", () => {
        if (videoElement.muted) {
          videoElement.muted = false;
          volumeButton.innerHTML =
            '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>';
        } else {
          videoElement.muted = true;
          volumeButton.innerHTML =
            '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>';
        }
      });

      // Create fullscreen button
      const fullscreenButton = document.createElement("button");
      fullscreenButton.className = "control-button fullscreen";
      fullscreenButton.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>';
      fullscreenButton.addEventListener("click", () => {
        if (document.fullscreenElement) {
          document.exitFullscreen();
        } else {
          videoElement.requestFullscreen();
        }
      });

      // Create time display
      const timeDisplay = document.createElement("span");
      timeDisplay.className = "time-display";
      timeDisplay.textContent = `0:00 / ${formatDuration(actualDuration)}`;
      timeDisplayRef.current = timeDisplay;

      // Add controls to the container
      controlButtons.appendChild(playPauseButton);
      controlButtons.appendChild(volumeButton);
      controlButtons.appendChild(timeDisplay);
      controlButtons.appendChild(fullscreenButton);

      // Append elements
      progressContainer.appendChild(progressBar);
      controlsOverlay.appendChild(progressContainer);
      controlsOverlay.appendChild(controlButtons);

      // Update play/pause button state
      videoElement.addEventListener("play", () => {
        playPauseButton.innerHTML =
          '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>';
      });

      videoElement.addEventListener("pause", () => {
        playPauseButton.innerHTML =
          '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>';
      });

      // Add to video container
      const videoContainer = videoElement.parentElement;
      if (videoContainer) {
        videoContainer.style.position = "relative";
        videoContainer.appendChild(controlsOverlay);
      }

      hasFixedDuration.current = true;
    };

    // Update the time display and progress with the correct duration
    const updateTimeDisplay = () => {
      const currentTime = videoElement.currentTime || 0;

      // Update our custom controls if they exist
      if (progressBarRef.current) {
        progressBarRef.current.value = currentTime;
      }

      if (timeDisplayRef.current) {
        timeDisplayRef.current.textContent = `${formatDuration(currentTime)} / ${formatDuration(actualDuration)}`;
      }

      // Also set a data attribute for CSS to use
      videoElement.dataset.currentTimeFormatted = formatDuration(currentTime);
      videoElement.dataset.durationFormatted = formatDuration(actualDuration);
    };

    // Set up a timer to continuously update the time display
    // This is more reliable than depending on timeupdate events
    const startTimeUpdateTimer = () => {
      timer = window.setInterval(() => {
        updateTimeDisplay();
      }, 250); // Update 4 times per second for smooth appearance
    };

    videoElement.addEventListener("loadedmetadata", createCustomControls);
    videoElement.addEventListener("play", startTimeUpdateTimer);
    videoElement.addEventListener("pause", () => {
      if (timer !== null) {
        window.clearInterval(timer);
        timer = null;
      }
    });

    return () => {
      if (timer !== null) {
        window.clearInterval(timer);
      }
      videoElement.removeEventListener("loadedmetadata", createCustomControls);
      videoElement.removeEventListener("play", startTimeUpdateTimer);
    };
  }, [videoRef.current, actualDuration]);

  useEffect(() => {
    if (!isOpen || !videoRef.current) return;

    // Add CORS meta tags programmatically
    const createOrUpdateMetaTag = (name: string, content: string) => {
      let meta = document.querySelector(`meta[name="${name}"]`);
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("name", name);
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", content);
    };

    createOrUpdateMetaTag("Access-Control-Allow-Origin", "*");
    createOrUpdateMetaTag("Access-Control-Allow-Headers", "Content-Type, Content-Length");

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
      // Remove any custom controls
      const customControls = document.querySelectorAll(".custom-video-controls");
      customControls.forEach((control) => control.remove());
    };
  }, [isOpen, video, onClose, actualDuration]);

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

  if (!isOpen) return null;

  return (
    <div className="video-player-overlay">
      <div className="video-player-dialog">
        <div className="video-player-header">
          <h2>{video.title}</h2>
          {actualDuration && <span className="video-duration">{formatDuration(actualDuration)}</span>}
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
          {errorMessage && (
            <div className="error-message">
              <p>{errorMessage}</p>
              <p className="info-message">
                Note: If you're experiencing CORS issues, try using a browser extension that allows CORS or use the
                desktop application.
              </p>
            </div>
          )}
          <div className="video-container">
            <video
              ref={videoRef}
              controls
              autoPlay
              playsInline
              className="video-player"
              crossOrigin="anonymous"
              data-actual-duration={actualDuration || undefined}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
