import { useState } from "react";
import { uploadImage } from "../../services/cloudinaryService.js";
import { useToast } from "../../contexts/ToastContext.jsx";

// Max 10MB — sesuai limit Cloudinary free tier
const MAX_FILE_SIZE = 10 * 1024 * 1024;

export default function NoteForm({ initialData, onSubmit, onCancel }) {
  const { toast } = useToast();
  const [title, setTitle] = useState(initialData?.title || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(
    initialData?.imageUrl || null
  );
  const [loading, setLoading] = useState(false);
  const [titleError, setTitleError] = useState("");

  // Validasi file sebelum di-upload: tipe harus image & max 10MB
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("File yang dipilih harus berupa gambar.");
      e.target.value = "";
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      toast.error("Ukuran gambar terlalu besar. Maksimal 10MB.");
      e.target.value = "";
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi: judul wajib
    if (!title.trim()) {
      setTitleError("Judul wajib diisi.");
      return;
    }
    setTitleError("");

    setLoading(true);
    try {
      let imageUrl = initialData?.imageUrl || null;
      let imagePublicId = initialData?.imagePublicId || null;

      // Upload gambar baru jika ada. Tag error sebagai "upload"
      // supaya dispatcher di errorMessages.js bisa kasih pesan yang sesuai.
      if (imageFile) {
        try {
          const result = await uploadImage(imageFile);
          imageUrl = result.url;
          imagePublicId = result.publicId;
        } catch (uploadErr) {
          uploadErr.stage = "upload";
          throw uploadErr;
        }
      } else if (!imagePreview && initialData?.imageUrl) {
        // User hapus gambar existing
        imageUrl = null;
        imagePublicId = null;
      }

      await onSubmit({ title: title.trim(), content, imageUrl, imagePublicId });
      // Parent yang menutup modal + tampilkan toast sukses
    } catch (err) {
      // Parent sudah menampilkan toast error + re-throw.
      // Kita swallow di sini supaya tidak ada unhandled rejection.
      // Input form tetap diisi supaya user bisa retry tanpa ketik ulang.
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form} noValidate>
      <div style={styles.field}>
        <label style={styles.label}>Judul</label>
        <input
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (titleError) setTitleError("");
          }}
          style={{
            ...styles.input,
            borderColor: titleError ? "#dc2626" : "#e0e7ef",
          }}
          placeholder="Judul catatan"
          maxLength={200}
        />
        {titleError && <span style={styles.fieldError}>{titleError}</span>}
      </div>

      <div style={styles.field}>
        <label style={styles.label}>Isi Catatan</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={{ ...styles.input, minHeight: "120px", resize: "vertical" }}
          placeholder="Tulis isi catatan di sini..."
          maxLength={5000}
        />
      </div>

      <div style={styles.field}>
        <label style={styles.label}>
          Lampiran Gambar{" "}
          <span style={{ fontSize: "0.75rem", fontWeight: 400, color: "#888" }}>
            (opsional, max 10MB)
          </span>
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          disabled={loading}
        />
        {imagePreview && (
          <div style={{ marginTop: "0.5rem", position: "relative" }}>
            <img
              src={imagePreview}
              alt="Preview"
              style={{
                width: "100%",
                maxHeight: "150px",
                objectFit: "cover",
                borderRadius: "8px",
              }}
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              style={styles.removeImg}
              disabled={loading}
            >
              ✕
            </button>
          </div>
        )}
      </div>

      <div style={styles.actions}>
        <button
          type="button"
          onClick={onCancel}
          style={styles.cancelBtn}
          disabled={loading}
        >
          Batal
        </button>
        <button type="submit" disabled={loading} style={styles.submitBtn}>
          {loading ? "Menyimpan..." : initialData ? "Update" : "Simpan"}
        </button>
      </div>
    </form>
  );
}

const styles = {
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    marginTop: "1rem",
  },
  field: { display: "flex", flexDirection: "column", gap: "0.3rem" },
  label: { fontSize: "0.85rem", fontWeight: 600, color: "#444" },
  input: {
    padding: "0.75rem 1rem",
    border: "2px solid #e0e7ef",
    borderRadius: "12px",
    fontSize: "0.95rem",
    outline: "none",
    fontFamily: "inherit",
    transition: "border-color 0.2s",
  },
  fieldError: {
    fontSize: "0.8rem",
    color: "#dc2626",
    marginTop: "0.15rem",
  },
  actions: {
    display: "flex",
    gap: "0.75rem",
    justifyContent: "flex-end",
    marginTop: "0.5rem",
  },
  cancelBtn: {
    padding: "0.7rem 1.5rem",
    background: "#f5f5f5",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "0.9rem",
  },
  submitBtn: {
    padding: "0.7rem 1.5rem",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "0.9rem",
    fontWeight: 600,
  },
  removeImg: {
    position: "absolute",
    top: "8px",
    right: "8px",
    background: "rgba(0,0,0,0.6)",
    color: "#fff",
    border: "none",
    borderRadius: "50%",
    width: "28px",
    height: "28px",
    cursor: "pointer",
    fontSize: "0.8rem",
  },
};