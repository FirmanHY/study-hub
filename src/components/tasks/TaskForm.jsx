import { useState, useEffect } from "react";

const EMPTY = { title: "", deadline: "", priority: "medium" };

export default function TaskForm({ onSubmit, editing, onCancelEdit }) {
  const [form, setForm] = useState(EMPTY);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setForm(
      editing
        ? { title: editing.title, deadline: editing.deadline, priority: editing.priority }
        : EMPTY
    );
  }, [editing]);

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim() || !form.deadline) return;
    setSubmitting(true);
    try {
      await onSubmit(form);
      setForm(EMPTY);
    } catch (err) {
      alert("Gagal menyimpan: " + err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="entity-form" onSubmit={handleSubmit}>
      <input
        name="title"
        placeholder="Judul tugas"
        value={form.title}
        onChange={handleChange}
        required
      />
      <input
        type="date"
        name="deadline"
        value={form.deadline}
        onChange={handleChange}
        required
      />
      <select name="priority" value={form.priority} onChange={handleChange}>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <div className="form-actions">
        <button type="submit" disabled={submitting}>
          {submitting ? "Menyimpan..." : editing ? "Update Task" : "Tambah Task"}
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
