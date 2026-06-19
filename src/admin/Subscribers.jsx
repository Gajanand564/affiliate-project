import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getSubscribers, deleteSubscriber } from "../services/api";
import { Trash2, Mail, Download } from "lucide-react";

export default function Subscribers() {
  const [subs, setSubs]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState("");

  const load = () => { setLoading(true); getSubscribers().then(setSubs).catch(() => {}).finally(() => setLoading(false)); };
  useEffect(load, []);

  const handleDelete = async (id) => {
    if (!confirm("Remove subscriber?")) return;
    await deleteSubscriber(id); load();
  };

  const exportCSV = () => {
    const csv = ["Email,Subscribed At", ...subs.map((s) => `${s.email},${s.subscribedAt}`)].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "subscribers.csv"; a.click();
  };

  const filtered = subs.filter((s) => s.email.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 14 }}>
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 900, color: "#023e8a" }}>Subscribers</h1>
          <p style={{ color: "#4a7fa5", fontSize: ".88rem" }}>{subs.length} email subscribers</p>
        </div>
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={exportCSV}
          style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", borderRadius: 10, background: "rgba(0,180,216,0.1)", border: "1.5px solid rgba(0,180,216,0.3)", color: "#0077b6", fontWeight: 700, cursor: "pointer", fontSize: ".88rem" }}>
          <Download size={16} /> Export CSV
        </motion.button>
      </div>

      <div style={{ position: "relative", maxWidth: 380, marginBottom: 18 }}>
        <Mail size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#93b4c8" }} />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search emails..."
          style={{ width: "100%", padding: "10px 14px 10px 42px", borderRadius: 50, border: "1.5px solid rgba(0,180,216,0.25)", background: "#fff", color: "#023e8a", fontSize: ".9rem", outline: "none" }}
          onFocus={e => { e.target.style.borderColor = "#00b4d8"; e.target.style.boxShadow = "0 0 0 3px rgba(0,180,216,0.1)"; }}
          onBlur={e => { e.target.style.borderColor = "rgba(0,180,216,0.25)"; e.target.style.boxShadow = "none"; }} />
      </div>

      <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 4px 20px rgba(0,100,160,0.09)", border: "1px solid rgba(0,180,216,0.12)", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#e8f4fd", borderBottom: "1px solid rgba(0,180,216,0.18)" }}>
              {["#", "Email", "Subscribed At", "Status", "Action"].map((h) => (
                <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: ".73rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".08em", color: "#4a7fa5" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} style={{ padding: 40, textAlign: "center", color: "#4a7fa5" }}>Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={5} style={{ padding: 40, textAlign: "center", color: "#93b4c8" }}>
                {subs.length === 0 ? "No subscribers yet. Share the newsletter form!" : "No results found."}
              </td></tr>
            ) : filtered.map((s, i) => (
              <motion.tr key={s.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                style={{ borderBottom: "1px solid rgba(0,180,216,0.08)", transition: "background .15s" }}
                onMouseEnter={e => e.currentTarget.style.background = "#f8fcff"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <td style={{ padding: "12px 16px", color: "#93b4c8", fontSize: ".82rem" }}>{i + 1}</td>
                <td style={{ padding: "12px 16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#00b4d8,#0077b6)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: ".75rem", fontWeight: 700, flexShrink: 0 }}>
                      {s.email[0].toUpperCase()}
                    </div>
                    <span style={{ fontWeight: 600, color: "#023e8a", fontSize: ".9rem" }}>{s.email}</span>
                  </div>
                </td>
                <td style={{ padding: "12px 16px", color: "#4a7fa5", fontSize: ".82rem" }}>
                  {new Date(s.subscribedAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                </td>
                <td style={{ padding: "12px 16px" }}>
                  <span style={{ padding: "3px 10px", borderRadius: 50, background: s.active ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)", color: s.active ? "#10b981" : "#ef4444", fontSize: ".73rem", fontWeight: 700 }}>
                    {s.active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td style={{ padding: "12px 16px" }}>
                  <button onClick={() => handleDelete(s.id)}
                    style={{ padding: "5px 8px", borderRadius: 7, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#ef4444", cursor: "pointer" }}>
                    <Trash2 size={14} />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
