import { useState } from "react";
import { useTasks } from "../hooks/useTasks";
import { filterTasks } from "../utils/searchFilter";
import SearchBar from "../components/searchbar/SearchBar";
import SkeletonCard from "../components/skeleton/SkeletonCard";
import EmptyState from "../components/emptystate/EmptyState";
import TaskForm from "../components/tasks/TaskForm";


export default function TasksPage() {
  const { tasks, loading, create, update, remove } = useTasks();
  const [searchKeyword, setSearchKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const filteredTasks = filterTasks(tasks, {
    keyword: searchKeyword,
    status: statusFilter,
  });

  const handleCreate = async (data) => {
    await create(data);
    setShowForm(false);
  };

  const handleUpdate = async (id, data) => {
    await update(id, data);
    setEditingTask(null);
  };

  const handleToggleDone = async (task) => {
    await update(task.id, { done: !task.done });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Yakin ingin menghapus tugas ini?")) {
      await remove(id);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "#ef4444";
      case "medium":
        return "#f59e0b";
      case "low":
        return "#22c55e";
      default:
        return "#888";
    }
  };

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case "high":
        return "Tinggi";
      case "medium":
        return "Sedang";
      case "low":
        return "Rendah";
      default:
        return priority;
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">✅ Tugas</h1>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <SearchBar onSearch={setSearchKeyword} placeholder="Cari tugas..." />
          <button className="btn-primary" onClick={() => setShowForm(true)}>
            + Tambah Tugas
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="filter-tabs">
        {[
          { value: "all", label: "Semua" },
          { value: "pending", label: "Belum Selesai" },
          { value: "done", label: "Selesai" },
        ].map((tab) => (
          <button
            key={tab.value}
            className={`filter-tab ${statusFilter === tab.value ? "active" : ""}`}
            onClick={() => setStatusFilter(tab.value)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="card-grid">
          <SkeletonCard count={6} />
        </div>
      ) : filteredTasks.length === 0 ? (
        searchKeyword || statusFilter !== "all" ? (
          <EmptyState
            icon="🔍"
            title="Tidak ditemukan"
            subtitle="Tidak ada tugas yang cocok dengan filter saat ini."
          />
        ) : (
          <EmptyState
            icon="✅"
            title="Belum ada tugas"
            subtitle="Buat tugas pertamamu untuk mulai mengatur kegiatanmu."
            action={{
              label: "Tambah Tugas",
              onClick: () => setShowForm(true),
            }}
          />
        )
      ) : (
        <div className="card-grid">
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              className="card fade-enter-active"
              style={{
                opacity: task.done ? 0.7 : 1,
                borderLeft: `4px solid ${getPriorityColor(task.priority)}`,
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
                <input
                  type="checkbox"
                  checked={task.done}
                  onChange={() => handleToggleDone(task)}
                  style={{ marginTop: "4px", cursor: "pointer", width: "18px", height: "18px" }}
                />
                <div style={{ flex: 1 }}>
                  <h3
                    className="card-title"
                    style={{
                      textDecoration: task.done ? "line-through" : "none",
                      color: task.done ? "#999" : "#333",
                    }}
                  >
                    {task.title}
                  </h3>
                  <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem", flexWrap: "wrap" }}>
                    <span
                      style={{
                        fontSize: "0.75rem",
                        padding: "0.2rem 0.6rem",
                        borderRadius: "6px",
                        background: getPriorityColor(task.priority) + "20",
                        color: getPriorityColor(task.priority),
                        fontWeight: 600,
                      }}
                    >
                      {getPriorityLabel(task.priority)}
                    </span>
                    {task.deadline && (
                      <span style={{ fontSize: "0.75rem", color: "#888" }}>
                        📅{" "}
                        {new Date(task.deadline).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="card-footer">
                <span className="card-date">
                  {task.done ? "✅ Selesai" : "⏳ Belum selesai"}
                </span>
                <div className="card-actions">
                  <button onClick={() => setEditingTask(task)} title="Edit">
                    ✏️
                  </button>
                  <button onClick={() => handleDelete(task.id)} title="Hapus">
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
            <h2>Tambah Tugas Baru</h2>
            <TaskForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />
          </div>
        </div>
      )}

      {/* Modal Form - Edit */}
      {editingTask && (
        <div className="modal-overlay" onClick={() => setEditingTask(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Edit Tugas</h2>
            <TaskForm
              initialData={editingTask}
              onSubmit={(data) => handleUpdate(editingTask.id, data)}
              onCancel={() => setEditingTask(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
