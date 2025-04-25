import React from "react";
import { Routes, Route, HashRouter } from "react-router-dom";
import { Content } from "../model/Content";
import { Bookmark, Bookmarkable } from "../model/Bookmark";
import { Watchable, WatchStatus } from "../model/WatchStatus";
import { Color, Hero, Size } from "./Hero";
import { Footer } from "./Footer";
import OmniSearchable from "./omnisearch/OmniSearchable";
import { OmniSearch } from "./omnisearch/OmniSearch";
import * as Sentry from "@sentry/react";
import "./Wrapper.css";

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
  const {
    content,
    onToggleBookmark,
    onToggleWatchStatus,
    isBookmarked,
    isWatched,
    isDownloadEnabled,
  } = props;

  if (content === undefined) {
    return (
      <div className="page-wrapper">
        <div className="content-wrapper">
          <Hero
            title="Loading Better SkillCapped..."
            color={Color.PRIMARY}
            size={Size.MEDIUM}
          />
        </div>
        <Footer />
      </div>
    );
  }

  const courses = content.courses || [];
  const videos = content.videos || [];
  const commentaries = content.commentaries || [];
  let items: OmniSearchable[] = [];
  items = items
    .concat(courses, videos, commentaries)
    .sort(
      (left, right) => right.releaseDate.getTime() - left.releaseDate.getTime()
    );

  return (
    <div className="page-wrapper">
      <div className="content-wrapper">
        <HashRouter>
          <Sentry.ErrorBoundary
            fallback={
              <Hero
                title="Something went wrong"
                color={Color.RED}
                size={Size.FULL}
              />
            }
            showDialog
          >
            <Routes>
              <Route
                path="/"
                element={
                  <OmniSearch
                    items={items}
                    onToggleBookmark={onToggleBookmark}
                    onToggleWatchStatus={onToggleWatchStatus}
                    isWatched={isWatched}
                    isBookmarked={isBookmarked}
                    isDownloadEnabled={isDownloadEnabled}
                    onToggleTipsModal={props.onToggleTipsModal}
                    isTipsModalVisible={props.isTipsModalVisible}
                  />
                }
              />
              <Route
                path="*"
                element={
                  <Hero
                    title="Page Not Found"
                    subtitle="This page doesn't exist"
                    size={Size.FULL}
                    color={Color.RED}
                  />
                }
              />
            </Routes>
          </Sentry.ErrorBoundary>
        </HashRouter>
      </div>
      <Footer />
    </div>
  );
};
