import React, { useCallback, useEffect } from "react";
import ReactDOM from "react-dom";
import { VideoPlayerDialogProps } from "./types";
import { VideoPlayer } from "./VideoPlayer";
import { VideoInfo } from "./VideoInfo";
import { VideoQueue } from "./VideoQueue";
import { useVideoStream } from "./useVideoStream";
import { useVideoQueue } from "./useVideoQueue";
import { useVideoPlayer } from "./useVideoPlayer";
import { VideoUtils } from "../../utils/VideoUtils";
import "../../styles/components/_button.css";
import "../../styles/components/_modal.css";
import "../../styles/components/_tag.css";
import "../../styles/VideoPlayerDialog.css";

export function VideoPlayerDialog({
  video: initialVideo,
  course,
  isOpen,
  onClose,
}: VideoPlayerDialogProps): React.ReactElement | null {
  // Initialize hooks
  const {
    videoQueue,
    displayQueue,
    currentQueueIndex,
    currentVideo,
    setCurrentVideo,
    setCurrentQueueIndex,
    getVideoIndex,
  } = useVideoQueue(initialVideo, course);

  const { isLoading, status, errorMessage, actualDuration, setupStreamForVideo } = useVideoStream();

  // Handle autoplay next
  const handleAutoplayNext = useCallback(() => {
    // Check if we're in a course or in the queue
    if (course?.videos) {
      const currentIndex = course.videos.findIndex((cv) => cv.video.uuid === currentVideo.uuid);
      if (currentIndex !== -1 && currentIndex < course.videos.length - 1) {
        // Play the next video in the course
        playQueueItem(currentIndex + 1);
      }
    } else if (displayQueue.length > 0) {
      // Handle general queue
      const queueIndex =
        currentQueueIndex >= 0 ? currentQueueIndex : displayQueue.findIndex((v) => v.uuid === currentVideo.uuid);
      if (queueIndex !== -1 && queueIndex < displayQueue.length - 1) {
        playQueueItem(queueIndex + 1);
      }
    }
  }, [course, currentVideo, displayQueue, currentQueueIndex]);

  const {
    videoRef,
    hlsRef,
    isBuffering,
    playbackSpeed,
    autoplayEnabled,
    formatDuration,
    changePlaybackSpeed,
    toggleAutoplay,
  } = useVideoPlayer(currentVideo, handleAutoplayNext);

  // Play a specific item in the queue
  const playQueueItem = useCallback(
    async (index: number) => {
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

      await setupStreamForVideo(videoToPlay, videoRef, hlsRef, playbackSpeed);
    },
    [displayQueue, setupStreamForVideo, videoRef, hlsRef, playbackSpeed, setCurrentQueueIndex, setCurrentVideo],
  );

  // Play next/previous video in queue
  const playNextInQueue = useCallback(async () => {
    if (currentQueueIndex >= 0 && currentQueueIndex < displayQueue.length - 1) {
      await playQueueItem(currentQueueIndex + 1);
    }
  }, [currentQueueIndex, displayQueue.length, playQueueItem]);

  const playPreviousInQueue = useCallback(async () => {
    if (currentQueueIndex > 0) {
      await playQueueItem(currentQueueIndex - 1);
    }
  }, [currentQueueIndex, playQueueItem]);

  // Initialize VideoUtils error silencer when dialog opens
  useEffect(() => {
    if (isOpen) {
      VideoUtils.silenceCORSErrors();
    }
  }, [isOpen]);

  // Play video when dialog opens and handle keyboard shortcuts
  useEffect(() => {
    if (!(isOpen && initialVideo)) {
      return;
    }

    // Define the async function inside useEffect
    const loadVideo = async () => {
      await setupStreamForVideo(initialVideo, videoRef, hlsRef, playbackSpeed);
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
  }, [
    isOpen,
    initialVideo,
    onClose,
    setupStreamForVideo,
    videoRef,
    hlsRef,
    playbackSpeed,
    playNextInQueue,
    playPreviousInQueue,
  ]);

  // Handle backdrop clicks
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Stop event propagation for the dialog content
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
          <VideoPlayer
            video={currentVideo}
            actualDuration={actualDuration}
            isLoading={isLoading}
            isBuffering={isBuffering}
            status={status}
            errorMessage={errorMessage}
            playbackSpeed={playbackSpeed}
            videoRef={videoRef}
            onPlaybackRateChange={changePlaybackSpeed}
          />

          {/* Video info area */}
          <VideoInfo
            video={currentVideo}
            index={getVideoIndex()}
            actualDuration={actualDuration}
            autoplayEnabled={autoplayEnabled}
            playbackSpeed={playbackSpeed}
            currentQueueIndex={currentQueueIndex}
            queueLength={displayQueue.length}
            onPlaybackRateChange={changePlaybackSpeed}
            onAutoplayToggle={toggleAutoplay}
            onPlayNext={playNextInQueue}
            formatDuration={formatDuration}
          />
        </div>

        {/* Right panel - Course info and list */}
        <VideoQueue
          title={course?.title}
          description={course?.description}
          videos={displayQueue}
          currentVideo={currentVideo}
          onClose={onClose}
          onVideoSelect={playQueueItem}
          formatDuration={formatDuration}
        />
      </div>
    </div>,
    currentModalRoot,
  );
}
