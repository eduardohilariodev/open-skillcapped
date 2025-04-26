import React from "react";
import { colors } from "../colors";

interface HextechShapeProps {
  children?: React.ReactNode;
  className?: string;
  size?: string | number;
  color?: string;
  borderColor?: string;
  [key: string]: any;
}

// Square - structure element
export const HextechSquare: React.FC<HextechShapeProps> = ({
  children,
  className = "",
  size = "100px",
  color = colors.background.medium,
  borderColor = colors.gold.medium,
  ...props
}) => (
  <div
    className={`hextech-square ${className}`}
    style={{
      position: "relative",
      width: size,
      height: size,
      backgroundColor: color,
      border: `2px solid ${borderColor}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      ...props.style,
    }}
    {...props}
  >
    {children}
  </div>
);

// Diamond - accent element
export const HextechDiamond: React.FC<HextechShapeProps> = ({
  children,
  className = "",
  size = "100px",
  color = colors.blue.medium,
  borderColor = colors.blue.light,
  ...props
}) => (
  <div
    className={`hextech-diamond ${className}`}
    style={{
      position: "relative",
      width: size,
      height: size,
      backgroundColor: color,
      border: `2px solid ${borderColor}`,
      transform: "rotate(45deg)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      ...props.style,
    }}
    {...props}
  >
    <div style={{ transform: "rotate(-45deg)" }}>{children}</div>
  </div>
);

// Circle - focus element
export const HextechCircle: React.FC<HextechShapeProps> = ({
  children,
  className = "",
  size = "100px",
  color = colors.magic.blue,
  borderColor = colors.blue.light,
  ...props
}) => (
  <div
    className={`hextech-circle ${className}`}
    style={{
      position: "relative",
      width: size,
      height: size,
      backgroundColor: color,
      border: `2px solid ${borderColor}`,
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      ...props.style,
    }}
    {...props}
  >
    {children}
  </div>
);

// Hextech ornamental corner
export const HextechCorner: React.FC<HextechShapeProps> = ({
  className = "",
  size = "24px",
  position = "top-left",
  color = colors.gold.medium,
  ...props
}) => {
  const getPositionStyle = () => {
    switch (position) {
      case "top-right":
        return { top: 0, right: 0, transform: "rotate(90deg)" };
      case "bottom-right":
        return { bottom: 0, right: 0, transform: "rotate(180deg)" };
      case "bottom-left":
        return { bottom: 0, left: 0, transform: "rotate(270deg)" };
      case "top-left":
      default:
        return { top: 0, left: 0 };
    }
  };

  return (
    <div
      className={`hextech-corner ${className}`}
      style={{
        position: "absolute",
        width: size,
        height: size,
        pointerEvents: "none",
        ...getPositionStyle(),
        ...props.style,
      }}
      {...props}
    >
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 0H12V2H2V12H0V0Z" fill={color} />
        <path d="M0 0L5 5L3.5 6.5L0 3V0Z" fill={color} />
      </svg>
    </div>
  );
};

export default {
  HextechSquare,
  HextechDiamond,
  HextechCircle,
  HextechCorner,
};
