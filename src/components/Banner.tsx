import React from "react";
import "../styles/components/_banner.css";

export interface BannerProps {
  children: React.ReactNode;
  type: BannerType;
  title?: string;
}

export enum BannerType {
  Info,
  Primary,
}

export default function Banner({ children, type, title }: BannerProps): React.ReactElement {
  let bannerClass = "hextech-banner";

  if (type === BannerType.Info) {
    bannerClass += " hextech-banner--info";
  } else if (type === BannerType.Primary) {
    bannerClass += " hextech-banner--primary";
  }

  return (
    <div className={bannerClass}>
      {title && <h3 className="hextech-banner__title">{title}</h3>}
      {children}
    </div>
  );
}
