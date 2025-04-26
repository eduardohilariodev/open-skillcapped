import React from "react";
import leagueify from "../styles/theme";

export interface ToggleButtonProps {
  status: boolean;
  onToggle: () => void;
  buttonText: (status: boolean) => React.ReactNode;
  classes?: string;
  type?: "primary" | "secondary" | "default";
}

export function ToggleButton(props: ToggleButtonProps): React.ReactElement {
  const { status, onToggle, buttonText, type = "default" } = props;
  const classes = "button bookmark is-small " + (props.classes || "");

  // Get the League button style
  const leagueButton = leagueify.button(type);

  // Apply League of Legends styling with inline styles
  const buttonStyles = {
    backgroundColor: leagueButton.backgroundColor,
    color: leagueButton.color,
    borderColor: leagueButton.borderColor,
    fontFamily: leagueButton.fontFamily,
    fontWeight: leagueButton.fontWeight,
    textTransform: leagueButton.textTransform as React.CSSProperties["textTransform"],
    padding: "0.3rem 0.75rem",
    fontSize: "0.875rem",
    transition: "all 0.2s ease",
    cursor: "pointer",
    borderRadius: "3px",
  };

  return (
    <button className={classes} onClick={onToggle} style={buttonStyles}>
      {buttonText(status)}
    </button>
  );
}
