import { useState } from "react";
import { useAuth } from "../contexts/AuthContext.jsx";

export default function VerifyBanner() {
  const { user, resendVerification } = useAuth();
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  // Jangan tampilkan jika sudah verified atau belum login
  if (!user || user.emailVerified) return null;

  const handleResend = async () => {
    setSending(true);
    try {
      await resendVerification();
      setSent(true);
      setTimeout(() => setSent(false), 5000);
    } catch (err) {
      console.error("Gagal mengirim ulang verifikasi:", err);
      alert("Gagal mengirim email verifikasi. Coba lagi nanti.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div style={styles.banner}>
      <span style={styles.icon}>⚠️</span>
      <span style={styles.text}>
        Email kamu belum diverifikasi. Cek inbox <strong>{user.email}</strong> untuk link verifikasi.
      </span>
      <button
        onClick={handleResend}
        disabled={sending || sent}
        style={{
          ...styles.btn,
          opacity: sending || sent ? 0.6 : 1,
        }}
      >
        {sent ? "✓ Terkirim!" : sending ? "Mengirim..." : "Kirim Ulang"}
      </button>
    </div>
  );
}

const styles = {
  banner: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    padding: "0.75rem 1.25rem",
    background: "#FEF3C7",
    border: "1px solid #F59E0B",
    borderRadius: "12px",
    marginBottom: "1.5rem",
    flexWrap: "wrap",
  },
  icon: {
    fontSize: "1.1rem",
    flexShrink: 0,
  },
  text: {
    flex: 1,
    fontSize: "0.9rem",
    color: "#92400E",
    lineHeight: 1.4,
  },
  btn: {
    padding: "0.45rem 1rem",
    background: "#F59E0B",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "0.85rem",
    fontWeight: 600,
    cursor: "pointer",
    whiteSpace: "nowrap",
    transition: "background 0.2s",
    flexShrink: 0,
  },
};
