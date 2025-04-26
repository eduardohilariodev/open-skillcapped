import React from "react";
import { colors, typography } from "../../../styles";
import HextechFilterPanel from "./HextechFilterPanel";

export interface WatchStatusSelectorProps {
  onlyShowUnwatched: boolean;
  onlyShowWatched: boolean;
  onSelectionChange: (onlyShowUnwatched: boolean, onlyShowWatched: boolean) => void;
}

export default function WatchStatusSelector({
  onlyShowUnwatched,
  onlyShowWatched,
  onSelectionChange,
}: WatchStatusSelectorProps): React.ReactElement {
  // Hextech styling
  const checkboxStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    marginBottom: "0.5rem",
    color: colors.white,
    fontFamily: typography.fontFamily.body,
    cursor: "pointer",
  };

  const fieldStyle: React.CSSProperties = {
    marginBottom: "0.75rem",
  };

  const labelText = (text: string) => {
    return <span style={{ marginLeft: "0.5rem" }}>{text}</span>;
  };

  return (
    <HextechFilterPanel title="Watch Status" variant="gold">
      <div className="hextech-filter-controls">
        <div className="field" style={fieldStyle}>
          <label className="checkbox hextech-checkbox" style={checkboxStyle}>
            <input
              type="checkbox"
              checked={onlyShowUnwatched}
              onChange={() => onSelectionChange(!onlyShowUnwatched, onlyShowWatched)}
            />
            {labelText("Only show unwatched")}
          </label>
        </div>
        <div className="field" style={fieldStyle}>
          <label className="checkbox hextech-checkbox" style={checkboxStyle}>
            <input
              type="checkbox"
              checked={onlyShowWatched}
              onChange={() => onSelectionChange(onlyShowUnwatched, !onlyShowWatched)}
            />
            {labelText("Only show watched")}
          </label>
        </div>
      </div>
    </HextechFilterPanel>
  );
}
