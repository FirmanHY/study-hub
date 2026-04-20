import { useState, useEffect } from "react";

const EMPTY = { title: "", deadline: "", priority: "medium" };

export default function TaskForm({ initialData, onSubmit, onCancel, editing }) {
  // Dukung dua bentuk props: initialData (new) dan editing (legacy)
  const source = initialData || editing;

  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setForm(
      source
        ? {
            title: source.title || "",
            deadline: source.deadline || "",
            priority: source.priority || "medium",
          }
        : EMPTY
    );
    setErrors({});
  }, [source]);

  function validate(f) {
    const er = {};
    if (!f.title.trim()) er.title = "Judul tugas wajib diisi.";
    else if (f.title.trim().length < 2) er.title = "Judul minimal 2 karakter.";
    else if (f.title.length > 200) er.title = "Judul maksimal 200 karakter.";

    if (!f.deadline) er.deadline = "Deadline wajib diisi.";

    if (!["low", "medium", "high"].includes(f.priority))
      er.priority = "Prioritas tidak valid.";

    return er;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) {
      setErrors((er) => ({ ...er, [name]: "" }));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({ ...form, title: form.title.trim() });
      // Reset form hanya kalau ini mode create (bukan edit) & tidak ada error
      if (!source) setForm(EMPTY);
    } catch (err) {
      // Parent sudah tampilkan toast error.
      // Swallow di sini supaya tidak ada unhandled rejection,
      // dan biarkan form tetap terisi supaya user bisa retry.
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="entity-form" onSubmit={handleSubmit} noValidate style={styles.form}>
      <div style={styles.field}>
        <input
          name="title"
          placeholder="Judul tugas"
          value={form.title}
          onChange={handleChange}
          style={{
            ...styles.input,
            borderColor: errors.title ? "#dc2626" : "#e0e7ef",
          }}
          maxLength={200}
        />
        {errors.title && <span style={styles.fieldError}>{errors.title}</span>}
      </div>

      <div style={styles.field}>
        <input
          type="date"
          name="deadline"
          value={form.deadline}
          onChange={handleChange}
          style={{
            ...styles.input,
            borderColor: errors.deadline ? "#dc2626" : "#e0e7ef",
          }}
        />
        {errors.deadline && (
          <span style={styles.fieldError}>{errors.deadline}</span>
        )}
      </div>

      <div style={styles.field}>
        <select
          name="priority"
          value={form.priority}
          onChange={handleChange}
          style={styles.input}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <div style={styles.actions}>
        {onCancel && (
          <button
            type="button"
            className="cancel"
            onClick={onCancel}
            style={styles.cancelBtn}
            disabled={submitting}
          >
            Batal
          </button>
        )}
        <button type="submit" disabled={submitting} style={styles.submitBtn}>
          {submitting
            ? "Menyimpan..."
            : source
              ? "Update Task"
              : "Tambah Task"}
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
};