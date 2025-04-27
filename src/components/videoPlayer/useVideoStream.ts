import { useState, useCallback } from "react";
import Hls from "hls.js";
import { Video } from "../../model/Video";
import { VideoUtils } from "../../utils/VideoUtils";
import { patchVideoDuration } from "./videoDurationUtils";

export function useVideoStream() {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [actualDuration, setActualDuration] = useState<number | null>(null);

  const setupStreamForVideo = useCallback(
    async (
      videoToPlay: Video,
      videoRef: React.RefObject<HTMLVideoElement>,
      hlsRef: React.RefObject<Hls | null>,
      playbackSpeed: number,
    ) => {
      if (!videoRef.current) return;

      try {
        setIsLoading(true);
        setErrorMessage(null);
        setStatus("Preparing stream...");

        const videoId = videoToPlay.uuid;

        // Use the known duration directly
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

        // Store the expected duration for reference
        if (videoRef.current) {
          videoRef.current.dataset.expectedDuration = exactDuration.toString();

          // Apply the duration patch as early as possible
          patchVideoDuration(videoRef.current, exactDuration);
        }

        // Generate M3U8 data
        const m3u8Data = VideoUtils.generateM3U8(videoId, lastPart);

        // Clean up previous HLS instance
        if (hlsRef.current) {
          hlsRef.current.destroy();
          // Use Object.assign to modify the ref value instead of direct assignment
          Object.assign(hlsRef, { current: null });
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

          // Use Object.assign to modify the ref value instead of direct assignment
          Object.assign(hlsRef, { current: hls });

          // Load M3U8 content directly with Base64 encoding
          hls.loadSource(`data:application/x-mpegURL;base64,${btoa(m3u8Data)}`);
          hls.attachMedia(videoRef.current);

          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            if (!videoRef.current) {
              return;
            }

            // Set the known duration
            if (exactDuration) {
              patchVideoDuration(videoRef.current, exactDuration);
            }

            // Apply playback speed
            videoRef.current.playbackRate = playbackSpeed;
            setStatus("Video ready. Click play to start.");
          });

          // Clear errors when video loads successfully
          hls.on(Hls.Events.FRAG_LOADED, () => {
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

            // Apply the known duration directly
            if (exactDuration) {
              patchVideoDuration(videoRef.current, exactDuration);
            }

            videoRef.current.playbackRate = playbackSpeed;
            setStatus("Video ready. Click play to start.");
          });
        }

        setStatus("");
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : "Unknown error occurred");
        console.error("Stream setup error:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  return {
    isLoading,
    status,
    errorMessage,
    actualDuration,
    setupStreamForVideo,
    setIsLoading,
    setStatus,
    setErrorMessage,
    setActualDuration,
  };
}
