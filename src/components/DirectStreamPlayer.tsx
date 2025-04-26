import React, { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import Hls from "hls.js";
import { VideoUtils } from "../utils/VideoUtils";
import "../styles/VideoPlayerDialog.css"; // Fixed import path
import "../styles/components/_button.css";
import "../styles/components/_input.css";
import "../styles/components/_modal.css";

interface DirectStreamPlayerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DirectStreamPlayer({ isOpen, onClose }: DirectStreamPlayerProps): React.ReactElement | null {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [videoVisible, setVideoVisible] = useState(false);
  const [currentVideoId, setCurrentVideoId] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  useEffect(() => {
    if (!isOpen) {
      // Clean up when dialog is closed
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
      setVideoVisible(false);
      return;
    }

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
  }, [isOpen, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!url) {
      setStatus("Please enter a URL");
      return;
    }

    try {
      setIsLoading(true);
      const videoId = VideoUtils.extractVideoId(url);

      if (!videoId) {
        setStatus("Invalid URL. Could not extract video ID.");
        setIsLoading(false);
        return;
      }

      setCurrentVideoId(videoId);
      setStatus("Finding video parts...");

      const lastPart = await VideoUtils.findLastPart(videoId, setStatus);

      if (lastPart === 0) {
        setStatus("Could not find any video parts");
        setIsLoading(false);
        return;
      }

      const m3u8Data = VideoUtils.generateM3U8(videoId, lastPart);

      loadVideo(m3u8Data);
      setVideoVisible(true);
      setStatus("");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unknown error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const loadVideo = (m3u8Data: string) => {
    if (!videoRef.current) return;

    // Clean up previous HLS instance if exists
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    if (Hls.isSupported()) {
      const hls = new Hls({
        maxBufferSize: 0,
        maxBufferLength: 30,
        startPosition: 0,
      });

      hlsRef.current = hls;

      // Use data URL to load the M3U8 content directly
      hls.loadSource("data:application/x-mpegURL;base64," + btoa(m3u8Data));
      hls.attachMedia(videoRef.current);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        if (videoRef.current) {
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

      // Handle HLS errors
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
              // Try to reinitialize HLS
              if (hlsRef.current) {
                hlsRef.current.destroy();
                hlsRef.current = null;
              }
              break;
          }
        }
      });
    } else if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
      // For Safari with native HLS support - not ideal for data URLs
      alert("Direct streaming may not work in Safari. Please use Chrome or Firefox.");
    }
  };

  // Find the portal target node
  const modalRoot = document.getElementById("modal-root");

  if (!isOpen) return null;

  const content = (
    <div className="hextech-modal-backdrop is-active" onClick={onClose}>
      <div
        className="hextech-modal hextech-modal--primary"
        style={{ maxWidth: "800px" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="hextech-modal__header">
          <h3 className="hextech-modal__title">Direct Stream</h3>
          <button className="hextech-modal__close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>
        <div className="hextech-modal__content">
          <form onSubmit={handleSubmit} className="direct-stream-form">
            <div className="hextech-input-group" style={{ marginBottom: "1rem" }}>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://www.skill-capped.com/lol/browse/course/52mp48wf42/rbqhsjtg89"
                className="hextech-input"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="hextech-button hextech-button--primary"
                style={{ marginLeft: "0.5rem" }}
              >
                Stream
              </button>
            </div>
          </form>

          {status && (
            <div
              className="status-message"
              style={{ textAlign: "center", margin: "0.5rem 0", color: "var(--hextech-color-red)" }}
            >
              {status}
              {isLoading && (
                <div style={{ display: "inline-block", marginLeft: "0.5rem" }}>
                  <div className="spinner"></div>
                </div>
              )}
            </div>
          )}

          {videoVisible && (
            <div className="video-container">
              <video
                ref={videoRef}
                controls
                autoPlay
                playsInline
                className="video-player lol-hextech-player"
                style={{ width: "100%", maxHeight: "500px" }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return modalRoot ? ReactDOM.createPortal(content, modalRoot) : content;
}
