import React from "react";
import { colors, typography } from "../../../styles";
import { Role } from "../../../model/Role";
import HextechFilterPanel from "./HextechFilterPanel";

export interface RoleSelectorProps {
  selectedRoles: Role[];
  onRolesUpdate: (newRoles: Role[]) => void;
}

export default function RoleSelector({ selectedRoles, onRolesUpdate }: RoleSelectorProps): React.ReactElement {
  const isChecked = (role: Role) => {
    return (
      selectedRoles.find((candidate) => {
        return candidate === role;
      }) !== undefined
    );
  };

  const getNewRoles = (role: Role) => {
    let newRoles = selectedRoles.slice();
    if (isChecked(role)) {
      newRoles = newRoles.filter((candidate) => {
        return candidate !== role;
      });
    } else {
      newRoles.push(role);
    }
    onRolesUpdate(newRoles);
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

  const labelText = (role: string) => {
    return <span style={{ marginLeft: "0.5rem" }}>{role}</span>;
  };

  return (
    <HextechFilterPanel title="Roles" variant="gold">
      <div className="hextech-filter-controls">
        <div className="field" style={fieldStyle}>
          <label className="checkbox hextech-checkbox" style={checkboxStyle}>
            <input type="checkbox" checked={isChecked(Role.TOP)} onChange={() => getNewRoles(Role.TOP)} />
            {labelText("Top")}
          </label>
        </div>
        <div className="field" style={fieldStyle}>
          <label className="checkbox hextech-checkbox" style={checkboxStyle}>
            <input type="checkbox" checked={isChecked(Role.JUNGLE)} onChange={() => getNewRoles(Role.JUNGLE)} />
            {labelText("Jungle")}
          </label>
        </div>
        <div className="field" style={fieldStyle}>
          <label className="checkbox hextech-checkbox" style={checkboxStyle}>
            <input type="checkbox" checked={isChecked(Role.MID)} onChange={() => getNewRoles(Role.MID)} />
            {labelText("Mid")}
          </label>
        </div>
        <div className="field" style={fieldStyle}>
          <label className="checkbox hextech-checkbox" style={checkboxStyle}>
            <input type="checkbox" checked={isChecked(Role.ADC)} onChange={() => getNewRoles(Role.ADC)} />
            {labelText("ADC")}
          </label>
        </div>
        <div className="field" style={fieldStyle}>
          <label className="checkbox hextech-checkbox" style={checkboxStyle}>
            <input type="checkbox" checked={isChecked(Role.SUPPORT)} onChange={() => getNewRoles(Role.SUPPORT)} />
            {labelText("Support")}
          </label>
        </div>
        <div className="field" style={fieldStyle}>
          <label className="checkbox hextech-checkbox" style={checkboxStyle}>
            <input type="checkbox" checked={isChecked(Role.ALL)} onChange={() => getNewRoles(Role.ALL)} />
            {labelText("Not Role Specific")}
          </label>
        </div>
      </div>
    </HextechFilterPanel>
  );
}
