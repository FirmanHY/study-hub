import "./Toast.css";

const icons = {
  success: "✓",
  error: "✕",
  info: "i",
  warning: "!",
};

export default function Toast({ message, type = "info", onClose }) {
  return (
    <div className={`toast toast-${type}`} role="alert">
      <span className="toast-icon">{icons[type]}</span>
      <span className="toast-message">{message}</span>
      <button
        className="toast-close"
        onClick={onClose}
        aria-label="Tutup notifikasi"
      >
        ✕
      </button>
    </div>
  );
}