import { useState } from "react";
import { motion } from "framer-motion";
import { changePassword } from "../services/api";
import { Settings as SettingsIcon } from "lucide-react";

function PasswordForm({ onClose }) {
  const [form, setForm] = useState({ current: "", next: "", confirm: "" });
  const [status, setStatus] = useState({ type: "", text: "" });
  const [saving, setSaving] = useState(false);
  const field = (key, label) => (
    <label style={{ display: "block", fontSize: ".78rem", fontWeight: 700, color: "#4a7fa5", marginBottom: 10 }}>{label}
      <input type="password" autoComplete={key === "current" ? "current-password" : "new-password"} value={form[key]}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        style={{ display: "block", width: "100%", marginTop: 4, padding: "9px 12px", borderRadius: 8, border: "1.5px solid rgba(0,180,216,0.25)", fontSize: ".9rem" }} />
    </label>
  );
  const submit = async (e) => {
    e.preventDefault();
    if (form.next.length < 12) return setStatus({ type: "error", text: "New password must be at least 12 characters." });
    if (form.next !== form.confirm) return setStatus({ type: "error", text: "New passwords do not match." });
    setSaving(true);
    try {
      await changePassword(form.current, form.next);
      setStatus({ type: "ok", text: "Password changed. Use the new password next time you sign in." });
      setForm({ current: "", next: "", confirm: "" });
    } catch (err) {
      setStatus({ type: "error", text: err?.response?.data?.error || "Could not change the password." });
    } finally { setSaving(false); }
  };
  return (
    <form onSubmit={submit} style={{ marginTop: 6 }}>
      {field("current", "Current password")}
      {field("next", "New password (12+ characters)")}
      {field("confirm", "Confirm new password")}
      {status.text && <p style={{ fontSize: ".8rem", color: status.type === "ok" ? "#10b981" : "#ef4444", marginBottom: 10 }}>{status.text}</p>}
      <div style={{ display: "flex", gap: 8 }}>
        <button type="submit" disabled={saving} style={{ padding: "7px 18px", borderRadius: 8, background: "#0077b6", border: 0, color: "#fff", fontWeight: 700, cursor: "pointer" }}>{saving ? "Saving…" : "Save password"}</button>
        <button type="button" onClick={onClose} style={{ padding: "7px 14px", borderRadius: 8, background: "none", border: "1.5px solid rgba(0,180,216,0.25)", color: "#0077b6", cursor: "pointer" }}>Cancel</button>
      </div>
    </form>
  );
}

export default function Settings() {
  const [changing, setChanging] = useState(false);
  return (
    <div>
      <h1 style={{ fontSize: "1.5rem", fontWeight: 900, color: "#023e8a", marginBottom: 6 }}>Settings</h1>
      <p style={{ color: "#4a7fa5", fontSize: ".88rem", marginBottom: 28 }}>Site configuration and preferences</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 16 }}>
        {[
          { title: "Site Name", desc: "DealZone", icon: "⚡", action: "Edit" },
          { title: "Backend API", desc: "http://localhost:3001", icon: "🔌", action: "Test" },
          { title: "Admin Password", desc: "Change your login password", icon: "🔒", action: "Change" },
          { title: "Affiliate Disclosure", desc: "Update legal disclosure text", icon: "📋", action: "Edit" },
        ].map((item, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            whileHover={{ y: -3 }}
            style={{ background: "#fff", borderRadius: 16, padding: "20px 22px", boxShadow: "0 4px 18px rgba(0,100,160,0.09)", border: "1px solid rgba(0,180,216,0.12)" }}>
            <div style={{ fontSize: "1.8rem", marginBottom: 12 }}>{item.icon}</div>
            <h3 style={{ fontWeight: 800, color: "#023e8a", marginBottom: 4, fontSize: ".95rem" }}>{item.title}</h3>
            <p style={{ fontSize: ".82rem", color: "#4a7fa5", marginBottom: 14 }}>{item.desc}</p>
            {item.title === "Admin Password" && changing ? <PasswordForm onClose={() => setChanging(false)} /> :
            <button onClick={item.title === "Admin Password" ? () => setChanging(true) : undefined} style={{ padding: "7px 18px", borderRadius: 8, background: "rgba(0,180,216,0.1)", border: "1.5px solid rgba(0,180,216,0.25)", color: "#0077b6", fontWeight: 600, fontSize: ".82rem", cursor: "pointer" }}>
              {item.action}
            </button>}
          </motion.div>
        ))}
      </div>
      <div style={{ marginTop: 24, padding: "16px 20px", background: "rgba(0,180,216,0.06)", borderRadius: 12, border: "1px solid rgba(0,180,216,0.15)", display: "flex", alignItems: "center", gap: 12 }}>
        <SettingsIcon size={18} color="#00b4d8" />
        <p style={{ fontSize: ".85rem", color: "#4a7fa5" }}>More settings options can be added here. Edit <strong style={{ color: "#023e8a" }}>backend/data/</strong> files directly for raw data access.</p>
      </div>
    </div>
  );
}
