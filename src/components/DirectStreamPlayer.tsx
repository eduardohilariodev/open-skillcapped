import React, { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import Hls from "hls.js";
import { VideoUtils } from "../utils/VideoUtils";
import "./VideoPlayerDialog.css"; // Reusing existing styles

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
          videoRef.current.play().catch((err) => console.error("Failed to autoplay:", err));
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
    <div className="video-player-overlay" onClick={onClose}>
      <div className="video-player-dialog" style={{ maxWidth: "800px" }} onClick={(e) => e.stopPropagation()}>
        <div className="video-player-header">
          <h2>Direct Stream</h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="video-player-content">
          <form onSubmit={handleSubmit} style={{ marginBottom: "1rem" }}>
            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://www.skill-capped.com/lol/browse/course/52mp48wf42/rbqhsjtg89"
                style={{
                  flex: 1,
                  padding: "0.5rem",
                  borderRadius: "0.25rem",
                  border: "1px solid #333",
                  backgroundColor: "#111",
                  color: "white",
                }}
              />
              <button
                type="submit"
                disabled={isLoading}
                style={{
                  padding: "0.5rem 1rem",
                  backgroundColor: "#e53e3e",
                  color: "white",
                  border: "none",
                  borderRadius: "0.25rem",
                  cursor: isLoading ? "not-allowed" : "pointer",
                }}
              >
                Stream
              </button>
            </div>
          </form>

          {status && (
            <div style={{ textAlign: "center", margin: "0.5rem 0", color: "#e53e3e" }}>
              {status}
              {isLoading && (
                <div style={{ display: "inline-block", marginLeft: "0.5rem" }}>
                  <div className="spinner"></div>
                </div>
              )}
            </div>
          )}

          {videoVisible && (
            <div>
              <video
                ref={videoRef}
                controls
                autoPlay
                playsInline
                className="video-player"
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
