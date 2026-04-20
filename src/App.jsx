import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { ToastProvider } from "./contexts/ToastContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Layout from "./components/Layout.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import NotesPage from "./pages/NotesPage.jsx";
import TasksPage from "./pages/TasksPage.jsx";
import FlashcardsPage from "./pages/FlashcardsPage.jsx";

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected Routes */}
            <Route
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route path="/notes" element={<NotesPage />} />
              <Route path="/tasks" element={<TasksPage />} />
              <Route path="/flashcards" element={<FlashcardsPage />} />
            </Route>

            {/* Default redirect */}
            <Route path="*" element={<Navigate to="/notes" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ToastProvider>
  );
}