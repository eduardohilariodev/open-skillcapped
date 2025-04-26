import React from "react";

export type GridGap = "none" | "sm" | "md" | "lg";
export type GridLayout = "auto-fit" | "auto-fill" | "2-cols" | "3-cols" | "4-cols";
export type GridAlignment = "center" | "start" | "end";

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Grid gap size
   */
  gap?: GridGap;

  /**
   * Predefined grid layout
   */
  layout?: GridLayout;

  /**
   * Vertical alignment of grid items
   */
  alignItems?: GridAlignment;

  /**
   * Horizontal alignment of grid items
   */
  justifyItems?: GridAlignment;

  /**
   * Additional CSS class names
   */
  className?: string;

  /**
   * Grid cell content
   */
  children: React.ReactNode;
}

export interface GridItemProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Number of columns to span on small screens (1-12)
   */
  sm?: number;

  /**
   * Number of columns to span on medium screens (1-12)
   */
  md?: number;

  /**
   * Number of columns to span on large screens (1-12)
   */
  lg?: number;

  /**
   * Column to start from (1-12)
   */
  start?: number;

  /**
   * Number of rows to span (1-6)
   */
  rowSpan?: number;

  /**
   * Additional CSS class names
   */
  className?: string;

  /**
   * Grid item content
   */
  children: React.ReactNode;
}

// Defining the GridComponent type that includes the Item property
type GridComponent = React.FC<GridProps> & {
  Item: React.FC<GridItemProps>;
};

export const GridItem: React.FC<GridItemProps> = ({
  sm,
  md,
  lg,
  start,
  rowSpan,
  className = "",
  children,
  ...props
}) => {
  const gridItemClasses = [
    "hextech-grid__item",
    sm ? `hextech-grid__item--sm-${sm}` : "",
    md ? `hextech-grid__item--md-${md}` : "",
    lg ? `hextech-grid__item--lg-${lg}` : "",
    start ? `hextech-grid__item--start-${start}` : "",
    rowSpan ? `hextech-grid__item--row-span-${rowSpan}` : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={gridItemClasses} {...props}>
      {children}
    </div>
  );
};

export const Grid: GridComponent = ({
  gap = "md",
  layout,
  alignItems,
  justifyItems,
  className = "",
  children,
  ...props
}) => {
  const gridClasses = [
    "hextech-grid",
    gap !== "md" ? `hextech-grid--gap-${gap}` : "",
    layout ? `hextech-grid--${layout}` : "",
    alignItems ? `hextech-grid--align-${alignItems}` : "",
    justifyItems ? `hextech-grid--justify-${justifyItems}` : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={gridClasses} {...props}>
      {children}
    </div>
  );
};

// Add GridItem as a property of Grid
Grid.Item = GridItem;

export default Grid;
