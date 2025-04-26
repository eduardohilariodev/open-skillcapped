import React from "react";
import { colors, typography } from "../styles";
import { HextechCorner } from "../styles/components/hextech-shapes";

interface HextechFrameProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
  variant?: "gold" | "blue" | "dark";
  [key: string]: any;
}

export const HextechFrame: React.FC<HextechFrameProps> = ({
  children,
  title,
  className = "",
  variant = "gold",
  ...props
}) => {
  // Determine the color scheme based on variant
  const getFrameColors = () => {
    switch (variant) {
      case "blue":
        return {
          border: colors.blue.medium,
          accentBorder: colors.blue.light,
          background: colors.background.medium,
          titleBackground: colors.blue.dark,
          titleColor: colors.blue.light,
        };
      case "dark":
        return {
          border: colors.darkGrey,
          accentBorder: colors.grey,
          background: colors.background.dark,
          titleBackground: colors.black,
          titleColor: colors.lightGrey,
        };
      case "gold":
      default:
        return {
          border: colors.gold.medium,
          accentBorder: colors.gold.light,
          background: colors.background.medium,
          titleBackground: colors.gold.dark,
          titleColor: colors.gold.light,
        };
    }
  };

  const frameColors = getFrameColors();

  const frameStyle: React.CSSProperties = {
    position: "relative",
    backgroundColor: frameColors.background,
    borderWidth: "2px",
    borderStyle: "solid",
    borderColor: frameColors.border,
    padding: "1rem",
    borderRadius: "2px",
    overflow: "hidden",
    boxShadow: `0 0 15px rgba(0, 0, 0, 0.2)`,
    ...props.style,
  };

  const titleBarStyle: React.CSSProperties = {
    position: "relative",
    backgroundColor: frameColors.titleBackground,
    padding: "0.5rem 1rem",
    marginBottom: "1rem",
    marginLeft: "-1rem",
    marginRight: "-1rem",
    marginTop: "-1rem",
    fontFamily: typography.fontFamily.display,
    fontWeight: typography.fontWeight.bold,
    color: frameColors.titleColor,
    textTransform: "uppercase",
    borderBottom: `2px solid ${frameColors.border}`,
    boxShadow: `0 2px 6px rgba(0, 0, 0, 0.2)`,
  };

  const contentStyle: React.CSSProperties = {
    position: "relative",
    zIndex: 1,
  };

  return (
    <div className={`hextech-frame hextech-frame-${variant} ${className}`} style={frameStyle} {...props}>
      {/* Corner accents */}
      <HextechCorner position="top-left" color={frameColors.border} />
      <HextechCorner position="top-right" color={frameColors.border} />
      <HextechCorner position="bottom-left" color={frameColors.border} />
      <HextechCorner position="bottom-right" color={frameColors.border} />

      {/* Title bar if provided */}
      {title && (
        <div className="hextech-frame-title" style={titleBarStyle}>
          {title}
        </div>
      )}

      {/* Main content */}
      <div className="hextech-frame-content" style={contentStyle}>
        {children}
      </div>
    </div>
  );
};

export default HextechFrame;
