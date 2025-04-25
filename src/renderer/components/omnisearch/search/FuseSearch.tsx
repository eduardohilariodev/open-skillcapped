import React, { useEffect, useState } from "react";
import Fuse from "fuse.js";

export interface FuseSearchProps<T> {
  query: string;
  items: T[];
  options: Fuse.IFuseOptions<T>;
  render: (item: {
    item: T;
    matchedStrings: Record<string, string[]>;
  }) => React.ReactNode;
  itemsPerPage: number;
  page: number;
  onResultsUpdate?: (results: T[]) => void;
}

export default function FuseSearch<T>({
  query,
  items,
  options,
  render,
  itemsPerPage,
  page,
  onResultsUpdate,
}: FuseSearchProps<T>): React.ReactElement {
  const [fuse] = useState<Fuse<T>>(new Fuse(items, options));
  const [results, setResults] = useState<
    { item: T; matches?: readonly Fuse.FuseResultMatch[] }[]
  >([]);

  useEffect(() => {
    fuse.setCollection(items);
  }, [fuse, items]);

  useEffect(() => {
    // Search and handle pagination
    const searchResults = query
      ? fuse.search(query)
      : items.map((item) => ({ item }));

    if (onResultsUpdate) {
      onResultsUpdate(searchResults.map((result) => result.item));
    }

    setResults(searchResults);
  }, [query, fuse, items, onResultsUpdate]);

  const paginatedResults = results.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <div className="content">
      {paginatedResults.length > 0 ? (
        paginatedResults.map((result, index) => {
          const matchedStrings: Record<string, string[]> = {};

          // Extract matched strings from Fuse.js result
          if (result.matches) {
            result.matches.forEach((match) => {
              if (match.key) {
                const indices = match.indices;
                const text = match.value || "";

                if (!matchedStrings[match.key]) {
                  matchedStrings[match.key] = [];
                }

                indices.forEach((range) => {
                  const [start, end] = range;
                  const highlightedText = text.substring(start, end + 1);
                  if (
                    !matchedStrings[match.key as string].includes(
                      highlightedText
                    )
                  ) {
                    matchedStrings[match.key as string].push(highlightedText);
                  }
                });
              }
            });
          }

          return render({
            item: result.item,
            matchedStrings,
          });
        })
      ) : (
        <div className="notification is-warning">No results found</div>
      )}
    </div>
  );
}
