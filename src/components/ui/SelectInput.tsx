import React, { forwardRef } from "react";

export type SelectVariant = "gold" | "blue" | "dark";
export type SelectSize = "sm" | "md" | "lg";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectInputProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  /**
   * Options for the select input
   */
  options: SelectOption[];

  /**
   * Visual variant/color of the select
   */
  variant?: SelectVariant;

  /**
   * Size of the select
   */
  size?: SelectSize;

  /**
   * Label for the select
   */
  label?: React.ReactNode;

  /**
   * Error message to display
   */
  error?: string;

  /**
   * Helper text to display
   */
  helperText?: React.ReactNode;

  /**
   * Placeholder option (first option)
   */
  placeholder?: string;

  /**
   * Additional CSS class names
   */
  className?: string;

  /**
   * Additional CSS class names for the select element
   */
  selectClassName?: string;
}

export const SelectInput = forwardRef<HTMLSelectElement, SelectInputProps>(
  (
    {
      options,
      variant = "gold",
      size = "md",
      label,
      error,
      helperText,
      placeholder,
      className = "",
      selectClassName = "",
      ...props
    },
    ref,
  ) => {
    const selectWrapperClasses = [
      "hextech-select-wrapper",
      `hextech-select-wrapper--${variant}`,
      `hextech-select-wrapper--${size}`,
      error ? "hextech-select-wrapper--error" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const selectClasses = ["hextech-select", selectClassName].filter(Boolean).join(" ");

    const id = props.id || `select-${Math.random().toString(36).substring(2, 9)}`;

    return (
      <div className={selectWrapperClasses}>
        {label && (
          <label htmlFor={id} className="hextech-select-label">
            {label}
          </label>
        )}

        <div className="hextech-select-container">
          <select
            id={id}
            ref={ref}
            className={selectClasses}
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : helperText ? `${id}-helper` : undefined}
            {...props}
          >
            {placeholder && (
              <option value="" disabled={props.required}>
                {placeholder}
              </option>
            )}

            {options.map((option) => (
              <option key={option.value} value={option.value} disabled={option.disabled}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="hextech-select-arrow"></div>
        </div>

        {error && (
          <p id={`${id}-error`} className="hextech-select-error">
            {error}
          </p>
        )}

        {!error && helperText && (
          <p id={`${id}-helper`} className="hextech-select-helper">
            {helperText}
          </p>
        )}
      </div>
    );
  },
);

SelectInput.displayName = "SelectInput";

export default SelectInput;
