import { useEffect } from "react";
import { HiExclamationCircle } from "react-icons/hi";
import "./Modal.css";

/**
 * Reusable confirmation dialog with backdrop blur.
 * Props:
 *  - isOpen: boolean
 *  - title: string
 *  - message: string
 *  - confirmText: string (default "Confirm")
 *  - cancelText: string (default "Cancel")
 *  - variant: "danger" | "primary" (default "primary")
 *  - onConfirm: () => void
 *  - onCancel: () => void
 */
const Modal = ({
  isOpen,
  title = "Confirm Action",
  message = "Are you sure?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "primary",
  onConfirm,
  onCancel,
  children,
}) => {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    const handleEsc = (e) => { if (e.key === "Escape" && isOpen) onCancel?.(); };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* If children are provided, render custom form modal */}
        {children ? (
          children
        ) : (
          <>
            <div className="modal-header">
              {variant === "danger" && (
                <div className="modal-icon modal-icon--danger">
                  <HiExclamationCircle />
                </div>
              )}
              <h3>{title}</h3>
            </div>
            <p className="modal-message">{message}</p>
            <div className="modal-actions">
              <button className="btn btn--secondary" onClick={onCancel}>
                {cancelText}
              </button>
              <button
                className={`btn ${variant === "danger" ? "btn--danger" : "btn--primary"}`}
                onClick={onConfirm}
              >
                {confirmText}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Modal;
