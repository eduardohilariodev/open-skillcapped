import React from "react";

export type CardVariant = "gold" | "blue" | "dark";

export interface CardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /**
   * Card title
   */
  title?: React.ReactNode;

  /**
   * Visual variant/color of the card
   */
  variant?: CardVariant;

  /**
   * Whether the card is interactive (clickable)
   */
  interactive?: boolean;

  /**
   * Image URL to display in the card header
   */
  imageUrl?: string;

  /**
   * Image alt text
   */
  imageAlt?: string;

  /**
   * Overlay text for the image
   */
  imageOverlay?: React.ReactNode;

  /**
   * Footer content
   */
  footer?: React.ReactNode;

  /**
   * Meta information to display
   */
  meta?: Array<{
    icon?: React.ReactNode;
    text: React.ReactNode;
  }>;

  /**
   * Additional CSS class names
   */
  className?: string;

  /**
   * Card content
   */
  children: React.ReactNode;

  /**
   * Click handler
   */
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

export const Card: React.FC<CardProps> = ({
  title,
  variant = "gold",
  interactive = false,
  imageUrl,
  imageAlt,
  imageOverlay,
  footer,
  meta,
  className = "",
  children,
  onClick,
  ...props
}) => {
  const cardClasses = [
    "hextech-card",
    `hextech-card--${variant}`,
    interactive ? "hextech-card--interactive" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={cardClasses}
      onClick={interactive ? onClick : undefined}
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      {...props}
    >
      {title && (
        <div className="hextech-card__header">
          <h3 className="hextech-card__title">{title}</h3>
        </div>
      )}

      {imageUrl && (
        <div className="hextech-card__media">
          <img src={imageUrl} alt={imageAlt || ""} />
          {imageOverlay && <div className="hextech-card__media-overlay">{imageOverlay}</div>}
        </div>
      )}

      <div className="hextech-card__content">
        {meta && meta.length > 0 && (
          <div className="hextech-card__meta">
            {meta.map((item, index) => (
              <div key={index} className="hextech-card__meta-item">
                {item.icon && <span className="hextech-card__meta-item-icon">{item.icon}</span>}
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        )}

        <div className="hextech-card__description">{children}</div>

        {footer && <div className="hextech-card__footer">{footer}</div>}
      </div>
    </div>
  );
};

export default Card;
