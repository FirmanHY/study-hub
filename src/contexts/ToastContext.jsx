import { createContext, useContext, useState, useCallback } from "react";
import Toast from "../components/toast/Toast.jsx";

const ToastContext = createContext(null);

// Custom hook
export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast harus dipakai di dalam ToastProvider");
  return ctx;
}

// ID counter sederhana untuk membedakan toast yang sedang tampil
let nextId = 1;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  // Hapus toast dari antrian
  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Tampilkan toast + auto-dismiss setelah durasi habis
  const show = useCallback(
    (message, type = "info", duration = 4000) => {
      const id = nextId++;
      setToasts((prev) => [...prev, { id, message, type }]);
      if (duration > 0) {
        setTimeout(() => remove(id), duration);
      }
      return id;
    },
    [remove]
  );

  // Helper API: toast.success(...), toast.error(...), dll.
  // Error default durasinya 5 detik (butuh waktu baca), lainnya 4 detik.
  const toast = {
    success: (msg, dur) => show(msg, "success", dur),
    error: (msg, dur) => show(msg, "error", dur ?? 5000),
    info: (msg, dur) => show(msg, "info", dur),
    warning: (msg, dur) => show(msg, "warning", dur),
  };

  return (
    <ToastContext.Provider value={{ toast, remove }}>
      {children}
      <div className="toast-container" aria-live="polite" aria-atomic="true">
        {toasts.map((t) => (
          <Toast
            key={t.id}
            message={t.message}
            type={t.type}
            onClose={() => remove(t.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}