import { useState } from "react";

export default function FlashcardForm({ initialData, onSubmit, onCancel }) {
  const [question, setQuestion] = useState(initialData?.question || "");
  const [answer, setAnswer] = useState(initialData?.answer || "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim() || !answer.trim()) return;

    setLoading(true);
    try {
      await onSubmit({ question, answer });
    } catch (err) {
      console.error("Gagal menyimpan flashcard:", err);
      alert("Gagal menyimpan. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <div style={styles.field}>
        <label style={styles.label}>Pertanyaan</label>
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          required
          style={{ ...styles.input, minHeight: "80px", resize: "vertical" }}
          placeholder="Tulis pertanyaan di sini..."
        />
      </div>

      <div style={styles.field}>
        <label style={styles.label}>Jawaban</label>
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          required
          style={{ ...styles.input, minHeight: "80px", resize: "vertical" }}
          placeholder="Tulis jawaban di sini..."
        />
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
};