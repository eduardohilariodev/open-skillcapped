import React from "react";
import classNames from "classnames/bind";
import { colors, typography } from "../styles";
import leagueify from "../styles/theme";

export interface HeroProps {
  title: string;
  subtitle?: string;
  color?: Color;
  size?: Size;
}

export enum Color {
  NONE,
  TEAL,
  RED,
}

export enum Size {
  SMALL,
  MEDIUM,
  LARGE,
  FULL,
  FULL_WITH_NAVBAR,
}

export class Hero extends React.PureComponent<HeroProps, unknown> {
  getClassNameForColor(color: Color): string {
    switch (color) {
      case Color.NONE:
        return "";
      case Color.RED:
        return "is-danger";
      case Color.TEAL:
        return "is-primary";
    }
  }

  getClassNameForSize(size: Size): string {
    switch (size) {
      case Size.SMALL:
        return "is-small";
      case Size.MEDIUM:
        return "is-medium";
      case Size.LARGE:
        return "is-large";
      case Size.FULL:
        return "is-fullheight";
      case Size.FULL_WITH_NAVBAR:
        return "is-fullheight-with-navbar";
    }
  }

  getBackgroundColorFromColor(color: Color): string {
    switch (color) {
      case Color.NONE:
        return colors.background.medium;
      case Color.RED:
        return colors.status.error;
      case Color.TEAL:
        return colors.gold.medium;
    }
  }

  getTextColorFromColor(color: Color): string {
    switch (color) {
      case Color.TEAL:
        return colors.black;
      default:
        return colors.white;
    }
  }

  render(): React.ReactNode {
    const cx = classNames.bind({});
    const colorClass = this.getClassNameForColor(this.props.color || Color.NONE);
    const sizeClass = this.getClassNameForSize(this.props.size || Size.SMALL);
    const isLarge =
      this.props.size === Size.LARGE || this.props.size === Size.FULL || this.props.size === Size.FULL_WITH_NAVBAR;

    // Apply League of Legends styling with inline styles
    const heroStyle = {
      ...leagueify.hero(colorClass, isLarge),
      height: sizeClass.includes("fullheight") ? "100vh" : "auto",
    };

    const titleStyle = {
      fontFamily: typography.fontFamily.display,
      color: this.props.color === Color.TEAL ? colors.black : colors.gold.medium,
      fontSize: isLarge ? typography.fontSize["4xl"] : typography.fontSize["2xl"],
      fontWeight: typography.fontWeight.bold,
      marginBottom: "0.5rem",
    };

    const subtitleStyle = {
      fontFamily: typography.fontFamily.body,
      color: this.props.color === Color.TEAL ? colors.black : colors.gold.light,
      fontSize: isLarge ? typography.fontSize.xl : typography.fontSize.lg,
      fontWeight: typography.fontWeight.medium,
    };

    return (
      <section className={cx({ hero: true })} style={heroStyle}>
        <div className="hero-body">
          <div className="container">
            <h1 className="title" style={titleStyle}>
              {this.props.title}
            </h1>
            {this.props.subtitle && (
              <h2 className="subtitle" style={subtitleStyle}>
                {this.props.subtitle}
              </h2>
            )}
          </div>
        </div>
      </section>
    );
  }
}
