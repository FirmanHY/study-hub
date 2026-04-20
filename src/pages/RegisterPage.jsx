import { useState } from "react";
import { useAuth } from "../contexts/AuthContext.jsx";
import { Link, useNavigate } from "react-router-dom";
import {
  validateEmail,
  validatePassword,
  validateName,
  validateConfirmPassword,
  getPasswordStrength,
  mapFirebaseAuthError,
} from "../utils/validators.js";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  const validateField = (name, value, formData = form) => {
    switch (name) {
      case "name":
        return validateName(value);
      case "email":
        return validateEmail(value);
      case "password":
        return validatePassword(value, { minLength: 6 });
      case "confirmPassword":
        return validateConfirmPassword(formData.password, value);
      default:
        return null;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...form, [name]: value };
    setForm(updated);
    setSubmitError("");

    if (touched[name]) {
      setErrors((er) => ({
        ...er,
        [name]: validateField(name, value, updated) || "",
      }));
    }
    // Kalau password berubah, re-validate confirmPassword (bila sudah touched).
    // Supaya pesan "tidak cocok" langsung hilang saat user fix password-nya.
    if (name === "password" && touched.confirmPassword) {
      setErrors((er) => ({
        ...er,
        confirmPassword:
          validateConfirmPassword(value, updated.confirmPassword) || "",
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((t) => ({ ...t, [name]: true }));
    setErrors((er) => ({ ...er, [name]: validateField(name, value) || "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");

    const newErrors = {
      name: validateField("name", form.name) || "",
      email: validateField("email", form.email) || "",
      password: validateField("password", form.password) || "",
      confirmPassword:
        validateField("confirmPassword", form.confirmPassword) || "",
    };
    setTouched({
      name: true,
      email: true,
      password: true,
      confirmPassword: true,
    });
    setErrors(newErrors);

    if (Object.values(newErrors).some((err) => err)) return;

    setLoading(true);
    try {
      // Trim nama, trim+lowercase email, password dikirim apa adanya
      await register(
        form.name.trim(),
        form.email.trim().toLowerCase(),
        form.password
      );
      navigate("/notes");
    } catch (err) {
      setSubmitError(mapFirebaseAuthError(err.code));
    } finally {
      setLoading(false);
    }
  };

  const hasError = (name) => Boolean(touched[name] && errors[name]);
  const strength = getPasswordStrength(form.password);

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h1 style={styles.logo}>📚 StudyHub</h1>
        <h2 style={styles.title}>Buat Akun Baru</h2>

        {submitError && <div style={styles.error}>{submitError}</div>}

        <form onSubmit={handleSubmit} style={styles.form} noValidate>
          {/* Nama */}
          <div style={styles.field}>
            <label style={styles.label}>Nama Lengkap</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              onBlur={handleBlur}
              style={{
                ...styles.input,
                borderColor: hasError("name") ? "#dc2626" : "#e0e7ef",
              }}
              placeholder="Masukkan nama lengkap"
              autoComplete="name"
              maxLength={50}
            />
            {hasError("name") && (
              <span style={styles.fieldError}>{errors.name}</span>
            )}
          </div>

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

          {/* Password + strength meter */}
          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <div style={styles.pwWrapper}>
              <input
                type={showPw ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                onBlur={handleBlur}
                style={{
                  ...styles.input,
                  paddingRight: "3rem",
                  borderColor: hasError("password") ? "#dc2626" : "#e0e7ef",
                }}
                placeholder="Minimal 6 karakter"
                autoComplete="new-password"
                maxLength={128}
              />
              <button
                type="button"
                onClick={() => setShowPw((s) => !s)}
                style={styles.pwToggle}
                tabIndex={-1}
                aria-label={
                  showPw ? "Sembunyikan password" : "Tampilkan password"
                }
              >
                {showPw ? "🙈" : "👁️"}
              </button>
            </div>

            {/* Strength indicator — hanya muncul saat user mulai mengetik */}
            {form.password && (
              <div style={styles.strengthWrapper}>
                <div style={styles.strengthTrack}>
                  <div
                    style={{
                      ...styles.strengthFill,
                      width: `${(strength.score / 4) * 100}%`,
                      background: strength.color,
                    }}
                  />
                </div>
                <span
                  style={{ ...styles.strengthLabel, color: strength.color }}
                >
                  {strength.label}
                </span>
              </div>
            )}

            {hasError("password") && (
              <span style={styles.fieldError}>{errors.password}</span>
            )}
          </div>

          {/* Konfirmasi Password */}
          <div style={styles.field}>
            <label style={styles.label}>Konfirmasi Password</label>
            <div style={styles.pwWrapper}>
              <input
                type={showConfirmPw ? "text" : "password"}
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                style={{
                  ...styles.input,
                  paddingRight: "3rem",
                  borderColor: hasError("confirmPassword")
                    ? "#dc2626"
                    : "#e0e7ef",
                }}
                placeholder="Ulangi password"
                autoComplete="new-password"
                maxLength={128}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPw((s) => !s)}
                style={styles.pwToggle}
                tabIndex={-1}
                aria-label={
                  showConfirmPw
                    ? "Sembunyikan password"
                    : "Tampilkan password"
                }
              >
                {showConfirmPw ? "🙈" : "👁️"}
              </button>
            </div>
            {hasError("confirmPassword") && (
              <span style={styles.fieldError}>{errors.confirmPassword}</span>
            )}
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
  strengthWrapper: {
    display: "flex",
    alignItems: "center",
    gap: "0.6rem",
    marginTop: "0.3rem",
  },
  strengthTrack: {
    flex: 1,
    height: "4px",
    background: "#e0e7ef",
    borderRadius: "3px",
    overflow: "hidden",
  },
  strengthFill: {
    height: "100%",
    borderRadius: "3px",
    transition: "width 0.3s ease, background 0.3s ease",
  },
  strengthLabel: {
    fontSize: "0.75rem",
    fontWeight: 600,
    minWidth: "80px",
    textAlign: "right",
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