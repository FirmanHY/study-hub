import "./EmptyState.css";

export default function EmptyState({ icon, title, subtitle, action }) {
  return (
    <div className="empty-state-container">
      <div className="empty-icon">{icon}</div>
      <h3 className="empty-title">{title}</h3>
      <p className="empty-subtitle">{subtitle}</p>
      {action && (
        <button className="btn-primary" onClick={action.onClick}>
          {action.label}
        </button>
      )}
    </div>
  );
}
