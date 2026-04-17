import { useState } from "react";
import { useNotes } from "../hooks/useNotes";
import { searchNotes } from "../utils/searchFilter";
import SearchBar from "../components/searchbar/SearchBar";
import SkeletonCard from "../components/skeleton/SkeletonCard";
import EmptyState from "../components/emptystate/EmptyState";
import NoteForm from "../components/notes/NoteForm"


export default function NotesPage() {
  const { notes, loading, create, update, remove } = useNotes();
  const [searchKeyword, setSearchKeyword] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingNote, setEditingNote] = useState(null);

  const filteredNotes = searchNotes(notes, searchKeyword);

  const handleCreate = async (data) => {
    await create(data);
    setShowForm(false);
  };

  const handleUpdate = async (data) => {
    if (editingNote) {
      await update(editingNote.id, data);
      setEditingNote(null);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Yakin ingin menghapus catatan ini?")) {
      await remove(id);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">📝 Catatan</h1>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <SearchBar
            onSearch={setSearchKeyword}
            placeholder="Cari catatan..."
          />
          <button className="btn-primary" onClick={() => setShowForm(true)}>
            + Buat Catatan
          </button>
        </div>
      </div>

      {loading ? (
        <div className="card-grid">
          <SkeletonCard count={6} />
        </div>
      ) : filteredNotes.length === 0 ? (
        searchKeyword ? (
          <EmptyState
            icon="🔍"
            title="Tidak ditemukan"
            subtitle={`Tidak ada catatan yang cocok dengan "${searchKeyword}"`}
          />
        ) : (
          <EmptyState
            icon="📝"
            title="Belum ada catatan"
            subtitle="Mulai buat catatan pertamamu untuk menyimpan ide-ide."
            action={{ label: "Buat Catatan", onClick: () => setShowForm(true) }}
          />
        )
      ) : (
        <div className="card-grid">
          {filteredNotes.map((note) => (
            <div key={note.id} className="card fade-enter-active">
              <h3 className="card-title">{note.title}</h3>
              <p className="card-content">
                {note.content?.length > 120
                  ? note.content.substring(0, 120) + "..."
                  : note.content}
              </p>
              {note.imageUrl && (
                <img
                  src={note.imageUrl}
                  alt="Lampiran"
                  style={{
                    width: "100%",
                    borderRadius: "8px",
                    marginTop: "0.75rem",
                    maxHeight: "150px",
                    objectFit: "cover",
                  }}
                />
              )}
              <div className="card-footer">
                <span className="card-date">
                  {new Date(note.updatedAt).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
                <div className="card-actions">
                  <button
                    onClick={() => setEditingNote(note)}
                    title="Edit"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(note.id)}
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
            <h2>Buat Catatan Baru</h2>
            <NoteForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />
          </div>
        </div>
      )}

      {/* Modal Form - Edit */}
      {editingNote && (
        <div className="modal-overlay" onClick={() => setEditingNote(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Edit Catatan</h2>
            <NoteForm
              initialData={editingNote}
              onSubmit={handleUpdate}
              onCancel={() => setEditingNote(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
