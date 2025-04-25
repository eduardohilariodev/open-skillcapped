import React from "react";
import { Routes, Route, HashRouter } from "react-router-dom";
import { Content } from "../model/Content";
import { Bookmark, Bookmarkable } from "../model/Bookmark";
import { Watchable, WatchStatus } from "../model/WatchStatus";
import { Color, Hero, Size } from "./Hero";

interface RouterProps {
  content?: Content;
  bookmarks: Bookmark[];
  onToggleBookmark: (item: Bookmarkable) => void;
  watchStatuses: WatchStatus[];
  onToggleWatchStatus: (item: Watchable) => void;
  isBookmarked: (item: Bookmarkable) => boolean;
  isWatched: (item: Watchable) => boolean;
  isDownloadEnabled: boolean;
  isTipsModalVisible: boolean;
  onToggleTipsModal: () => void;
}

export const Router: React.FC<RouterProps> = (props: RouterProps) => {
  if (props.content === undefined) {
    return (
      <div className="container">
        <Hero
          title="Loading Better SkillCapped..."
          color={Color.PRIMARY}
          size={Size.MEDIUM}
        />
      </div>
    );
  }

  // Use HashRouter for Electron apps to avoid file path issues
  return (
    <HashRouter>
      <div className="container">
        <Routes>
          <Route
            path="/"
            element={
              <Hero
                title="Welcome to Open SkillCapped"
                subtitle="Navigate through the app to watch and download SkillCapped videos"
                color={Color.PRIMARY}
                size={Size.MEDIUM}
              />
            }
          />
          {/* Add more routes here as needed */}
        </Routes>
      </div>
    </HashRouter>
  );
}; 
