import { useState } from "react";
import Navbar from "../components/Navbar.jsx";
import VerifyBanner from "../components/VerifyBanner.jsx";
import NoteForm from "../components/notes/NoteForm.jsx";
import NoteList from "../components/notes/NoteList.jsx";
import TaskForm from "../components/tasks/TaskForm.jsx";
import TaskList from "../components/tasks/TaskList.jsx";
import FlashcardForm from "../components/flashcards/FlashcardForm.jsx";
import FlashcardList from "../components/flashcards/FlashcardList.jsx";
import { useNotes } from "../hooks/useNotes.js";
import { useTasks } from "../hooks/useTasks.js";
import { useFlashcards } from "../hooks/useFlashcards.js";

export default function Dashboard() {
  const notes = useNotes();
  const tasks = useTasks();
  const flashcards = useFlashcards();

  const [editingNote, setEditingNote] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [editingCard, setEditingCard] = useState(null);

  // ===== Notes handlers =====
  async function handleNoteSubmit(data) {
    if (editingNote) {
      await notes.update(editingNote.id, data);
      setEditingNote(null);
    } else {
      await notes.create(data);
    }
  }

  async function handleNoteDelete(id) {
    if (confirm("Hapus catatan ini?")) await notes.remove(id);
  }

  // ===== Tasks handlers =====
  async function handleTaskSubmit(data) {
    if (editingTask) {
      await tasks.update(editingTask.id, data);
      setEditingTask(null);
    } else {
      await tasks.create(data);
    }
  }

  async function handleTaskDelete(id) {
    if (confirm("Hapus tugas ini?")) await tasks.remove(id);
  }

  // ===== Flashcards handlers =====
  async function handleCardSubmit(data) {
    if (editingCard) {
      await flashcards.update(editingCard.id, data);
      setEditingCard(null);
    } else {
      await flashcards.create(data);
    }
  }

  async function handleCardDelete(id) {
    if (confirm("Hapus flashcard ini?")) await flashcards.remove(id);
  }

  return (
    <>
      <Navbar />
      <VerifyBanner />

      <main className="dashboard-grid">
        {/* NOTES MODULE */}
        <section className="module-card">
          <h2>📝 Notes</h2>
          <NoteForm
            onSubmit={handleNoteSubmit}
            editing={editingNote}
            onCancelEdit={() => setEditingNote(null)}
          />
          {notes.loading ? (
            <p className="empty-state">Memuat...</p>
          ) : (
            <NoteList
              notes={notes.notes}
              onEdit={setEditingNote}
              onDelete={handleNoteDelete}
            />
          )}
        </section>

        {/* TASKS MODULE */}
        <section className="module-card">
          <h2>✅ Tasks</h2>
          <TaskForm
            onSubmit={handleTaskSubmit}
            editing={editingTask}
            onCancelEdit={() => setEditingTask(null)}
          />
          {tasks.loading ? (
            <p className="empty-state">Memuat...</p>
          ) : (
            <TaskList
              tasks={tasks.tasks}
              onEdit={setEditingTask}
              onDelete={handleTaskDelete}
              onToggle={tasks.toggleDone}
            />
          )}
        </section>

        {/* FLASHCARDS MODULE */}
        <section className="module-card">
          <h2>🎴 Flashcards</h2>
          <FlashcardForm
            onSubmit={handleCardSubmit}
            editing={editingCard}
            onCancelEdit={() => setEditingCard(null)}
          />
          {flashcards.loading ? (
            <p className="empty-state">Memuat...</p>
          ) : (
            <FlashcardList
              flashcards={flashcards.flashcards}
              onEdit={setEditingCard}
              onDelete={handleCardDelete}
            />
          )}
        </section>
      </main>
    </>
  );
}
