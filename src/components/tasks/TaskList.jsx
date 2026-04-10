export default function TaskList({ tasks, onEdit, onDelete, onToggle }) {
  if (tasks.length === 0) {
    return <p className="empty-state">Belum ada tugas.</p>;
  }

  return (
    <ul className="entity-list">
      {tasks.map((task) => (
        <li
          key={task.id}
          className={`priority-${task.priority} ${task.done ? "task-done" : ""}`}
        >
          <div className="item-content">
            <strong>{task.title}</strong>
            <span className="item-meta">
              📅 {task.deadline} • Priority: {task.priority}
            </span>
          </div>
          <div className="actions">
            <button className="toggle" onClick={() => onToggle(task.id, task.done)}>
              {task.done ? "Undo" : "Done"}
            </button>
            <button onClick={() => onEdit(task)}>Edit</button>
            <button className="danger" onClick={() => onDelete(task.id)}>
              Hapus
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
