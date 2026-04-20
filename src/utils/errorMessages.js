/**
 * Mapping berbagai error (Firebase Auth, Firebase Realtime DB, Cloudinary, network)
 * ke pesan bahasa Indonesia yang ramah user.
 *
 * File ini dipakai di:
 *  - Pages (NotesPage, TasksPage, FlashcardsPage): saat CRUD gagal
 *  - Auth pages (via re-export mapFirebaseAuthError dari validators.js)
 */

// Re-export supaya satu sumber untuk auth error juga
export { mapFirebaseAuthError } from "./validators.js";

// ===== Firebase Realtime Database =====
export function mapFirebaseDbError(code, message = "") {
  // Kode umum yang dilempar firebase/database SDK
  const codeMap = {
    "permission-denied": "Akses ditolak. Anda tidak memiliki izin.",
    "unavailable": "Layanan Firebase sedang tidak tersedia. Coba lagi nanti.",
    "network-error": "Koneksi internet terputus.",
    "disconnected": "Terputus dari server. Cek koneksi internet.",
    "unauthenticated": "Sesi Anda sudah habis. Silakan login ulang.",
    "max-retries": "Gagal setelah beberapa kali percobaan. Coba lagi.",
    "overridden-by-set": "Operasi dibatalkan.",
  };
  if (codeMap[code]) return codeMap[code];

  // Firebase kadang kirim error sebagai string di .message (bukan .code)
  if (message) {
    const lower = message.toLowerCase();
    if (lower.includes("permission_denied") || lower.includes("permission denied"))
      return codeMap["permission-denied"];
    if (lower.includes("network") || lower.includes("offline"))
      return codeMap["network-error"];
    if (lower.includes("index")) return "Index database belum dikonfigurasi.";
  }
  return null;
}

// ===== Cloudinary Upload =====
export function mapCloudinaryError(message = "") {
  if (!message) return null;
  const lower = message.toLowerCase();

  if (lower.includes("upload preset"))
    return "Konfigurasi upload preset Cloudinary salah. Cek file .env.";
  if (lower.includes("file size") || lower.includes("too large"))
    return "Ukuran gambar terlalu besar. Maksimal 10MB.";
  if (lower.includes("invalid image") || lower.includes("invalid file"))
    return "File yang dipilih bukan gambar yang valid.";
  if (lower.includes("unauthorized") || lower.includes("401"))
    return "Upload tidak diizinkan. Cek upload preset di Cloudinary.";
  if (lower.includes("network") || lower.includes("failed to fetch"))
    return "Koneksi internet terputus saat upload gambar.";
  if (lower.includes("cloudinary")) return message;

  return null;
}

/**
 * Smart dispatcher: terima error apapun, kembalikan pesan bahasa Indonesia.
 * Urutan prioritas: tagged (stage) → auth → db → cloudinary → network → fallback.
 *
 * @param {Error|unknown} err - error object
 * @param {string} fallback - pesan default jika tidak ada yang cocok
 */
export function getErrorMessage(err, fallback = "Terjadi kesalahan. Silakan coba lagi.") {
  if (!err) return fallback;

  const code = err.code || "";
  const message = err.message || String(err) || "";

  // 1) Tagged error (kami tandai di form saat upload gagal)
  if (err.stage === "upload") {
    return (
      mapCloudinaryError(message) || `Gagal upload gambar: ${message || "coba lagi"}`
    );
  }

  // 2) Firebase Auth
  if (code.startsWith("auth/")) {
    // Import dinamis untuk menghindari circular import
    const messages = {
      "auth/invalid-credential": "Email atau password salah.",
      "auth/invalid-email": "Format email tidak valid.",
      "auth/user-not-found": "Akun tidak ditemukan.",
      "auth/wrong-password": "Password salah.",
      "auth/too-many-requests": "Terlalu banyak percobaan. Coba lagi nanti.",
      "auth/email-already-in-use": "Email sudah terdaftar.",
      "auth/weak-password": "Password terlalu lemah.",
      "auth/network-request-failed": "Koneksi internet terputus.",
      "auth/user-disabled": "Akun ini telah dinonaktifkan.",
      "auth/requires-recent-login": "Perlu login ulang untuk melakukan ini.",
    };
    return messages[code] || fallback;
  }

  // 3) Firebase Database
  const dbMsg = mapFirebaseDbError(code, message);
  if (dbMsg) return dbMsg;

  // 4) Cloudinary-like
  const cloudMsg = mapCloudinaryError(message);
  if (cloudMsg) return cloudMsg;

  // 5) Network umum
  const lowerMsg = message.toLowerCase();
  if (lowerMsg.includes("failed to fetch") || lowerMsg.includes("network")) {
    return "Koneksi internet terputus. Cek jaringan Anda.";
  }
  if (lowerMsg.includes("timeout")) {
    return "Request timeout. Server terlalu lama merespons.";
  }

  return fallback;
}