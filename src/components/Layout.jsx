import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";
import "../styles/responsive.css";
import VerifyBanner from "./VerifyBanner.jsx";

export default function Layout() {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error("Logout gagal:", err);
    }
  };

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="app-container">
      {/* Overlay (mobile) */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? "visible" : ""}`}
        onClick={closeSidebar}
      />

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">📚 StudyHub</div>
        <nav className="sidebar-nav">
          <NavLink to="/notes" onClick={closeSidebar}>
            📝 Catatan
          </NavLink>
          <NavLink to="/tasks" onClick={closeSidebar}>
            ✅ Tugas
          </NavLink>
          <NavLink to="/flashcards" onClick={closeSidebar}>
            🃏 Flashcards
          </NavLink>
        </nav>

        <div style={{ marginTop: "auto", paddingTop: "1rem" }}>
          <div
            style={{
              fontSize: "0.8rem",
              color: "rgba(255,255,255,0.5)",
              marginBottom: "0.75rem",
              wordBreak: "break-all",
            }}
          >
            {user?.email}
          </div>
          <button
            onClick={handleLogout}
            style={{
              width: "100%",
              padding: "0.6rem",
              background: "rgba(255,255,255,0.1)",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: "10px",
              cursor: "pointer",
              fontSize: "0.9rem",
              transition: "background 0.2s",
            }}
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <VerifyBanner/>
        <Outlet />
      </main>

      {/* Mobile Menu Toggle */}
      <button
        className="menu-toggle"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? "✕" : "☰"}
      </button>
    </div>
  );
}
