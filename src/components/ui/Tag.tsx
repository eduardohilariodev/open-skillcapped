import React from "react";

export type TagVariant = "gold" | "blue" | "dark" | "red" | "green";
export type TagSize = "small" | "medium" | "large";

export interface TagProps {
  /**
   * Tag label content
   */
  label: React.ReactNode;

  /**
   * Visual variant/color of the tag
   */
  variant?: TagVariant;

  /**
   * Size of the tag
   */
  size?: TagSize;

  /**
   * Whether the tag is removable (shows 'x' button)
   */
  removable?: boolean;

  /**
   * Callback when remove button is clicked
   */
  onRemove?: () => void;

  /**
   * Whether the tag is active/selected
   */
  isActive?: boolean;

  /**
   * Whether the tag is disabled
   */
  isDisabled?: boolean;

  /**
   * Optional icon to display before the label
   */
  icon?: React.ReactNode;

  /**
   * Additional CSS class names
   */
  className?: string;

  /**
   * Click handler for the tag
   */
  onClick?: React.MouseEventHandler<HTMLSpanElement>;
}

export const Tag: React.FC<TagProps> = ({
  label,
  variant = "gold",
  size = "medium",
  removable = false,
  onRemove,
  isActive = false,
  isDisabled = false,
  icon,
  className = "",
  onClick,
  ...props
}) => {
  const handleRemoveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onRemove && !isDisabled) {
      onRemove();
    }
  };

  const tagClasses = [
    "hextech-tag",
    `hextech-tag--${variant}`,
    `hextech-tag--${size}`,
    isActive ? "hextech-tag--active" : "",
    isDisabled ? "hextech-tag--disabled" : "",
    onClick && !isDisabled ? "hextech-tag--clickable" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span
      className={tagClasses}
      onClick={isDisabled ? undefined : onClick}
      role={onClick && !isDisabled ? "button" : undefined}
      tabIndex={onClick && !isDisabled ? 0 : undefined}
      {...props}
    >
      {icon && <span className="hextech-tag__icon">{icon}</span>}
      <span className="hextech-tag__label">{label}</span>
      {removable && !isDisabled && (
        <button type="button" className="hextech-tag__remove" onClick={handleRemoveClick} aria-label="Remove tag">
          ×
        </button>
      )}
    </span>
  );
};

export default Tag;
