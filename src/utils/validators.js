/**
 * Kumpulan validator input yang dipakai di LoginPage & RegisterPage.
 * Setiap fungsi mengembalikan string pesan error, atau `null` jika valid.
 * Pattern ini dipilih supaya gampang dipakai di UI (if err -> tampilkan, else -> lolos).
 */

// ===== Email =====
export function validateEmail(email) {
  if (!email || !email.trim()) return "Email wajib diisi.";
  const trimmed = email.trim();
  // Regex standar: ada karakter, @, domain, titik, ekstensi. Tidak terlalu strict
  // karena email valid bisa punya bentuk yang aneh.
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmed)) return "Format email tidak valid.";
  if (trimmed.length > 254) return "Email terlalu panjang.";
  return null;
}

// ===== Password (untuk login — minimum saja) =====
export function validatePassword(password, { minLength = 6 } = {}) {
  if (!password) return "Password wajib diisi.";
  if (password.length < minLength)
    return `Password minimal ${minLength} karakter.`;
  if (password.length > 128) return "Password maksimal 128 karakter.";
  if (/\s/.test(password)) return "Password tidak boleh mengandung spasi.";
  return null;
}

// ===== Nama =====
export function validateName(name) {
  if (!name || !name.trim()) return "Nama wajib diisi.";
  const trimmed = name.trim();
  if (trimmed.length < 2) return "Nama minimal 2 karakter.";
  if (trimmed.length > 50) return "Nama maksimal 50 karakter.";
  // Hanya huruf, spasi, apostrof, titik, strip (untuk nama seperti O'Brien, J. R. Smith)
  if (!/^[a-zA-Z\s'.-]+$/.test(trimmed))
    return "Nama hanya boleh huruf, spasi, dan tanda baca umum.";
  return null;
}

// ===== Konfirmasi password =====
export function validateConfirmPassword(password, confirm) {
  if (!confirm) return "Konfirmasi password wajib diisi.";
  if (password !== confirm) return "Password dan konfirmasi tidak cocok.";
  return null;
}

// ===== Password strength (skor 0-4) =====
/**
 * Mengukur kekuatan password secara sederhana.
 * Skor:
 *  0 = kosong
 *  1 = sangat lemah (>= 6 karakter)
 *  2 = lemah       (+ >= 10 karakter)
 *  3 = cukup       (+ kombinasi huruf & angka)
 *  4 = kuat/sangat kuat (+ ada karakter spesial)
 */
export function getPasswordStrength(password) {
  if (!password) return { score: 0, label: "", color: "#e0e7ef" };

  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[a-zA-Z]/.test(password) && /[0-9]/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  const levels = [
    { label: "Sangat lemah", color: "#dc2626" },
    { label: "Lemah", color: "#ef4444" },
    { label: "Cukup", color: "#f59e0b" },
    { label: "Kuat", color: "#22c55e" },
    { label: "Sangat kuat", color: "#16a34a" },
  ];

  const capped = Math.min(score, 4);
  return { score: capped, ...levels[capped] };
}

// ===== Mapping error Firebase Auth ke bahasa Indonesia =====
export function mapFirebaseAuthError(code) {
  const messages = {
    "auth/invalid-credential": "Email atau password salah.",
    "auth/invalid-email": "Format email tidak valid.",
    "auth/user-not-found": "Akun dengan email tersebut tidak ditemukan.",
    "auth/wrong-password": "Password salah.",
    "auth/too-many-requests":
      "Terlalu banyak percobaan gagal. Tunggu beberapa saat lalu coba lagi.",
    "auth/email-already-in-use":
      "Email sudah terdaftar. Silakan login atau gunakan email lain.",
    "auth/weak-password": "Password terlalu lemah. Gunakan minimal 6 karakter.",
    "auth/network-request-failed":
      "Koneksi internet terputus. Periksa jaringan Anda.",
    "auth/user-disabled": "Akun ini telah dinonaktifkan oleh admin.",
    "auth/operation-not-allowed": "Metode autentikasi ini tidak diizinkan.",
    "auth/missing-password": "Password wajib diisi.",
    "auth/missing-email": "Email wajib diisi.",
    "auth/internal-error": "Terjadi kesalahan internal. Silakan coba lagi.",
  };
  return messages[code] || "Terjadi kesalahan. Silakan coba lagi.";
}