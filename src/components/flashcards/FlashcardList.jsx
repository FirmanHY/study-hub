export default function FlashcardList({ flashcards, onEdit, onDelete }) {
  if (flashcards.length === 0) {
    return <p className="empty-state">Belum ada flashcard.</p>;
  }

  return (
    <ul className="entity-list">
      {flashcards.map((card) => (
        <li key={card.id}>
          <div className="item-content">
            <strong>Q: {card.question}</strong>
            <span>A: {card.answer}</span>
          </div>
          <div className="actions">
            <button onClick={() => onEdit(card)}>Edit</button>
            <button className="danger" onClick={() => onDelete(card.id)}>
              Hapus
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
