import { useState } from "react";
import { useFlashcards } from "../hooks/useFlashcards";
import FlashcardFlip from "../components/flashcardflip/FlashCardFlip";
import EmptyState from "../components/emptystate/EmptyState";
import SkeletonCard from "../components/skeleton/SkeletonCard";
import FlashcardForm from "../components/flashcards/FlashcardForm";


export default function FlashcardsPage() {
  const { flashcards, loading, create, update, remove } = useFlashcards();
  const [showForm, setShowForm] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [studyMode, setStudyMode] = useState(false);

  const handleCreate = async (data) => {
    await create(data);
    setShowForm(false);
  };

  const handleUpdate = async (data) => {
    if (editingCard) {
      await update(editingCard.id, data);
      setEditingCard(null);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Yakin ingin menghapus flashcard ini?")) {
      await remove(id);
    }
  };

  // Mode Belajar (Flip)
  if (studyMode && flashcards.length > 0) {
    return (
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">🎯 Mode Belajar</h1>
          <button
            className="btn-primary"
            onClick={() => setStudyMode(false)}
            style={{
              background: "#fff",
              color: "#667eea",
              border: "2px solid #667eea",
            }}
          >
            ← Kembali ke Daftar
          </button>
        </div>
        <FlashcardFlip cards={flashcards} />
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">🃏 Flashcards</h1>
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          {flashcards.length > 0 && (
            <button
              className="btn-primary"
              onClick={() => setStudyMode(true)}
              style={{
                background: "linear-gradient(135deg, #22c55e, #16a34a)",
              }}
            >
              🎯 Mode Belajar
            </button>
          )}
          <button className="btn-primary" onClick={() => setShowForm(true)}>
            + Buat Flashcard
          </button>
        </div>
      </div>

      {loading ? (
        <div className="card-grid">
          <SkeletonCard count={6} />
        </div>
      ) : flashcards.length === 0 ? (
        <EmptyState
          icon="🃏"
          title="Belum ada flashcard"
          subtitle="Buat flashcard untuk membantu proses belajarmu."
          action={{
            label: "Buat Flashcard",
            onClick: () => setShowForm(true),
          }}
        />
      ) : (
        <div className="card-grid">
          {flashcards.map((card) => (
            <div key={card.id} className="card fade-enter-active">
              <div>
                <p
                  style={{
                    fontSize: "0.7rem",
                    letterSpacing: "1.5px",
                    color: "#888",
                    textTransform: "uppercase",
                    marginBottom: "0.25rem",
                  }}
                >
                  Pertanyaan
                </p>
                <h3 className="card-title">{card.question}</h3>
              </div>
              <div style={{ marginTop: "0.75rem" }}>
                <p
                  style={{
                    fontSize: "0.7rem",
                    letterSpacing: "1.5px",
                    color: "#888",
                    textTransform: "uppercase",
                    marginBottom: "0.25rem",
                  }}
                >
                  Jawaban
                </p>
                <p className="card-content">{card.answer}</p>
              </div>
              <div className="card-footer">
                <span className="card-date">
                  {new Date(card.createdAt).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
                <div className="card-actions">
                  <button
                    onClick={() => setEditingCard(card)}
                    title="Edit"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(card.id)}
                    title="Hapus"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Form - Create */}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Buat Flashcard Baru</h2>
            <FlashcardForm
              onSubmit={handleCreate}
              onCancel={() => setShowForm(false)}
            />
          </div>
        </div>
      )}

      {/* Modal Form - Edit */}
      {editingCard && (
        <div className="modal-overlay" onClick={() => setEditingCard(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Edit Flashcard</h2>
            <FlashcardForm
              initialData={editingCard}
              onSubmit={handleUpdate}
              onCancel={() => setEditingCard(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}