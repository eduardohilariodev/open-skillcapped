import React from "react";
import { Bookmarkable } from "../../model/Bookmark";
import { Watchable } from "../../model/WatchStatus";
import Search from "./search/Search";
import OmniSearchable, { searchableFields } from "./OmniSearchable";
import { OmniSearchResult } from "./OmniSearchResult";
import { Container } from "../Container";
import { Hero, Color, Size } from "../Hero";

export interface OmniSearchProps {
  items: OmniSearchable[];
  isWatched: (item: Watchable) => boolean;
  isBookmarked: (item: Bookmarkable) => boolean;
  onToggleBookmark: (item: Bookmarkable) => void;
  onToggleWatchStatus: (item: Watchable) => void;
  isDownloadEnabled: boolean;
  onToggleTipsModal: () => void;
  isTipsModalVisible: boolean;
}

export function OmniSearch({
  items,
  isWatched,
  isBookmarked,
  onToggleBookmark,
  onToggleWatchStatus,
  isDownloadEnabled,
}: OmniSearchProps): React.ReactElement {
  const fuseOptions = {
    keys: searchableFields,
    minMatchCharLength: 2,
    threshold: 0.3,
    useExtendedSearch: true,
    includeMatches: true,
    ignoreLocation: true,
    includeScore: true,
  };

  if (items.length === 0) {
    return (
      <Container>
        <Hero
          title="Content Loaded Successfully"
          subtitle="0 items available. Search functionality coming soon."
          color={Color.PRIMARY}
          size={Size.MEDIUM}
        />
      </Container>
    );
  }

  return (
    <>
      <Search
        items={items}
        fuseOptions={fuseOptions}
        render={(item) => (
          <OmniSearchResult
            key={item.item.uuid}
            item={item.item}
            isWatched={isWatched}
            isBookmarked={isBookmarked}
            onToggleBookmark={onToggleBookmark}
            onToggleWatchStatus={onToggleWatchStatus}
            matchedStrings={item.matchedStrings}
            isDownloadEnabled={isDownloadEnabled}
          />
        )}
        itemsPerPage={20}
        isBookmarked={isBookmarked}
        isWatched={isWatched}
        searchBarPlaceholder="Search for courses, videos, or game commentary"
      />
    </>
  );
}
