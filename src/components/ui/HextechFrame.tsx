import React from "react";

export type FrameVariant = "gold" | "blue" | "dark";

export interface HextechFrameProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /**
   * Frame variant - color scheme
   */
  variant?: FrameVariant;

  /**
   * Frame title (optional)
   */
  title?: React.ReactNode;

  /**
   * Whether the frame is interactive (adds hover effects)
   */
  interactive?: boolean;

  /**
   * Whether to add shimmer effect on hover
   */
  shimmer?: boolean;

  /**
   * Additional CSS class names
   */
  className?: string;

  /**
   * Frame content
   */
  children: React.ReactNode;
}

export const HextechFrame: React.FC<HextechFrameProps> = ({
  variant = "gold",
  title,
  interactive = false,
  shimmer = false,
  className = "",
  children,
  ...props
}) => {
  const frameClasses = [
    "hextech-frame",
    `hextech-frame--${variant}`,
    interactive ? "hextech-frame--interactive" : "",
    shimmer ? "hextech-frame--shimmer" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={frameClasses} {...props}>
      {title && <div className="hextech-frame__title">{title}</div>}
      <div className="hextech-frame__content">{children}</div>
    </div>
  );
};

export default HextechFrame;
