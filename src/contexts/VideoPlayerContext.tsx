import { createContext, useContext, useState, ReactNode } from "react";
import { Video } from "../model/Video";
import { Course } from "../model/Course";
import { VideoPlayerDialog } from "../components/VideoPlayerDialog";

// Define the context type
interface VideoPlayerContextType {
  currentVideo: Video | null;
  currentCourse: Course | null;
  isOpen: boolean;
  openVideo: (video: Video, course?: Course) => void;
  closeVideo: () => void;
}

// Create the context with a default value
const VideoPlayerContext = createContext<VideoPlayerContextType>({
  currentVideo: null,
  currentCourse: null,
  isOpen: false,
  openVideo: () => {},
  closeVideo: () => {},
});

// Hook for components to use the context
export const useVideoPlayer = () => useContext(VideoPlayerContext);

// Provider component to wrap the app
export function VideoPlayerProvider({ children }: { children: ReactNode }) {
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);
  const [currentCourse, setCurrentCourse] = useState<Course | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const openVideo = (video: Video, course?: Course) => {
    setCurrentVideo(video);
    setCurrentCourse(course || null);
    setIsOpen(true);
  };

  const closeVideo = () => {
    setIsOpen(false);
  };

  return (
    <VideoPlayerContext.Provider
      value={{
        currentVideo,
        currentCourse,
        isOpen,
        openVideo,
        closeVideo,
      }}
    >
      {children}
      {currentVideo && (
        <VideoPlayerDialog
          video={currentVideo}
          course={currentCourse || undefined}
          isOpen={isOpen}
          onClose={closeVideo}
        />
      )}
    </VideoPlayerContext.Provider>
  );
}
