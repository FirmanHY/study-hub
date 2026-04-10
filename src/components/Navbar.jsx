import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <header className="navbar">
      <h1>📚 StudyHub</h1>
      <div className="user-info">
        <span>{user?.displayName || user?.email}</span>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </header>
  );
}
