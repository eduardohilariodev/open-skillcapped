import React from "react";
import { colors, typography } from "../../../styles";
import { HextechCorner } from "../../../styles/components/hextech-shapes";

interface HextechFilterPanelProps {
  title: string;
  children: React.ReactNode;
  variant?: "gold" | "blue";
}

export const HextechFilterPanel: React.FC<HextechFilterPanelProps> = ({ title, children, variant = "gold" }) => {
  // Get theme colors based on variant
  const getThemeColors = () => {
    if (variant === "blue") {
      return {
        headerBg: colors.blue.dark,
        headerText: colors.blue.light,
        headerBorder: colors.blue.medium,
        bodyBg: colors.background.medium,
        accent: colors.blue.medium,
      };
    }
    // Default gold theme
    return {
      headerBg: colors.gold.dark,
      headerText: colors.gold.light,
      headerBorder: colors.gold.medium,
      bodyBg: colors.background.medium,
      accent: colors.gold.medium,
    };
  };

  const themeColors = getThemeColors();

  // Hextech styling
  const panelStyle: React.CSSProperties = {
    backgroundColor: themeColors.bodyBg,
    marginBottom: "1.5rem",
    border: `1px solid ${themeColors.accent}`,
    borderRadius: "2px",
    overflow: "hidden",
    position: "relative",
  };

  const headerStyle: React.CSSProperties = {
    backgroundColor: themeColors.headerBg,
    padding: "0.5rem 1rem",
    fontFamily: typography.fontFamily.display,
    fontWeight: typography.fontWeight.bold,
    color: themeColors.headerText,
    fontSize: "1rem",
    textTransform: "uppercase",
    borderBottom: `1px solid ${themeColors.headerBorder}`,
    position: "relative",
  };

  const bodyStyle: React.CSSProperties = {
    padding: "1rem",
    position: "relative",
  };

  return (
    <div className={`hextech-filter-panel hextech-filter-${variant}`} style={panelStyle}>
      {/* Corner accents */}
      <HextechCorner position="top-left" size="16px" color={themeColors.accent} />
      <HextechCorner position="top-right" size="16px" color={themeColors.accent} />

      <div className="hextech-filter-panel-header" style={headerStyle}>
        {title}
      </div>
      <div className="hextech-filter-panel-body" style={bodyStyle}>
        {children}
      </div>
    </div>
  );
};

export default HextechFilterPanel;
