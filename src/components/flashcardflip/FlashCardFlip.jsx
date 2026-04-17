import { useState } from "react";
import "./FlashcardFlip.css";

export default function FlashcardFlip({ cards }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  if (!cards || cards.length === 0) {
    return (
      <div className="empty-state">
        <p>Belum ada flashcard. Buat flashcard pertamamu!</p>
      </div>
    );
  }

  const card = cards[currentIndex];

  const handleNext = () => {
    setFlipped(false);
    setCurrentIndex((prev) => (prev < cards.length - 1 ? prev + 1 : 0));
  };

  const handlePrev = () => {
    setFlipped(false);
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : cards.length - 1));
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowRight") handleNext();
    if (e.key === "ArrowLeft") handlePrev();
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      setFlipped(!flipped);
    }
  };

  return (
    <div className="flashcard-study" onKeyDown={handleKeyDown} tabIndex={0}>
      <div className="progress-bar">
        <div className="progress-text">
          <span>
            {currentIndex + 1} / {cards.length}
          </span>
        </div>
        <div className="progress-track">
          <div
            className="progress-fill"
            style={{
              width: `${((currentIndex + 1) / cards.length) * 100}%`,
            }}
          />
        </div>
      </div>

      <div
        className={`flip-card ${flipped ? "flipped" : ""}`}
        onClick={() => setFlipped(!flipped)}
      >
        <div className="flip-card-inner">
          <div className="flip-card-front">
            <p className="label">PERTANYAAN</p>
            <p className="card-text">{card.question}</p>
            <p className="hint">Klik untuk melihat jawaban</p>
          </div>
          <div className="flip-card-back">
            <p className="label">JAWABAN</p>
            <p className="card-text">{card.answer}</p>
            <p className="hint hint-back">Klik untuk kembali ke pertanyaan</p>
          </div>
        </div>
      </div>

      <div className="nav-buttons">
        <button className="nav-btn" onClick={handlePrev}>
          ← Sebelumnya
        </button>
        <button className="nav-btn" onClick={handleNext}>
          Selanjutnya →
        </button>
      </div>

      <p className="keyboard-hint">
        Gunakan ← → untuk navigasi, Spasi untuk membalik kartu
      </p>
    </div>
  );
}