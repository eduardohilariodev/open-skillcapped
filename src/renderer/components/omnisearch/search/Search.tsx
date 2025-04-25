import React, { useState } from "react";
import PaginatedFuseSearch from "./PaginatedFuseSearch";
import { Bookmarkable } from "../../../model/Bookmark";
import { Watchable } from "../../../model/WatchStatus";
import OmniSearchable from "../OmniSearchable";

export interface SearchProps<T> {
  items: T[];
  fuseOptions: any;
  render: (item: {
    item: T;
    matchedStrings: Record<string, string[]>;
  }) => React.ReactNode;
  itemsPerPage: number;
  isBookmarked: (item: Bookmarkable) => boolean;
  isWatched: (item: Watchable) => boolean;
  searchBarPlaceholder: string;
}

export default function Search<T extends OmniSearchable>({
  items,
  fuseOptions,
  render,
  itemsPerPage,
  isBookmarked,
  isWatched,
  searchBarPlaceholder,
}: SearchProps<T>): React.ReactElement {
  const [query, setQuery] = useState("");
  const [showOnlyBookmarked, setShowOnlyBookmarked] = useState(false);
  const [showOnlyWatched, setShowOnlyWatched] = useState(false);

  const filteredItems = items.filter((item) => {
    const bookmarkCriteriaMet = !showOnlyBookmarked || isBookmarked(item);
    const watchCriteriaMet = !showOnlyWatched || isWatched(item);

    return bookmarkCriteriaMet && watchCriteriaMet;
  });

  return (
    <React.Fragment>
      <div className="field">
        <div className="control">
          <input
            className="input"
            type="text"
            placeholder={searchBarPlaceholder}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
      </div>

      <div className="field">
        <div className="control">
          <label className="checkbox">
            <input
              type="checkbox"
              checked={showOnlyBookmarked}
              onChange={() => setShowOnlyBookmarked(!showOnlyBookmarked)}
            />
            <span className="ml-2">Show only bookmarked</span>
          </label>
        </div>
      </div>

      <div className="field mb-5">
        <div className="control">
          <label className="checkbox">
            <input
              type="checkbox"
              checked={showOnlyWatched}
              onChange={() => setShowOnlyWatched(!showOnlyWatched)}
            />
            <span className="ml-2">Show only watched</span>
          </label>
        </div>
      </div>

      <PaginatedFuseSearch
        query={query}
        items={filteredItems}
        fuseOptions={fuseOptions}
        render={render}
        itemsPerPage={itemsPerPage}
      />
    </React.Fragment>
  );
}
