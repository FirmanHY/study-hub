import { useState, useEffect } from "react";

const EMPTY = { question: "", answer: "" };

export default function FlashcardForm({ onSubmit, editing, onCancelEdit }) {
  const [form, setForm] = useState(EMPTY);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setForm(editing ? { question: editing.question, answer: editing.answer } : EMPTY);
  }, [editing]);

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.question.trim() || !form.answer.trim()) return;
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
        name="question"
        placeholder="Pertanyaan"
        value={form.question}
        onChange={handleChange}
        required
      />
      <input
        name="answer"
        placeholder="Jawaban"
        value={form.answer}
        onChange={handleChange}
        required
      />
      <div className="form-actions">
        <button type="submit" disabled={submitting}>
          {submitting ? "Menyimpan..." : editing ? "Update Flashcard" : "Tambah Flashcard"}
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
