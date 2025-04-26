import React from "react";

export type ButtonVariant = "primary" | "secondary" | "utility";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Button variant
   * primary (blue) - Used for gameplay actions
   * secondary (gold) - Used for navigation and modal actions
   * utility (grey) - Used for filters, info
   */
  variant?: ButtonVariant;

  /**
   * Button size
   */
  size?: ButtonSize;

  /**
   * Icon to show on the left side
   */
  iconLeft?: React.ReactNode;

  /**
   * Icon to show on the right side
   */
  iconRight?: React.ReactNode;

  /**
   * Whether this is a toggle button
   */
  isToggle?: boolean;

  /**
   * Whether the toggle button is active (when isToggle is true)
   */
  isActive?: boolean;

  /**
   * Additional CSS class names
   */
  className?: string;

  /**
   * Button content
   */
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "secondary",
  size = "md",
  iconLeft,
  iconRight,
  isToggle = false,
  isActive = false,
  className = "",
  children,
  ...props
}) => {
  const buttonClasses = [
    "hextech-button",
    `hextech-button--${variant}`,
    `hextech-button--${size}`,
    isToggle ? "hextech-button--toggle" : "",
    isToggle && isActive ? "is-active" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={buttonClasses} {...props}>
      {iconLeft && <span className="hextech-button__icon hextech-button__icon--left">{iconLeft}</span>}
      {children}
      {iconRight && <span className="hextech-button__icon hextech-button__icon--right">{iconRight}</span>}
    </button>
  );
};

export default Button;
