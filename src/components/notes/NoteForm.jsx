import { useState } from "react";
import { uploadImage } from "../../services/cloudinaryService.js";

export default function NoteForm({ initialData, onSubmit, onCancel }) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(initialData?.imageUrl || null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    try {
      let imageUrl = initialData?.imageUrl || null;
      let imagePublicId = initialData?.imagePublicId || null;

      // Upload gambar baru jika ada
      if (imageFile) {
        const result = await uploadImage(imageFile);
        imageUrl = result.url;
        imagePublicId = result.publicId;
      } else if (!imagePreview && initialData?.imageUrl) {
        // Gambar dihapus
        imageUrl = null;
        imagePublicId = null;
      }

      await onSubmit({ title, content, imageUrl, imagePublicId });
    } catch (err) {
      console.error("Gagal menyimpan catatan:", err);
      alert("Gagal menyimpan. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <div style={styles.field}>
        <label style={styles.label}>Judul</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={styles.input}
          placeholder="Judul catatan"
        />
      </div>

      <div style={styles.field}>
        <label style={styles.label}>Isi Catatan</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={{ ...styles.input, minHeight: "120px", resize: "vertical" }}
          placeholder="Tulis isi catatan di sini..."
        />
      </div>

      <div style={styles.field}>
        <label style={styles.label}>Lampiran Gambar (opsional)</label>
        <input type="file" accept="image/*" onChange={handleImageChange} />
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
            >
              ✕
            </button>
          </div>
        )}
      </div>

      <div style={styles.actions}>
        <button type="button" onClick={onCancel} style={styles.cancelBtn}>
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
  form: { display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1rem" },
  field: { display: "flex", flexDirection: "column", gap: "0.3rem" },
  label: { fontSize: "0.85rem", fontWeight: 600, color: "#444" },
  input: {
    padding: "0.75rem 1rem",
    border: "2px solid #e0e7ef",
    borderRadius: "12px",
    fontSize: "0.95rem",
    outline: "none",
    fontFamily: "inherit",
  },
  actions: { display: "flex", gap: "0.75rem", justifyContent: "flex-end", marginTop: "0.5rem" },
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