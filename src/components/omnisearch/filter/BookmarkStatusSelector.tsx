import React from "react";
import { colors, typography } from "../../../styles";
import HextechFilterPanel from "./HextechFilterPanel";

export interface BookmarkStatusSelectorProps {
  onlyShowBookmarked: boolean;
  onlyShowUnbookmarked: boolean;
  onSelectionChange: (onlyShowBookmarked: boolean, onlyShowUnbookmarked: boolean) => void;
}

export default function BookmarkStatusSelector({
  onlyShowBookmarked,
  onlyShowUnbookmarked,
  onSelectionChange,
}: BookmarkStatusSelectorProps): React.ReactElement {
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
    <HextechFilterPanel title="Bookmark Status" variant="blue">
      <div className="hextech-filter-controls">
        <div className="field" style={fieldStyle}>
          <label className="checkbox hextech-checkbox" style={checkboxStyle}>
            <input
              type="checkbox"
              checked={onlyShowBookmarked}
              onChange={() => onSelectionChange(!onlyShowBookmarked, onlyShowUnbookmarked)}
            />
            {labelText("Only show bookmarked")}
          </label>
        </div>
        <div className="field" style={fieldStyle}>
          <label className="checkbox hextech-checkbox" style={checkboxStyle}>
            <input
              type="checkbox"
              checked={onlyShowUnbookmarked}
              onChange={() => onSelectionChange(onlyShowBookmarked, !onlyShowUnbookmarked)}
            />
            {labelText("Only show unbookmarked")}
          </label>
        </div>
      </div>
    </HextechFilterPanel>
  );
}
