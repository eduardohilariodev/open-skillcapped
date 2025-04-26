import React, { useEffect, useRef } from "react";
import Button from "./Button";

export type ModalVariant = "gold" | "blue" | "dark";

export interface ModalProps {
  /**
   * Whether the modal is visible
   */
  isVisible: boolean;

  /**
   * Called when the user attempts to close the modal
   */
  onClose: () => void;

  /**
   * Modal title
   */
  title?: React.ReactNode;

  /**
   * Modal variant - color scheme
   */
  variant?: ModalVariant;

  /**
   * Modal content
   */
  children: React.ReactNode;

  /**
   * Footer content
   * If not provided, a default "Close" button will be rendered
   */
  footer?: React.ReactNode;

  /**
   * Whether to close the modal when clicking outside
   */
  closeOnOutsideClick?: boolean;

  /**
   * Whether to close the modal when pressing the Escape key
   */
  closeOnEsc?: boolean;

  /**
   * Additional CSS class names for the modal
   */
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isVisible,
  onClose,
  title,
  variant = "gold",
  children,
  footer,
  closeOnOutsideClick = true,
  closeOnEsc = true,
  className = "",
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle ESC key press
  useEffect(() => {
    if (!closeOnEsc) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isVisible) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeOnEsc, isVisible, onClose]);

  // Handle outside click
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!closeOnOutsideClick) return;

    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  if (!isVisible) return null;

  const modalClasses = ["hextech-modal", `hextech-modal--${variant}`, className].filter(Boolean).join(" ");

  const defaultFooter = (
    <Button variant="secondary" onClick={onClose}>
      Close
    </Button>
  );

  return (
    <div className="hextech-modal-backdrop is-active" onClick={handleBackdropClick}>
      <div className={modalClasses} ref={modalRef}>
        <div className="hextech-modal__header">
          <h3 className="hextech-modal__title">{title}</h3>
          <button type="button" className="hextech-modal__close" onClick={onClose} aria-label="Close modal">
            ✕
          </button>
        </div>

        <div className="hextech-modal__content">{children}</div>

        {(footer || defaultFooter) && <div className="hextech-modal__footer">{footer || defaultFooter}</div>}
      </div>
    </div>
  );
};

export default Modal;
