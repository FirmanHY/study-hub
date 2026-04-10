import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (form.password.length < 6) {
      setError("Password minimal 6 karakter.");
      return;
    }

    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      setSuccess(
        "Registrasi berhasil! Email verifikasi telah dikirim. Anda akan diarahkan ke dashboard..."
      );
      setTimeout(() => navigate("/dashboard", { replace: true }), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>📚 StudyHub</h1>
        <p className="subtitle">Buat akun baru</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          {error && <div className="alert error">{error}</div>}
          {success && <div className="alert success">{success}</div>}
          <input
            type="text"
            name="name"
            placeholder="Nama lengkap"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password (min. 6 karakter)"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Memproses..." : "Daftar"}
          </button>
          <div className="alert info">
            ✉️ Setelah registrasi, link verifikasi akan dikirim ke email Anda.
          </div>
        </form>

        <p className="auth-switch">
          Sudah punya akun? <Link to="/login">Login di sini</Link>
        </p>
      </div>
    </div>
  );
}
