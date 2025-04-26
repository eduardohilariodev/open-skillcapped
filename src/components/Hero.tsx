import React from "react";
import "../styles/components/_hero.css";

export interface HeroProps {
  title: string;
  subtitle?: string;
  color?: Color;
  size?: Size;
}

export enum Size {
  SMALL = "small",
  MEDIUM = "medium",
  LARGE = "large",
  FULL = "full",
  FULL_WITH_NAVBAR = "full-with-navbar",
}

export enum Color {
  NONE = "none",
  RED = "danger",
  GREEN = "success",
  BLUE = "blue",
  GOLD = "gold",
  TEAL = "teal",
}

export class Hero extends React.PureComponent<HeroProps, unknown> {
  getHeroClass(): string {
    const { color = Color.NONE, size = Size.SMALL } = this.props;

    let heroClass = "hextech-hero";

    // Add color class
    switch (color) {
      case Color.RED:
        heroClass += " hextech-hero--danger";
        break;
      case Color.GREEN:
        heroClass += " hextech-hero--success";
        break;
      case Color.BLUE:
        heroClass += " hextech-hero--accent hextech-hero--blue";
        break;
      case Color.GOLD:
        heroClass += " hextech-hero--primary hextech-hero--gold";
        break;
      case Color.TEAL:
        heroClass += " hextech-hero--accent"; // Using blue accent for teal (could add specific if needed)
        break;
      default:
        break;
    }

    // Add size class
    switch (size) {
      case Size.SMALL:
        heroClass += " hextech-hero--sm";
        break;
      case Size.MEDIUM:
        heroClass += " hextech-hero--md";
        break;
      case Size.LARGE:
        heroClass += " hextech-hero--lg";
        break;
      case Size.FULL:
        heroClass += " hextech-hero--fullheight";
        break;
      case Size.FULL_WITH_NAVBAR:
        heroClass += " hextech-hero--fullheight-with-navbar";
        break;
      default:
        heroClass += " hextech-hero--sm";
        break;
    }

    return heroClass;
  }

  render(): React.ReactNode {
    const heroClass = this.getHeroClass();

    return (
      <section className={heroClass}>
        <div className="hextech-hero__content">
          <h1 className="hextech-hero__title">{this.props.title}</h1>
          {this.props.subtitle && <h2 className="hextech-hero__subtitle">{this.props.subtitle}</h2>}
        </div>
      </section>
    );
  }
}
