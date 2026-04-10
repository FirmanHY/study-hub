import { useState, useEffect } from "react";
import { uploadImage } from "../../services/cloudinaryService.js";

const EMPTY = { title: "", content: "" };

export default function NoteForm({ onSubmit, editing, onCancelEdit }) {
  const [form, setForm] = useState(EMPTY);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");

  useEffect(() => {
    if (editing) {
      setForm({ title: editing.title, content: editing.content });
      setImagePreview(editing.imageUrl || null);
    } else {
      setForm(EMPTY);
      setImagePreview(null);
    }
    setImageFile(null);
    setUploadStatus("");
  }, [editing]);

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("File harus berupa gambar.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("Ukuran gambar maksimal 5MB.");
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  function handleRemoveImage() {
    setImageFile(null);
    setImagePreview(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) return;

    setSubmitting(true);
    try {
      let imageData = {};

      // Upload ke Cloudinary jika ada file baru
      if (imageFile) {
        setUploadStatus("Mengupload gambar...");
        const uploaded = await uploadImage(imageFile);
        imageData = { imageUrl: uploaded.url, imagePublicId: uploaded.publicId };
      } else if (editing && !imagePreview) {
        // Gambar lama dihapus user
        imageData = { imageUrl: null, imagePublicId: null };
      }

      setUploadStatus("Menyimpan...");
      await onSubmit({ ...form, ...imageData });

      setForm(EMPTY);
      setImageFile(null);
      setImagePreview(null);
    } catch (err) {
      alert("Gagal menyimpan: " + err.message);
    } finally {
      setSubmitting(false);
      setUploadStatus("");
    }
  }

  return (
    <form className="entity-form" onSubmit={handleSubmit}>
      <input
        name="title"
        placeholder="Judul catatan"
        value={form.title}
        onChange={handleChange}
        required
      />
      <textarea
        name="content"
        placeholder="Isi catatan"
        value={form.content}
        onChange={handleChange}
        required
      />

      <label className="file-input-label">
        📎 {imageFile ? imageFile.name : "Tambah gambar (opsional)"}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
      </label>

      {imagePreview && (
        <div className="image-preview">
          <img src={imagePreview} alt="preview" />
          <button type="button" className="remove-img" onClick={handleRemoveImage}>
            ✕ Hapus gambar
          </button>
        </div>
      )}

      <div className="form-actions">
        <button type="submit" disabled={submitting}>
          {submitting
            ? uploadStatus || "Menyimpan..."
            : editing
            ? "Update Note"
            : "Tambah Note"}
        </button>
        {editing && (
          <button type="button" className="cancel" onClick={onCancelEdit}>
            Batal
          </button>
        )}
      </div>
    </form>
  );
}
