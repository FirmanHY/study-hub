import { useState } from "react";
import { useAuth } from "../contexts/AuthContext.jsx";

export default function VerifyBanner() {
  const { user, resendVerification } = useAuth();
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  if (!user || user.emailVerified) return null;

  async function handleResend() {
    setSending(true);
    try {
      await resendVerification();
      setSent(true);
    } catch (err) {
      alert("Gagal mengirim: " + err.message);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="banner">
      ⚠️ Email Anda belum terverifikasi. Silakan cek inbox.
      <button onClick={handleResend} disabled={sending || sent}>
        {sent ? "Terkirim ✓" : sending ? "Mengirim..." : "Kirim ulang verifikasi"}
      </button>
    </div>
  );
}
