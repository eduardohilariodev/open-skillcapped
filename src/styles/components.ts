/**
 * League of Legends Component Styles
 * Based on the League of Legends design system
 */

import colors from "./colors";
import typography from "./typography";

export const components = {
  // Button styles
  button: {
    primary: {
      backgroundColor: colors.gold.medium,
      color: colors.black,
      borderColor: colors.gold.dark,
      hoverBackgroundColor: colors.gold.dark,
      hoverColor: colors.gold.light,
      fontFamily: typography.fontFamily.display,
      fontWeight: typography.fontWeight.bold,
      textTransform: "uppercase",
    },
    secondary: {
      backgroundColor: "transparent",
      color: colors.gold.medium,
      borderColor: colors.gold.medium,
      hoverBackgroundColor: colors.gold.dark,
      hoverColor: colors.gold.light,
      fontFamily: typography.fontFamily.display,
      fontWeight: typography.fontWeight.medium,
      textTransform: "uppercase",
    },
    disabled: {
      backgroundColor: colors.darkGrey,
      color: colors.grey,
      borderColor: colors.grey,
      cursor: "not-allowed",
    },
  },

  // Card styles
  card: {
    backgroundColor: colors.background.medium,
    borderColor: colors.gold.dark,
    color: colors.white,
    headerFont: typography.fontFamily.display,
    bodyFont: typography.fontFamily.body,
  },

  // Input styles
  input: {
    backgroundColor: colors.background.dark,
    borderColor: colors.gold.dark,
    color: colors.white,
    placeholderColor: colors.lightGrey,
    focusBorderColor: colors.gold.medium,
  },

  // Navigation styles
  navigation: {
    backgroundColor: colors.background.dark,
    textColor: colors.gold.light,
    activeTextColor: colors.gold.medium,
    hoverTextColor: colors.gold.medium,
    fontFamily: typography.fontFamily.display,
    fontWeight: typography.fontWeight.medium,
  },

  // Table styles
  table: {
    headerBackgroundColor: colors.background.medium,
    headerTextColor: colors.gold.medium,
    rowBackgroundColor: colors.background.dark,
    rowAlternateBackgroundColor: colors.darkGrey,
    borderColor: colors.gold.dark,
    textColor: colors.white,
  },

  // Alert/notification styles
  alert: {
    error: {
      backgroundColor: colors.status.error,
      borderColor: colors.red,
      textColor: colors.white,
    },
    warning: {
      backgroundColor: colors.status.warning,
      borderColor: colors.yellow,
      textColor: colors.black,
    },
    success: {
      backgroundColor: colors.status.success,
      borderColor: colors.green,
      textColor: colors.white,
    },
    info: {
      backgroundColor: colors.status.info,
      borderColor: colors.blue.medium,
      textColor: colors.white,
    },
  },
};

export default components;
