import React, { useEffect, useRef } from "react";
import Hls from "hls.js";
import { Video } from "../model/Video";
import { Course } from "../model/Course";
import { getStreamUrl } from "../utils/UrlUtilities";
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

  useEffect(() => {
    if (!isOpen || !videoRef.current) return;

    // Clean up previous HLS instance if it exists
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    // Initialize HLS if supported
    if (Hls.isSupported()) {
      const hls = new Hls({
        maxBufferSize: 0,
        maxBufferLength: 30,
        startPosition: 0,
      });

      hlsRef.current = hls;

      // Get stream URL from the video object
      const streamUrl = getStreamUrl(video);

      hls.loadSource(streamUrl);
      hls.attachMedia(videoRef.current);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        if (videoRef.current) {
          videoRef.current.play().catch((err) => console.error("Failed to autoplay:", err));
        }
      });

      // Handle HLS errors
      hls.on(Hls.Events.ERROR, (_event: unknown, data: Hls.ErrorData) => {
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
      // For Safari which has native HLS support
      videoRef.current.src = getStreamUrl(video);
      videoRef.current.addEventListener("loadedmetadata", () => {
        videoRef.current?.play().catch((err) => console.error("Failed to autoplay:", err));
      });
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
  }, [isOpen, video, onClose]);

  if (!isOpen) return null;

  return (
    <div className="video-player-overlay">
      <div className="video-player-dialog">
        <div className="video-player-header">
          <h2>{video.title}</h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="video-player-content">
          <video ref={videoRef} controls autoPlay playsInline className="video-player" />
        </div>
      </div>
    </div>
  );
}
