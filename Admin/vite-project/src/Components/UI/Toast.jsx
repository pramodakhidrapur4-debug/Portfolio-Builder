import { useState, useEffect, useCallback, createContext, useContext } from "react";
import { HiCheckCircle, HiXCircle, HiExclamation, HiInformationCircle, HiX } from "react-icons/hi";
import "./Toast.css";

/* ── Toast Context ─────────────────────────────────────────── */
const ToastContext = createContext(null);

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within <ToastProvider>");
  return ctx;
};

const ICONS = {
  success: <HiCheckCircle />,
  error: <HiXCircle />,
  warning: <HiExclamation />,
  info: <HiInformationCircle />,
};

let toastId = 0;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "info", duration = 4000) => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type, duration, removing: false }]);

    // Auto-dismiss
    setTimeout(() => {
      setToasts((prev) =>
        prev.map((t) => (t.id === id ? { ...t, removing: true } : t))
      );
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 300);
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, removing: true } : t))
    );
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 300);
  }, []);

  const toast = {
    success: (msg) => addToast(msg, "success"),
    error: (msg) => addToast(msg, "error"),
    warning: (msg) => addToast(msg, "warning"),
    info: (msg) => addToast(msg, "info"),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="toast-container">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`toast toast--${t.type} ${t.removing ? "toast--removing" : ""}`}
          >
            <span className="toast__icon">{ICONS[t.type]}</span>
            <span className="toast__message">{t.message}</span>
            <button className="toast__close" onClick={() => removeToast(t.id)}>
              <HiX />
            </button>
            <div
              className="toast__progress"
              style={{ animationDuration: `${t.duration}ms` }}
            />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
