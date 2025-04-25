import React from "react";
import classNames from "classnames";

export enum Color {
  PRIMARY = "is-primary",
  LINK = "is-link",
  INFO = "is-info",
  SUCCESS = "is-success",
  WARNING = "is-warning",
  DANGER = "is-danger",
  DARK = "is-dark",
  TEXT = "is-text",
  RED = "is-danger",
}

export enum Size {
  SMALL = "is-small",
  MEDIUM = "is-medium",
  LARGE = "is-large",
  FULL = "is-fullheight",
}

interface HeroProps {
  title?: string;
  subtitle?: string;
  color?: Color;
  size?: Size;
  className?: string;
  children?: React.ReactNode;
}

export const Hero: React.FC<HeroProps> = (props: HeroProps) => {
  return (
    <section className={classNames("hero", props.color, props.size, props.className)}>
      <div className="hero-body">
        <div className="container">
          {props.title && <p className="title">{props.title}</p>}
          {props.subtitle && <p className="subtitle">{props.subtitle}</p>}
          {props.children}
        </div>
      </div>
    </section>
  );
}; 
