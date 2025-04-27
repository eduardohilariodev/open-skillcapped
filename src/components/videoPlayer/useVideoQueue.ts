import { useState, useEffect, useCallback } from "react";
import { Video } from "../../model/Video";
import { Course } from "../../model/Course";
import { STORAGE_KEYS, storageUtils } from "./types";

export function useVideoQueue(initialVideo: Video, course?: Course) {
  // Video queue state
  const [videoQueue, setVideoQueue] = useState<Video[]>(() => storageUtils.getItem(STORAGE_KEYS.VIDEO_QUEUE, []));
  const [currentQueueIndex, setCurrentQueueIndex] = useState(-1);
  const [currentVideo, setCurrentVideo] = useState<Video>(initialVideo);

  // Get display queue (from course if available, or from general queue)
  const displayQueue = course?.videos ? course.videos.map((cv) => cv.video) : videoQueue;

  // Add a video to the queue
  const addToQueue = useCallback(
    (videoToAdd: Video) => {
      const newQueue = [...videoQueue];
      if (newQueue.some((v) => v.uuid === videoToAdd.uuid)) {
        return;
      }
      newQueue.push(videoToAdd);
      setVideoQueue(newQueue);
      storageUtils.setItem(STORAGE_KEYS.VIDEO_QUEUE, newQueue);
    },
    [videoQueue],
  );

  // Initialize queue with the initial video
  useEffect(() => {
    setCurrentVideo(initialVideo);
  }, [initialVideo]);

  // Add video to queue when opened if not in a course
  useEffect(() => {
    if (!initialVideo) {
      return;
    }

    if (!course && !videoQueue.some((v) => v.uuid === initialVideo.uuid)) {
      addToQueue(initialVideo);
    }

    const index = displayQueue.findIndex((v) => v.uuid === initialVideo.uuid);
    if (index !== -1) {
      setCurrentQueueIndex(index);
    }
  }, [initialVideo, videoQueue.length, displayQueue, course, addToQueue]);

  // Find video index in course videos
  const getVideoIndex = useCallback((): number | undefined => {
    if (!course || !course.videos) return undefined;
    const index = course.videos.findIndex((cv) => cv.video.uuid === currentVideo.uuid);
    return index === -1 ? undefined : index + 1;
  }, [course, currentVideo]);

  return {
    videoQueue,
    displayQueue,
    currentQueueIndex,
    currentVideo,
    setCurrentVideo,
    setCurrentQueueIndex,
    addToQueue,
    getVideoIndex,
  };
}
