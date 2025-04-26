import React from "react";
import { colors, typography } from "../styles";

export interface BannerProps {
  children: React.ReactNode;
  type: BannerType;
}

export enum BannerType {
  Info,
  Primary,
}

export default function Banner({ children, type }: BannerProps): React.ReactElement {
  // Base styles using League of Legends styling
  const baseStyle = {
    padding: "1rem 1.25rem",
    borderWidth: "1px",
    borderStyle: "solid",
    borderRadius: "4px",
    fontFamily: typography.fontFamily.body,
    marginBottom: "1rem",
  };

  let bannerStyle;

  if (type === BannerType.Info) {
    bannerStyle = {
      ...baseStyle,
      backgroundColor: colors.blue.dark,
      color: colors.white,
      borderColor: colors.blue.medium,
    };
  } else if (type === BannerType.Primary) {
    bannerStyle = {
      ...baseStyle,
      backgroundColor: colors.gold.dark,
      color: colors.gold.light,
      borderColor: colors.gold.medium,
    };
  } else {
    bannerStyle = {
      ...baseStyle,
      backgroundColor: colors.background.medium,
      color: colors.white,
      borderColor: colors.darkGrey,
    };
  }

  return (
    <div className="notification" style={bannerStyle}>
      {children}
    </div>
  );
}
