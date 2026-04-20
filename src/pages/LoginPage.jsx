import { useState } from "react";
import { useAuth } from "../contexts/AuthContext.jsx";
import { Link, useNavigate } from "react-router-dom";
import {
  validateEmail,
  validatePassword,
  mapFirebaseAuthError,
} from "../utils/validators.js";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [touched, setTouched] = useState({ email: false, password: false });
  const [submitError, setSubmitError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Jalankan validasi field yang tepat berdasarkan nama
  const validateField = (name, value) => {
    if (name === "email") return validateEmail(value);
    if (name === "password") return validatePassword(value);
    return null;
  };

  // Update form + re-validasi hanya jika field sudah pernah di-blur (touched)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setSubmitError("");
    if (touched[name]) {
      setErrors((er) => ({ ...er, [name]: validateField(name, value) || "" }));
    }
  };

  // Saat user keluar dari field → mark touched + validasi
  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((t) => ({ ...t, [name]: true }));
    setErrors((er) => ({ ...er, [name]: validateField(name, value) || "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");

    // Validasi semua field saat submit
    const emailErr = validateField("email", form.email);
    const passwordErr = validateField("password", form.password);

    setTouched({ email: true, password: true });
    setErrors({ email: emailErr || "", password: passwordErr || "" });

    if (emailErr || passwordErr) return;

    setLoading(true);
    try {
      // Trim + lowercase email sebelum kirim ke Firebase
      await login(form.email.trim().toLowerCase(), form.password);
      navigate("/notes");
    } catch (err) {
      setSubmitError(mapFirebaseAuthError(err.code));
    } finally {
      setLoading(false);
    }
  };

  const hasError = (name) => Boolean(touched[name] && errors[name]);

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h1 style={styles.logo}>📚 StudyHub</h1>
        <h2 style={styles.title}>Masuk ke Akunmu</h2>

        {submitError && <div style={styles.error}>{submitError}</div>}

        <form onSubmit={handleSubmit} style={styles.form} noValidate>
          {/* Email */}
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              onBlur={handleBlur}
              style={{
                ...styles.input,
                borderColor: hasError("email") ? "#dc2626" : "#e0e7ef",
              }}
              placeholder="nama@email.com"
              autoComplete="email"
              maxLength={254}
            />
            {hasError("email") && (
              <span style={styles.fieldError}>{errors.email}</span>
            )}
          </div>

          {/* Password + toggle show/hide */}
          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <div style={styles.pwWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                onBlur={handleBlur}
                style={{
                  ...styles.input,
                  paddingRight: "3rem",
                  borderColor: hasError("password") ? "#dc2626" : "#e0e7ef",
                }}
                placeholder="Masukkan password"
                autoComplete="current-password"
                maxLength={128}
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                style={styles.pwToggle}
                tabIndex={-1}
                aria-label={
                  showPassword ? "Sembunyikan password" : "Tampilkan password"
                }
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
            {hasError("password") && (
              <span style={styles.fieldError}>{errors.password}</span>
            )}
          </div>

          <button type="submit" disabled={loading} style={styles.btn}>
            {loading ? "Memproses..." : "Login"}
          </button>
        </form>

        <p style={styles.footer}>
          Belum punya akun?{" "}
          <Link to="/register" style={styles.link}>
            Daftar di sini
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
    border: "1px solid #fecaca",
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
    width: "100%",
    boxSizing: "border-box",
  },
  fieldError: {
    fontSize: "0.8rem",
    color: "#dc2626",
    marginTop: "0.15rem",
  },
  pwWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  pwToggle: {
    position: "absolute",
    right: "0.75rem",
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "1.1rem",
    padding: "0.25rem",
    opacity: 0.7,
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
  footer: {
    textAlign: "center",
    marginTop: "1.5rem",
    fontSize: "0.9rem",
    color: "#666",
  },
  link: { color: "#667eea", fontWeight: 600, textDecoration: "none" },
};