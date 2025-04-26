/**
 * League of Legends Theme Helper
 * This file provides utilities to convert existing UI elements to League of Legends styling
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

// Apply League of Legends styling to common UI patterns
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

  // Convert buttons to League of Legends style
  button: (type: "primary" | "secondary" | "danger" | "default" = "default") => {
    if (type === "primary") {
      return {
        backgroundColor: colors.gold.medium,
        color: colors.black,
        borderColor: colors.gold.dark,
        fontFamily: typography.fontFamily.display,
        fontWeight: typography.fontWeight.bold,
        textTransform: "uppercase",
      };
    } else if (type === "secondary") {
      return {
        backgroundColor: "transparent",
        color: colors.gold.medium,
        borderColor: colors.gold.medium,
        fontFamily: typography.fontFamily.display,
        fontWeight: typography.fontWeight.medium,
        textTransform: "uppercase",
      };
    } else if (type === "danger") {
      return {
        backgroundColor: colors.status.error,
        color: colors.white,
        borderColor: colors.red,
        fontFamily: typography.fontFamily.display,
        fontWeight: typography.fontWeight.bold,
        textTransform: "uppercase",
      };
    } else {
      return {
        backgroundColor: colors.darkGrey,
        color: colors.white,
        borderColor: colors.grey,
        fontFamily: typography.fontFamily.display,
        fontWeight: typography.fontWeight.medium,
        textTransform: "uppercase",
      };
    }
  },

  // Convert cards/panels to League of Legends style
  card: {
    backgroundColor: colors.background.medium,
    borderColor: colors.gold.dark,
    color: colors.white,
    borderWidth: "1px",
    borderStyle: "solid",
    borderRadius: "4px",
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
