import React from "react";
import leagueify from "../styles/theme";
import "../styles/button-states.css";

export interface ToggleButtonProps {
  status: boolean;
  onToggle: () => void;
  buttonText: (status: boolean) => React.ReactNode;
  classes?: string;
  type?: "primary" | "secondary" | "utility" | "default";
  disabled?: boolean;
}

export function ToggleButton(props: ToggleButtonProps): React.ReactElement {
  const { status, onToggle, buttonText, type = "default", disabled = false } = props;
  const baseClasses = "button bookmark is-small ";
  const hextechClass = `hextech-button hextech-${type}`;
  const classes = baseClasses + hextechClass + " " + (props.classes || "");

  // Get the League Hextech button style
  const leagueButton = leagueify.button(type);

  // Additional style overrides if needed
  const buttonStyles: React.CSSProperties = {
    position: "relative" as React.CSSProperties["position"],
  };

  return (
    <button className={classes} onClick={onToggle} style={buttonStyles} disabled={disabled}>
      {buttonText(status)}
    </button>
  );
}
