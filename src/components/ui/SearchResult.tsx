import React from "react";
import Button from "./Button";

export type SearchResultVariant = "gold" | "blue" | "dark" | "course" | "commentary" | "video";

export interface SearchResultProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /**
   * Title of the search result
   */
  title: React.ReactNode;

  /**
   * Description/snippet for the search result
   */
  description?: React.ReactNode;

  /**
   * Image URL to display
   */
  imageUrl?: string;

  /**
   * Alt text for the image
   */
  imageAlt?: string;

  /**
   * Meta information to display (e.g., champion, patch, etc.)
   */
  meta?: Array<{
    label: string;
    value: React.ReactNode;
  }>;

  /**
   * Visual variant/color of the search result
   */
  variant?: SearchResultVariant;

  /**
   * Primary action button text
   */
  primaryAction?: string;

  /**
   * Primary action handler
   */
  onPrimaryAction?: () => void;

  /**
   * Secondary action button text
   */
  secondaryAction?: string;

  /**
   * Secondary action handler
   */
  onSecondaryAction?: () => void;

  /**
   * Whether this search result is highlighted
   */
  highlight?: boolean;

  /**
   * Additional CSS class names
   */
  className?: string;
}

export const SearchResult: React.FC<SearchResultProps> = ({
  title,
  description,
  imageUrl,
  imageAlt,
  meta,
  variant = "gold",
  primaryAction,
  onPrimaryAction,
  secondaryAction,
  onSecondaryAction,
  highlight = false,
  className = "",
  ...props
}) => {
  const searchResultClasses = [
    "hextech-card",
    "hextech-search-result",
    `hextech-card--${variant}`,
    highlight ? "hextech-search-result--highlight" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={searchResultClasses} {...props}>
      {imageUrl && (
        <div className="hextech-search-result__image">
          <img src={imageUrl} alt={imageAlt || String(title) || ""} />
        </div>
      )}

      <div className="hextech-search-result__content">
        <h3 className="hextech-search-result__title">{title}</h3>

        {meta && meta.length > 0 && (
          <div className="hextech-search-result__meta">
            {meta.map((item, index) => (
              <div key={index} className="hextech-card__meta-item">
                <span className="hextech-card__meta-item-icon">{item.label}:</span>
                <span>{item.value}</span>
              </div>
            ))}
          </div>
        )}

        {description && <div className="hextech-search-result__description">{description}</div>}

        {(primaryAction || secondaryAction) && (
          <div className="hextech-search-result__actions">
            {secondaryAction && (
              <Button variant="utility" size="sm" onClick={onSecondaryAction}>
                {secondaryAction}
              </Button>
            )}

            {primaryAction && (
              <Button
                variant={
                  variant === "blue" || variant === "video"
                    ? "primary"
                    : variant === "course"
                      ? "secondary"
                      : variant === "commentary"
                        ? "utility"
                        : "secondary"
                }
                size="sm"
                onClick={onPrimaryAction}
              >
                {primaryAction}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResult;
