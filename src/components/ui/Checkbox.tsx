import React, { forwardRef } from "react";

export type CheckboxVariant = "gold" | "blue" | "dark";
export type CheckboxSize = "sm" | "md" | "lg";

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  /**
   * Label text for the checkbox
   */
  label?: React.ReactNode;

  /**
   * Whether the checkbox is checked
   */
  checked?: boolean;

  /**
   * Visual variant/color of the checkbox
   */
  variant?: CheckboxVariant;

  /**
   * Size of the checkbox
   */
  size?: CheckboxSize;

  /**
   * Additional CSS class names
   */
  className?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, checked, variant = "gold", size = "md", className = "", ...props }, ref) => {
    const checkboxWrapperClasses = [
      "hextech-checkbox-wrapper",
      `hextech-checkbox-wrapper--${variant}`,
      `hextech-checkbox-wrapper--${size}`,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <label className={checkboxWrapperClasses}>
        <div className="hextech-checkbox-container">
          <input type="checkbox" ref={ref} checked={checked} className="hextech-checkbox" {...props} />
          <span className="hextech-checkbox-indicator"></span>
        </div>
        {label && <span className="hextech-checkbox-label">{label}</span>}
      </label>
    );
  },
);

Checkbox.displayName = "Checkbox";

export default Checkbox;
