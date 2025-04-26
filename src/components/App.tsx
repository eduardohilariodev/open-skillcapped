import React from "react";
import { Content } from "../model/Content";
import { Router } from "./Router";
import { Bookmark, Bookmarkable } from "../model/Bookmark";
import { LocalStorageBookmarkDatastore } from "../datastore/LocalStorageBookmarkDatastore";
import { BookmarkDatastore } from "../datastore/BookmarkDatastore";
import { WatchStatusDatastore } from "../datastore/WatchStatusDatastore";
import { Watchable, WatchStatus } from "../model/WatchStatus";
import { LocalStorageWatchStatusDatastore } from "../datastore/LocalStorageWatchStatusDatastore";
import * as Sentry from "@sentry/react";
import { Color, Hero, Size } from "./Hero";
import { ManifestLoader } from "../ManifestLoader";
import { Parser } from "../parser/Parser";
import { applyHextechEffects } from "../styles/hextech-index";

// Import Hextech styling
import "../styles/hextech-global.css";
import "../styles/hextech-magic.css";
import "../styles/hextech-animations.css";

export interface AppState {
  content?: Content;
  bookmarkDatastore?: BookmarkDatastore;
  bookmarks: Bookmark[];
  watchStatusesDatastore?: WatchStatusDatastore;
  watchStatuses: WatchStatus[];
  isDownloadEnabled: boolean;
  isTipsModalVisible: boolean;
  isDirectStreamModalVisible: boolean;
}

export default class App extends React.Component<unknown, AppState> {
  constructor(props: unknown) {
    super(props);

    this.state = {
      content: undefined,
      bookmarks: [],
      watchStatuses: [],
      isDownloadEnabled: window.localStorage.getItem("download") === "true" || false,
      isTipsModalVisible: false,
      isDirectStreamModalVisible: false,
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  async componentDidMount(): Promise<undefined> {
    const manifestLoader = new ManifestLoader();
    const manifest = await manifestLoader.load();
    const parser = new Parser();
    const content = parser.parse(manifest);

    const bookmarkDatastore: BookmarkDatastore = new LocalStorageBookmarkDatastore(content);
    const watchStatusesDatastore: WatchStatusDatastore = new LocalStorageWatchStatusDatastore();

    this.setState({
      content: {
        ...content,
        courses: content.courses.sort((left, right) => right.releaseDate.getTime() - left.releaseDate.getTime()),
        videos: content.videos.sort((left, right) => right.releaseDate.getTime() - left.releaseDate.getTime()),
        commentaries: content.commentaries.sort(
          (left, right) => right.releaseDate.getTime() - left.releaseDate.getTime(),
        ),
      },
      bookmarkDatastore,
      watchStatusesDatastore,
      bookmarks: bookmarkDatastore.get(),
      watchStatuses: watchStatusesDatastore.get(),
    });

    // Apply Hextech effects to key UI elements once content is loaded
    this.applyHextechStyling();
  }

  // Apply Hextech styling effects to various UI elements
  applyHextechStyling(): void {
    // Give a small delay to ensure DOM elements are rendered
    setTimeout(() => {
      // Apply energy lines to section containers
      applyHextechEffects(".section", { particles: false, energyLines: true, shimmer: false });

      // Apply shimmer effect to cards
      applyHextechEffects(".card", { particles: false, energyLines: false, shimmer: true });

      // Apply particles to hero sections
      applyHextechEffects(".hero", { particles: true, energyLines: false, shimmer: false });

      // Add shimmer to gold buttons
      applyHextechEffects(".hextech-button.hextech-secondary", { particles: false, energyLines: false, shimmer: true });

      // Add energy lines to main content areas
      applyHextechEffects(".hextech-main-content", { particles: false, energyLines: true, shimmer: false });
    }, 500);
  }

  onToggleWatchStatus(item: Bookmarkable): void {
    const { watchStatusesDatastore, watchStatuses } = this.state;
    const currentWatchStatus = this.getWatchStatus(item, watchStatuses);

    if (watchStatusesDatastore === undefined) {
      console.error("Not ready to toggle yet");
    }

    if (currentWatchStatus !== undefined) {
      watchStatusesDatastore?.remove(currentWatchStatus);
    }

    const newStatus = currentWatchStatus !== undefined ? !currentWatchStatus.isWatched : true;

    watchStatusesDatastore?.add({
      item,
      isWatched: newStatus,
      lastUpdate: new Date(),
    });

    this.setState({
      watchStatuses: watchStatusesDatastore?.get() || [],
    });
  }

  getWatchStatus(item: Bookmarkable, watchStatuses: WatchStatus[]): WatchStatus | undefined {
    return watchStatuses.find((watchStatus) => {
      return watchStatus.item.uuid === item.uuid;
    });
  }

  onToggleTipsModal(): void {
    this.setState((prevState) => {
      return {
        isTipsModalVisible: !prevState.isTipsModalVisible,
      };
    });
  }

  onToggleDirectStreamModal(): void {
    this.setState((prevState) => {
      return {
        isDirectStreamModalVisible: !prevState.isDirectStreamModalVisible,
      };
    });
  }

  onToggleBookmark(item: Bookmarkable): void {
    const { bookmarkDatastore, bookmarks } = this.state;
    const currentBookmark = this.getBookmark(item, bookmarks);

    if (bookmarkDatastore === undefined) {
      console.error("Bookmark datastore not ready yet");
    }

    if (currentBookmark !== undefined) {
      bookmarkDatastore?.remove(currentBookmark);
    } else {
      bookmarkDatastore?.add({
        item,
        date: new Date(),
      });
    }
    this.setState({
      bookmarks: bookmarkDatastore?.get() || [],
    });
  }

  getBookmark(item: Bookmarkable, bookmarks: Bookmark[]): Bookmark | undefined {
    return bookmarks.find((bookmark) => {
      return bookmark.item.uuid === item.uuid;
    });
  }

  isWatched(item: Watchable): boolean {
    return (
      this.state.watchStatuses.find((watchStatuses) => {
        return watchStatuses.item.uuid === item.uuid && watchStatuses.isWatched;
      }) !== undefined
    );
  }

  isBookmarked(item: Bookmarkable): boolean {
    return (
      this.state.bookmarks.find((bookmark) => {
        return bookmark.item.uuid === item.uuid;
      }) !== undefined
    );
  }

  render(): React.ReactNode {
    return (
      <div className="hextech-app">
        <div className="hextech-energy-lines"></div>
        <Sentry.ErrorBoundary
          fallback={<Hero title="Something went wrong" color={Color.STATUS_ERROR} size={Size.FULL} />}
          showDialog={true}
        >
          <Router
            content={this.state.content}
            bookmarks={this.state.bookmarks}
            onToggleBookmark={(item: Bookmarkable) => this.onToggleBookmark(item)}
            watchStatuses={this.state.watchStatuses}
            onToggleWatchStatus={(item: Watchable) => this.onToggleWatchStatus(item)}
            isBookmarked={this.isBookmarked.bind(this)}
            isWatched={this.isWatched.bind(this)}
            isDownloadEnabled={this.state.isDownloadEnabled}
            isTipsModalVisible={this.state.isTipsModalVisible}
            onToggleTipsModal={this.onToggleTipsModal.bind(this)}
            isDirectStreamModalVisible={this.state.isDirectStreamModalVisible}
            onToggleDirectStreamModal={this.onToggleDirectStreamModal.bind(this)}
          />
        </Sentry.ErrorBoundary>
      </div>
    );
  }
}
