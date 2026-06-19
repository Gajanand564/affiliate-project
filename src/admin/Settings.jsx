import { motion } from "framer-motion";
import { Settings as SettingsIcon, ExternalLink } from "lucide-react";

export default function Settings() {
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
            <button style={{ padding: "7px 18px", borderRadius: 8, background: "rgba(0,180,216,0.1)", border: "1.5px solid rgba(0,180,216,0.25)", color: "#0077b6", fontWeight: 600, fontSize: ".82rem", cursor: "pointer" }}>
              {item.action}
            </button>
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
