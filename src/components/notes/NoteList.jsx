export default function NoteList({ notes, onEdit, onDelete }) {
  if (notes.length === 0) {
    return <p className="empty-state">Belum ada catatan.</p>;
  }

  return (
    <ul className="entity-list">
      {notes.map((note) => (
        <li key={note.id}>
          <div className="item-content">
            <strong>{note.title}</strong>
            <span>{note.content}</span>
            {note.imageUrl && (
              <img
                src={note.imageUrl}
                alt={note.title}
                className="note-thumbnail"
              />
            )}
            <span className="item-meta">
              {new Date(note.updatedAt).toLocaleString("id-ID")}
            </span>
          </div>
          <div className="actions">
            <button onClick={() => onEdit(note)}>Edit</button>
            <button className="danger" onClick={() => onDelete(note.id)}>
              Hapus
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
