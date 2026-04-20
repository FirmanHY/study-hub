import { useState } from "react";

export default function FlashcardForm({ initialData, onSubmit, onCancel }) {
  const [question, setQuestion] = useState(initialData?.question || "");
  const [answer, setAnswer] = useState(initialData?.answer || "");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  function validate() {
    const er = {};
    if (!question.trim()) er.question = "Pertanyaan wajib diisi.";
    else if (question.trim().length < 3)
      er.question = "Pertanyaan minimal 3 karakter.";
    else if (question.length > 500)
      er.question = "Pertanyaan maksimal 500 karakter.";

    if (!answer.trim()) er.answer = "Jawaban wajib diisi.";
    else if (answer.trim().length < 1) er.answer = "Jawaban wajib diisi.";
    else if (answer.length > 1000)
      er.answer = "Jawaban maksimal 1000 karakter.";

    return er;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});

    setLoading(true);
    try {
      await onSubmit({ question: question.trim(), answer: answer.trim() });
      // Parent yang menutup modal + tampilkan toast sukses
    } catch (err) {
      // Parent sudah tampilkan toast error. Swallow & biarkan form tetap isi.
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form} noValidate>
      <div style={styles.field}>
        <label style={styles.label}>Pertanyaan</label>
        <textarea
          value={question}
          onChange={(e) => {
            setQuestion(e.target.value);
            if (errors.question) setErrors((er) => ({ ...er, question: "" }));
          }}
          style={{
            ...styles.input,
            minHeight: "80px",
            resize: "vertical",
            borderColor: errors.question ? "#dc2626" : "#e0e7ef",
          }}
          placeholder="Tulis pertanyaan di sini..."
          maxLength={500}
        />
        {errors.question && (
          <span style={styles.fieldError}>{errors.question}</span>
        )}
      </div>

      <div style={styles.field}>
        <label style={styles.label}>Jawaban</label>
        <textarea
          value={answer}
          onChange={(e) => {
            setAnswer(e.target.value);
            if (errors.answer) setErrors((er) => ({ ...er, answer: "" }));
          }}
          style={{
            ...styles.input,
            minHeight: "80px",
            resize: "vertical",
            borderColor: errors.answer ? "#dc2626" : "#e0e7ef",
          }}
          placeholder="Tulis jawaban di sini..."
          maxLength={1000}
        />
        {errors.answer && (
          <span style={styles.fieldError}>{errors.answer}</span>
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
};