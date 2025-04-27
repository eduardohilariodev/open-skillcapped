import { Video } from "../../model/Video";
import { Course } from "../../model/Course";

// Storage keys
export const STORAGE_KEYS = {
  PLAYBACK_SPEED: "better-skill-capped-playback-speed",
  VIDEO_QUEUE: "better-skill-capped-video-queue",
  AUTOPLAY_ENABLED: "better-skill-capped-autoplay-enabled",
};

// Props for the main video player dialog
export interface VideoPlayerDialogProps {
  video: Video;
  course?: Course;
  isOpen: boolean;
  onClose: () => void;
}

// Props for the video player component
export interface VideoPlayerProps {
  video: Video;
  actualDuration: number | null;
  isLoading: boolean;
  isBuffering: boolean;
  status: string;
  errorMessage: string | null;
  playbackSpeed: number;
  videoRef: React.RefObject<HTMLVideoElement>;
  onPlaybackRateChange: (speed: number) => void;
}

// Props for the video information panel
export interface VideoInfoProps {
  video: Video;
  index?: number;
  actualDuration: number | null;
  autoplayEnabled: boolean;
  playbackSpeed: number;
  currentQueueIndex: number;
  queueLength: number;
  onPlaybackRateChange: (speed: number) => void;
  onAutoplayToggle: () => void;
  onPlayNext: () => void;
  formatDuration: (seconds: number) => string;
}

// Props for the video queue panel
export interface VideoQueueProps {
  title?: string;
  description?: string;
  videos: Video[];
  currentVideo: Video;
  onClose: () => void;
  onVideoSelect: (index: number) => void;
  formatDuration: (seconds: number) => string;
}

// Props for a single video in the queue
export interface VideoQueueItemProps {
  video: Video;
  index: number;
  isActive: boolean;
  onClick: () => void;
  formatDuration: (seconds: number) => string;
}

// Local storage utility functions
export const storageUtils = {
  getItem: (key: string, defaultValue: any) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error getting item from localStorage: ${error}`);
      return defaultValue;
    }
  },

  setItem: (key: string, value: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error setting item in localStorage: ${error}`);
      return false;
    }
  },
};

// Extend HTMLVideoElement type for duration observer
declare global {
  interface HTMLVideoElement {
    _durationObserver?: MutationObserver;
  }
}
