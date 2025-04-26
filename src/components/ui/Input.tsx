import React, { forwardRef } from "react";

export type InputVariant = "gold" | "blue" | "dark";
export type InputSize = "sm" | "md" | "lg";

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  /**
   * Input label
   */
  label?: React.ReactNode;

  /**
   * Visual variant/color of the input
   */
  variant?: InputVariant;

  /**
   * Size of the input
   */
  size?: InputSize;

  /**
   * Error message to display
   */
  error?: string;

  /**
   * Helper text to display below the input
   */
  helperText?: React.ReactNode;

  /**
   * Icon to display at the start of the input
   */
  iconLeft?: React.ReactNode;

  /**
   * Icon to display at the end of the input
   */
  iconRight?: React.ReactNode;

  /**
   * Additional CSS class names
   */
  className?: string;

  /**
   * Additional CSS class names for the input element
   */
  inputClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      variant = "gold",
      size = "md",
      error,
      helperText,
      iconLeft,
      iconRight,
      className = "",
      inputClassName = "",
      ...props
    },
    ref,
  ) => {
    const inputWrapperClasses = [
      "hextech-input-wrapper",
      `hextech-input-wrapper--${variant}`,
      `hextech-input-wrapper--${size}`,
      error ? "hextech-input-wrapper--error" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const inputClasses = [
      "hextech-input",
      iconLeft ? "hextech-input--has-icon-left" : "",
      iconRight ? "hextech-input--has-icon-right" : "",
      inputClassName,
    ]
      .filter(Boolean)
      .join(" ");

    const id = props.id || `input-${Math.random().toString(36).substring(2, 9)}`;

    return (
      <div className={inputWrapperClasses}>
        {label && (
          <label htmlFor={id} className="hextech-input-label">
            {label}
          </label>
        )}

        <div className="hextech-input-container">
          {iconLeft && <span className="hextech-input-icon hextech-input-icon--left">{iconLeft}</span>}

          <input
            id={id}
            ref={ref}
            className={inputClasses}
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : helperText ? `${id}-helper` : undefined}
            {...props}
          />

          {iconRight && <span className="hextech-input-icon hextech-input-icon--right">{iconRight}</span>}
        </div>

        {error && (
          <p id={`${id}-error`} className="hextech-input-error">
            {error}
          </p>
        )}

        {!error && helperText && (
          <p id={`${id}-helper`} className="hextech-input-helper">
            {helperText}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
