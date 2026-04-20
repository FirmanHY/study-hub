import { useEffect } from "react";
import "./ImageLightbox.css";

/**
 * Image lightbox / fullscreen preview.
 * - Klik backdrop → tutup
 * - Tekan ESC → tutup
 * - Body scroll di-lock selama lightbox terbuka
 * - Tombol close (X) di pojok kanan atas
 * - Caption (opsional) dari props.caption
 */
export default function ImageLightbox({ src, alt, caption, onClose }) {
  // Handle ESC key untuk tutup lightbox
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  // Lock body scroll saat lightbox aktif
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  if (!src) return null;

  return (
    <div
      className="lightbox-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Pratinjau gambar"
    >
      <button
        className="lightbox-close"
        onClick={onClose}
        aria-label="Tutup pratinjau"
        title="Tutup (ESC)"
      >
        ✕
      </button>

      {/* Hentikan propagasi klik agar klik gambar tidak ikut menutup */}
      <div
        className="lightbox-content"
        onClick={(e) => e.stopPropagation()}
      >
        <img src={src} alt={alt || "Pratinjau gambar"} className="lightbox-image" />
        {caption && <p className="lightbox-caption">{caption}</p>}
      </div>

      <p className="lightbox-hint">Klik area gelap atau tekan ESC untuk menutup</p>
    </div>
  );
}