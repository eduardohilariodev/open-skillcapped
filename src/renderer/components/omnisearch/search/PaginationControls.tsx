import React from "react";

export interface PaginationControlsProps {
  currentPage: number;
  lastPage: number;
  onPageChange: (newPage: number) => void;
}

export default function PaginationControls({
  currentPage,
  lastPage,
  onPageChange,
}: PaginationControlsProps): React.ReactElement | null {
  if (lastPage <= 1) {
    return null;
  }

  return (
    <nav
      className="pagination"
      role="navigation"
      aria-label="pagination"
    >
      <button
        className="pagination-previous"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </button>

      <button
        className="pagination-next"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= lastPage}
      >
        Next
      </button>

      <ul className="pagination-list">
        {Array.from({ length: lastPage }, (_, i) => {
          const page = i + 1;

          // Only show few pages before and after current page to avoid cluttering
          if (
            page === 1 ||
            page === lastPage ||
            (page >= currentPage - 2 && page <= currentPage + 2)
          ) {
            return (
              <li key={page}>
                <button
                  className={`pagination-link ${
                    page === currentPage ? "is-current" : ""
                  }`}
                  aria-label={`Go to page ${page}`}
                  onClick={() => onPageChange(page)}
                >
                  {page}
                </button>
              </li>
            );
          }

          // Show ellipsis for skipped pages
          if (page === 2 || page === lastPage - 1) {
            return (
              <li key={`ellipsis-${page}`}>
                <span className="pagination-ellipsis">&hellip;</span>
              </li>
            );
          }

          return null;
        })}
      </ul>
    </nav>
  );
}
