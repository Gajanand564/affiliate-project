import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { login } from "../services/api";
import { LogIn, Eye, EyeOff } from "lucide-react";

export default function AdminLogin() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { token, user } = await login(form);
      loginUser(token, user);
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#d0eaf8", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: "'Inter',sans-serif" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(0,180,216,0.07) 1px,transparent 1px)", backgroundSize: "30px 30px" }} />

      <motion.div initial={{ opacity: 0, y: 24, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.45 }}
        style={{ width: "100%", maxWidth: 420, position: "relative", zIndex: 2 }}>

        {/* Logo card */}
        <div style={{ background: "#fff", borderRadius: 20, padding: "32px 36px", boxShadow: "0 8px 40px rgba(0,100,160,0.14)", border: "1px solid rgba(0,180,216,0.15)" }}>
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div style={{ width: 60, height: 60, borderRadius: 16, background: "linear-gradient(135deg,#00b4d8,#0077b6)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px", boxShadow: "0 6px 20px rgba(0,180,216,0.35)" }}>
              <span style={{ fontSize: "1.6rem" }}>⚡</span>
            </div>
            <h1 style={{ fontSize: "1.4rem", fontWeight: 900, color: "#023e8a", marginBottom: 4 }}>DealZone Admin</h1>
            <p style={{ fontSize: ".82rem", color: "#4a7fa5" }}>Affiliate Marketing Manager</p>
          </div>

          {/* User badge area */}
          <div style={{ background: "#e8f4fd", border: "1px solid rgba(0,180,216,0.2)", borderRadius: 12, padding: "10px 16px", marginBottom: 24, display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#29b6f6", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: "#fff", fontSize: ".78rem", flexShrink: 0 }}>AD</div>
            <div>
              <div style={{ fontWeight: 700, color: "#023e8a", fontSize: ".88rem" }}>Affiliate Admin Access</div>
              <div style={{ fontSize: ".7rem", color: "#4a7fa5" }}>Restricted — authorized users only</div>
            </div>
          </div>

          {error && (
            <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
              style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 10, padding: "10px 14px", color: "#dc2626", fontSize: ".85rem", marginBottom: 18, fontWeight: 500 }}>
              ⚠ {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label style={{ fontSize: ".8rem", fontWeight: 600, color: "#4a7fa5", display: "block", marginBottom: 6 }}>Username</label>
              <input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} placeholder="admin"
                required autoComplete="username"
                style={{ width: "100%", padding: "11px 16px", borderRadius: 10, border: "1.5px solid rgba(0,180,216,0.25)", background: "#f0f9ff", color: "#023e8a", fontSize: ".95rem", outline: "none", transition: "border-color .2s, box-shadow .2s" }}
                onFocus={e => { e.target.style.borderColor = "#00b4d8"; e.target.style.boxShadow = "0 0 0 3px rgba(0,180,216,0.12)"; }}
                onBlur={e => { e.target.style.borderColor = "rgba(0,180,216,0.25)"; e.target.style.boxShadow = "none"; }} />
            </div>

            <div>
              <label style={{ fontSize: ".8rem", fontWeight: 600, color: "#4a7fa5", display: "block", marginBottom: 6 }}>Password</label>
              <div style={{ position: "relative" }}>
                <input type={showPwd ? "text" : "password"} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="••••••••"
                  required autoComplete="current-password"
                  style={{ width: "100%", padding: "11px 44px 11px 16px", borderRadius: 10, border: "1.5px solid rgba(0,180,216,0.25)", background: "#f0f9ff", color: "#023e8a", fontSize: ".95rem", outline: "none", transition: "border-color .2s, box-shadow .2s" }}
                  onFocus={e => { e.target.style.borderColor = "#00b4d8"; e.target.style.boxShadow = "0 0 0 3px rgba(0,180,216,0.12)"; }}
                  onBlur={e => { e.target.style.borderColor = "rgba(0,180,216,0.25)"; e.target.style.boxShadow = "none"; }} />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#4a7fa5", cursor: "pointer", padding: 4 }}>
                  {showPwd ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} disabled={loading}
              style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "12px", borderRadius: 12, background: loading ? "#93b4c8" : "linear-gradient(135deg,#00b4d8,#0077b6)", color: "#fff", fontWeight: 700, fontSize: "1rem", border: "none", boxShadow: "0 4px 18px rgba(0,180,216,0.35)", marginTop: 6, cursor: loading ? "wait" : "pointer" }}>
              {loading ? "Signing in..." : <><LogIn size={17} /> Sign In to Admin</>}
            </motion.button>
          </form>

          <p style={{ marginTop: 16, textAlign: "center", fontSize: ".75rem", color: "#93b4c8" }}>
            Default: <strong style={{ color: "#4a7fa5" }}>admin</strong> / <strong style={{ color: "#4a7fa5" }}>admin123</strong>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
