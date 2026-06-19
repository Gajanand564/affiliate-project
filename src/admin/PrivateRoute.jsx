import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "#d0eaf8", fontFamily: "'Inter',sans-serif", color: "#4a7fa5", flexDirection: "column", gap: 12 }}>
      <div style={{ fontSize: "2rem", animation: "spin 1s linear infinite" }}>⚡</div>
      <p>Loading...</p>
      <style>{`@keyframes spin{100%{transform:rotate(360deg)}}`}</style>
    </div>
  );
  return user ? children : <Navigate to="/admin/login" replace />;
}
