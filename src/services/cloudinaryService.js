// Cloudinary upload service.
// Menggunakan unsigned upload preset agar aman dari sisi browser
// (tidak perlu API secret di client). Buat preset di:
// Cloudinary Console → Settings → Upload → Add upload preset → Mode: Unsigned

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

/**
 * Upload sebuah file gambar ke Cloudinary.
 * @param {File} file - File gambar dari <input type="file" />
 * @returns {Promise<{url: string, publicId: string}>}
 */
export async function uploadImage(file) {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error("Cloudinary belum dikonfigurasi. Cek file .env.local Anda.");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  const response = await fetch(UPLOAD_URL, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error?.error?.message || "Gagal mengupload gambar ke Cloudinary.");
  }

  const data = await response.json();
  return {
    url: data.secure_url,
    publicId: data.public_id,
  };
}
