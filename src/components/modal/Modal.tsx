import classNames from "classnames";
import * as React from "react";
import ReactDOM from "react-dom";
import { colors, typography } from "../../styles";
import { HextechCorner } from "../../styles/components/hextech-shapes";
import "./Modal.css";

export interface ModalProps {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  isVisible: boolean;
  variant?: "gold" | "blue";
}

export function Modal({
  children,
  onClose,
  isVisible,
  title,
  variant = "gold",
}: ModalProps): React.ReactElement | null {
  const modalClasses: string = classNames({
    modal: true,
    "is-clipped": true,
    "is-active": isVisible,
    "hextech-modal": true,
    [`hextech-modal-${variant}`]: true,
  });

  // Get the theme colors based on variant
  const getThemeColors = () => {
    if (variant === "blue") {
      return {
        headerBg: colors.blue.dark,
        headerText: colors.blue.light,
        headerBorder: colors.blue.medium,
        bodyBg: colors.background.medium,
        accent: colors.blue.medium,
      };
    }
    // Default gold theme
    return {
      headerBg: colors.gold.dark,
      headerText: colors.gold.light,
      headerBorder: colors.gold.medium,
      bodyBg: colors.background.medium,
      accent: colors.gold.medium,
    };
  };

  const themeColors = getThemeColors();

  // Hextech styling
  const modalCardStyle: React.CSSProperties = {
    backgroundColor: themeColors.bodyBg,
    borderRadius: "2px",
    border: `2px solid ${themeColors.accent}`,
    boxShadow: `0 0 20px rgba(0, 0, 0, 0.5)`,
    position: "relative",
    overflow: "hidden",
    maxWidth: "800px",
    width: "100%",
  };

  const headerStyle: React.CSSProperties = {
    backgroundColor: themeColors.headerBg,
    borderBottom: `2px solid ${themeColors.headerBorder}`,
    padding: "0.75rem 1.5rem",
    position: "relative",
  };

  const titleStyle: React.CSSProperties = {
    color: themeColors.headerText,
    fontFamily: typography.fontFamily.display,
    fontWeight: typography.fontWeight.bold,
    textTransform: "uppercase",
    margin: 0,
    fontSize: "1.25rem",
  };

  const closeButtonStyle: React.CSSProperties = {
    backgroundColor: "transparent",
    border: "none",
    color: themeColors.headerText,
    position: "absolute",
    right: "10px",
    top: "50%",
    transform: "translateY(-50%)",
    cursor: "pointer",
    fontSize: "1.5rem",
    width: "30px",
    height: "30px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
  };

  const bodyStyle: React.CSSProperties = {
    padding: "1.5rem",
    color: colors.white,
    position: "relative",
    zIndex: 1,
  };

  const backgroundStyle: React.CSSProperties = {
    backgroundColor: "rgba(1, 10, 19, 0.85)",
  };

  // Find the portal target node
  const modalRoot = document.getElementById("modal-root");

  if (!isVisible) return null;

  const modalContent = (
    <div className={modalClasses}>
      <div className="modal-background" style={backgroundStyle} onClick={onClose}></div>
      <div className="modal-card hextech-frame" style={modalCardStyle}>
        {/* Corner accents */}
        <HextechCorner position="top-left" color={themeColors.accent} />
        <HextechCorner position="top-right" color={themeColors.accent} />
        <HextechCorner position="bottom-left" color={themeColors.accent} />
        <HextechCorner position="bottom-right" color={themeColors.accent} />

        <header className="modal-card-head hextech-modal-header" style={headerStyle}>
          <p className="modal-card-title" style={titleStyle}>
            {title}
          </p>
          <button className="delete hextech-close-button" aria-label="close" onClick={onClose} style={closeButtonStyle}>
            ✕
          </button>
        </header>
        <section className="modal-card-body hextech-modal-body" style={bodyStyle}>
          <div className="hextech-modal-content">{children}</div>

          {/* Add subtle energy lines at the bottom */}
          <div className="hextech-energy-lines"></div>
        </section>
      </div>
    </div>
  );

  return modalRoot ? ReactDOM.createPortal(modalContent, modalRoot) : modalContent;
}
