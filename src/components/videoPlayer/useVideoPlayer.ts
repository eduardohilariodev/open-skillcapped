import { useState, useEffect, useRef, useCallback } from "react";
import Hls from "hls.js";
import { Video } from "../../model/Video";
import { STORAGE_KEYS, storageUtils } from "./types";
import { formatDuration } from "./videoDurationUtils";

export function useVideoPlayer(currentVideo: Video, onAutoplayNext: () => void) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [isBuffering, setIsBuffering] = useState(false);

  // Playback speed state
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(() =>
    storageUtils.getItem(STORAGE_KEYS.PLAYBACK_SPEED, 1),
  );

  // Autoplay setting
  const [autoplayEnabled, setAutoplayEnabled] = useState<boolean>(() =>
    storageUtils.getItem(STORAGE_KEYS.AUTOPLAY_ENABLED, true),
  );

  // Apply playback speed when it changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackSpeed;
    }
    storageUtils.setItem(STORAGE_KEYS.PLAYBACK_SPEED, playbackSpeed);
  }, [playbackSpeed]);

  // Handle playback speed change
  const changePlaybackSpeed = useCallback((speed: number) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
    storageUtils.setItem(STORAGE_KEYS.PLAYBACK_SPEED, speed);
  }, []);

  // Toggle autoplay
  const toggleAutoplay = useCallback(() => {
    const newValue = !autoplayEnabled;
    setAutoplayEnabled(newValue);
    storageUtils.setItem(STORAGE_KEYS.AUTOPLAY_ENABLED, newValue);
  }, [autoplayEnabled]);

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
    const handleEndedEvent = () => {
      if (autoplayEnabled) {
        onAutoplayNext();
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
  }, [playbackSpeed, autoplayEnabled, onAutoplayNext]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, []);

  return {
    videoRef,
    hlsRef,
    isBuffering,
    playbackSpeed,
    autoplayEnabled,
    formatDuration,
    changePlaybackSpeed,
    toggleAutoplay,
  };
}
