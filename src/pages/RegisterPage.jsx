import { useState } from "react";
import { useAuth } from "../contexts/AuthContext.jsx";
import { Link, useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      return setError("Password dan konfirmasi tidak cocok.");
    }
    if (password.length < 6) {
      return setError("Password minimal 6 karakter.");
    }

    setLoading(true);
    try {
      await register(name, email, password);
      navigate("/notes");
    } catch (err) {
      setError(
        err.code === "auth/email-already-in-use"
          ? "Email sudah terdaftar. Gunakan email lain."
          : err.code === "auth/weak-password"
            ? "Password terlalu lemah. Gunakan minimal 6 karakter."
            : "Registrasi gagal. Silakan coba lagi."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h1 style={styles.logo}>📚 StudyHub</h1>
        <h2 style={styles.title}>Buat Akun Baru</h2>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Nama Lengkap</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={styles.input}
              placeholder="Masukkan nama lengkap"
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
              placeholder="nama@email.com"
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.input}
              placeholder="Minimal 6 karakter"
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Konfirmasi Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              style={styles.input}
              placeholder="Ulangi password"
            />
          </div>
          <button type="submit" disabled={loading} style={styles.btn}>
            {loading ? "Memproses..." : "Daftar"}
          </button>
        </form>

        <p style={styles.footer}>
          Sudah punya akun?{" "}
          <Link to="/login" style={styles.link}>
            Login di sini
          </Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    padding: "1rem",
  },
  card: {
    background: "#fff",
    borderRadius: "20px",
    padding: "2.5rem",
    width: "100%",
    maxWidth: "420px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
  },
  logo: { textAlign: "center", fontSize: "2rem", margin: "0 0 0.5rem" },
  title: {
    textAlign: "center",
    fontSize: "1.2rem",
    color: "#555",
    fontWeight: 500,
    margin: "0 0 1.5rem",
  },
  error: {
    background: "#fef2f2",
    color: "#dc2626",
    padding: "0.75rem 1rem",
    borderRadius: "10px",
    fontSize: "0.9rem",
    marginBottom: "1rem",
  },
  form: { display: "flex", flexDirection: "column", gap: "1rem" },
  field: { display: "flex", flexDirection: "column", gap: "0.3rem" },
  label: { fontSize: "0.85rem", fontWeight: 600, color: "#444" },
  input: {
    padding: "0.75rem 1rem",
    border: "2px solid #e0e7ef",
    borderRadius: "12px",
    fontSize: "0.95rem",
    outline: "none",
    transition: "border-color 0.2s",
  },
  btn: {
    padding: "0.85rem",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    fontSize: "1rem",
    fontWeight: 600,
    cursor: "pointer",
    marginTop: "0.5rem",
  },
  footer: { textAlign: "center", marginTop: "1.5rem", fontSize: "0.9rem", color: "#666" },
  link: { color: "#667eea", fontWeight: 600, textDecoration: "none" },
};