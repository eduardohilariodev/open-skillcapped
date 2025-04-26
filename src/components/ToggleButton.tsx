import React from "react";
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

  // Base classes for all button types
  const baseClasses =
    "inline-flex items-center justify-center font-beaufort font-bold uppercase tracking-wider transition-all relative overflow-hidden text-center";

  // Type-specific classes
  let typeClasses = "";
  if (type === "primary") {
    typeClasses =
      "bg-gold-medium border-2 border-gold-dark text-black shadow-hextech-gold hover:bg-gold-light hover:border-gold-medium hover:-translate-y-0.5 hover:shadow-hextech-gold-hover active:translate-y-0 active:bg-gold-dark active:text-gold-light active:shadow-hextech-gold-active";
  } else if (type === "secondary") {
    typeClasses =
      "bg-blue-medium border-2 border-blue-dark text-black shadow-hextech-blue hover:bg-blue-light hover:border-blue-medium hover:-translate-y-0.5 hover:shadow-hextech-blue-hover active:translate-y-0 active:bg-blue-dark active:text-blue-light active:shadow-hextech-blue-active";
  } else if (type === "utility") {
    typeClasses =
      "bg-grey border-2 border-dark-grey text-light-grey hover:bg-dark-grey hover:text-gold-light hover:border-gold-dark hover:-translate-y-0.5 active:translate-y-0 active:bg-black";
  }

  // Disabled state
  const disabledClasses = disabled
    ? "opacity-60 cursor-not-allowed transform-none shadow-none hover:transform-none hover:shadow-none"
    : "cursor-pointer";

  // Combine all classes plus any custom classes passed in props
  const allClasses = `${baseClasses} ${typeClasses} ${disabledClasses} ${props.classes || ""}`;

  return (
    <button className={allClasses} onClick={onToggle} disabled={disabled}>
      {buttonText(status)}
    </button>
  );
}
