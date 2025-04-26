import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react";
import { colors } from "../styles";
import "./TipsButton.css";

export interface TipsButtonProps {
  onClick: () => void;
}

export function TipsButton({ onClick }: TipsButtonProps): React.ReactElement {
  // League of Legends styling for the button
  const buttonStyle = {
    backgroundColor: colors.gold.medium,
    color: colors.black,
    border: `2px solid ${colors.gold.dark}`,
    borderRadius: "50%",
    width: "3rem",
    height: "3rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    boxShadow: `0 0.25rem 1rem rgba(0, 0, 0, 0.3)`,
    transition: "all 0.2s",
    outline: "none",
  };

  const iconStyle = {
    fontSize: "1.25rem",
  };

  return (
    <div className="tips-button">
      <button onClick={onClick} style={buttonStyle}>
        <span style={iconStyle}>
          <FontAwesomeIcon icon={faQuestionCircle} />
        </span>
      </button>
    </div>
  );
}
