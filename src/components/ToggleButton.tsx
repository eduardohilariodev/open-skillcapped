import React from "react";
import leagueify from "../styles/theme";
import { colors } from "../styles";

export interface ToggleButtonProps {
  status: boolean;
  onToggle: () => void;
  buttonText: (status: boolean) => React.ReactNode;
  classes?: string;
  type?: "primary" | "secondary" | "utility" | "default";
}

export function ToggleButton(props: ToggleButtonProps): React.ReactElement {
  const { status, onToggle, buttonText, type = "default" } = props;
  const baseClasses = "button bookmark is-small ";
  const hextechClass = `hextech-button hextech-${type}`;
  const classes = baseClasses + hextechClass + " " + (props.classes || "");

  // Get the League Hextech button style
  const leagueButton = leagueify.button(type);

  // Apply League of Legends Hextech styling with inline styles
  const buttonStyles: React.CSSProperties = {
    backgroundColor: leagueButton.backgroundColor,
    color: leagueButton.color,
    borderColor: leagueButton.borderColor,
    fontFamily: leagueButton.fontFamily,
    fontWeight: leagueButton.fontWeight,
    textTransform: leagueButton.textTransform as React.CSSProperties["textTransform"],
    boxShadow: leagueButton.boxShadow,
    padding: "0.3rem 0.75rem",
    fontSize: "0.875rem",
    transition: "all 0.2s ease",
    cursor: "pointer",
    borderRadius: "2px",
    position: "relative" as React.CSSProperties["position"],
    overflow: type === "primary" ? "hidden" : "visible",
  };

  // Add hover effect for primary buttons
  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (type === "primary") {
      e.currentTarget.style.boxShadow = `0 0 10px ${colors.blue.light}`;
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (type === "primary") {
      e.currentTarget.style.boxShadow = leagueButton.boxShadow || "";
    }
  };

  return (
    <button
      className={classes}
      onClick={onToggle}
      style={buttonStyles}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {buttonText(status)}
    </button>
  );
}
