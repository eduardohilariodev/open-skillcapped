/**
 * League of Legends Hextech Theme Helper
 * This file provides utilities to convert existing UI elements to League of Legends Hextech styling
 */

import colors from "./colors";
import typography from "./typography";

// Map existing Bulma colors to League of Legends colors
export const bulmaToLeagueColors = {
  "is-primary": {
    background: colors.gold.medium,
    text: colors.black,
  },
  "is-link": {
    background: colors.blue.medium,
    text: colors.white,
  },
  "is-info": {
    background: colors.blue.medium,
    text: colors.white,
  },
  "is-success": {
    background: colors.status.success,
    text: colors.white,
  },
  "is-warning": {
    background: colors.status.warning,
    text: colors.black,
  },
  "is-danger": {
    background: colors.status.error,
    text: colors.white,
  },
  "is-dark": {
    background: colors.background.dark,
    text: colors.white,
  },
  "is-light": {
    background: colors.gold.light,
    text: colors.black,
  },
};

// Apply League of Legends Hextech styling to common UI patterns
export const leagueify = {
  // Convert hero/banner components
  hero: (color: string, isLarge = false) => ({
    backgroundColor:
      color === "is-danger"
        ? colors.status.error
        : color === "is-primary"
          ? colors.gold.medium
          : colors.background.medium,
    color: color === "is-primary" ? colors.black : colors.white,
    borderBottom: `2px solid ${colors.gold.dark}`,
    fontFamily: typography.fontFamily.display,
    padding: isLarge ? "3rem 1.5rem" : "1.5rem",
  }),

  // Convert buttons to League of Legends Hextech style
  button: (type: "primary" | "secondary" | "utility" | "danger" | "default" = "default") => {
    // Primary/Gameplay Layer - blue magical buttons
    if (type === "primary") {
      return {
        backgroundColor: colors.blue.medium,
        color: colors.background.dark,
        borderColor: colors.blue.light,
        boxShadow: `0 0 6px ${colors.blue.light}`,
        fontFamily: typography.fontFamily.display,
        fontWeight: typography.fontWeight.bold,
        textTransform: "uppercase",
      };
    }
    // Secondary Layer - gold buttons for navigation
    else if (type === "secondary") {
      return {
        backgroundColor: "transparent",
        color: colors.gold.medium,
        borderColor: colors.gold.medium,
        fontFamily: typography.fontFamily.display,
        fontWeight: typography.fontWeight.medium,
        textTransform: "uppercase",
      };
    }
    // Utility Layer - interface elements
    else if (type === "utility") {
      return {
        backgroundColor: colors.background.medium,
        color: colors.gold.light,
        borderColor: colors.gold.dark,
        fontFamily: typography.fontFamily.body,
        fontWeight: typography.fontWeight.regular,
      };
    }
    // Danger buttons
    else if (type === "danger") {
      return {
        backgroundColor: colors.status.error,
        color: colors.white,
        borderColor: colors.red,
        fontFamily: typography.fontFamily.display,
        fontWeight: typography.fontWeight.bold,
        textTransform: "uppercase",
      };
    }
    // Default/fallback
    else {
      return {
        backgroundColor: colors.background.medium,
        color: colors.gold.light,
        borderColor: colors.gold.dark,
        fontFamily: typography.fontFamily.body,
        fontWeight: typography.fontWeight.medium,
      };
    }
  },

  // Convert cards/panels to League of Legends Hextech style
  card: {
    backgroundColor: colors.background.medium,
    borderColor: colors.gold.dark,
    color: colors.white,
    borderWidth: "1px",
    borderStyle: "solid",
    borderRadius: "2px",
    position: "relative",
  },

  // Header styling
  header: {
    fontFamily: typography.fontFamily.display,
    color: colors.gold.medium,
    fontWeight: typography.fontWeight.bold,
  },

  // Apply consistent backgrounds
  background: {
    dark: {
      backgroundColor: colors.background.dark,
      color: colors.white,
    },
    medium: {
      backgroundColor: colors.background.medium,
      color: colors.white,
    },
    light: {
      backgroundColor: colors.background.light,
      color: colors.white,
    },
  },
};

export default leagueify;
