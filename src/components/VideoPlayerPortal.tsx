import React, { createContext, useContext, useState } from "react";
import { VideoPlayerDialog } from "./VideoPlayerDialog";
import { Video } from "../model/Video";
import { Course } from "../model/Course";

// Define the context interface
interface VideoPlayerContextType {
  showVideoPlayer: (video: Video, course?: Course) => void;
  closeVideoPlayer: () => void;
}

// Create the context with a default value
const VideoPlayerContext = createContext<VideoPlayerContextType>({
  showVideoPlayer: () => {},
  closeVideoPlayer: () => {},
});

// Create a provider component to handle state
export function VideoPlayerProvider({ children }: { children: React.ReactNode }): React.ReactElement {
  const [isOpen, setIsOpen] = useState(false);
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);
  const [currentCourse, setCurrentCourse] = useState<Course | undefined>(undefined);

  const showVideoPlayer = (video: Video, course?: Course) => {
    setCurrentVideo(video);
    setCurrentCourse(course);
    setIsOpen(true);
  };

  const closeVideoPlayer = () => {
    setIsOpen(false);
  };

  return (
    <VideoPlayerContext.Provider value={{ showVideoPlayer, closeVideoPlayer }}>
      {children}
      {/* Render the dialog at the end of the provider to ensure it's not nested */}
      {currentVideo && (
        <VideoPlayerDialog video={currentVideo} course={currentCourse} isOpen={isOpen} onClose={closeVideoPlayer} />
      )}
    </VideoPlayerContext.Provider>
  );
}

// Create a hook to make it easy to use the context
export function useVideoPlayer(): VideoPlayerContextType {
  return useContext(VideoPlayerContext);
}

// Create a component that renders the provider at the app root level
export function VideoPlayerPortal(): React.ReactElement {
  // This component doesn't need children, it just renders the provider at the root
  // It's used as a container for the VideoPlayerDialog rendered through context
  return <div id="video-player-portal"></div>;
}

// Wrap the App component with the provider
export function withVideoPlayerProvider<P extends object>(Component: React.ComponentType<P>): React.FC<P> {
  return function WithVideoPlayerProvider(props: P) {
    return (
      <VideoPlayerProvider>
        <Component {...props} />
      </VideoPlayerProvider>
    );
  };
}
