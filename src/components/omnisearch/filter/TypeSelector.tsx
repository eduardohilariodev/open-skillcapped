import React from "react";
import { colors, typography } from "../../../styles";
import Type from "../../../model/Type";
import HextechFilterPanel from "./HextechFilterPanel";

export interface TypeSelectorProps {
  selectedTypes: Type[];
  onTypesUpdate: (newTypes: Type[]) => void;
}

export default function TypeSelector({ selectedTypes, onTypesUpdate }: TypeSelectorProps): React.ReactElement {
  const isChecked = (type: Type) => {
    return (
      selectedTypes.find((candidate) => {
        return candidate === type;
      }) !== undefined
    );
  };

  const getNewTypes = (type: Type) => {
    let newTypes = selectedTypes.slice();
    if (isChecked(type)) {
      newTypes = newTypes.filter((candidate) => {
        return candidate !== type;
      });
    } else {
      newTypes.push(type);
    }
    onTypesUpdate(newTypes);
  };

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
    <HextechFilterPanel title="Type" variant="blue">
      <div className="hextech-filter-controls">
        <div className="field" style={fieldStyle}>
          <label className="checkbox hextech-checkbox" style={checkboxStyle}>
            <input type="checkbox" onChange={() => getNewTypes(Type.VIDEO)} checked={isChecked(Type.VIDEO)} />
            {labelText("Video")}
          </label>
        </div>
        <div className="field" style={fieldStyle}>
          <label className="checkbox hextech-checkbox" style={checkboxStyle}>
            <input type="checkbox" onChange={() => getNewTypes(Type.COMMENTARY)} checked={isChecked(Type.COMMENTARY)} />
            {labelText("Commentary")}
          </label>
        </div>
        <div className="field" style={fieldStyle}>
          <label className="checkbox hextech-checkbox" style={checkboxStyle}>
            <input type="checkbox" onChange={() => getNewTypes(Type.COURSE)} checked={isChecked(Type.COURSE)} />
            {labelText("Course")}
          </label>
        </div>
      </div>
    </HextechFilterPanel>
  );
}
