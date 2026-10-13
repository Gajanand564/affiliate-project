import { motion } from "framer-motion";
import { ArrowDown, Search, Shield, Tag, TrendingUp, Zap } from "lucide-react";
import { useIsMobile } from "../hooks/useIsMobile";
import { useState } from "react";

const stats = [
  { icon: <TrendingUp size={20} />, num: "Trend", label: "Matched picks" },
  { icon: <Tag size={20} />, num: "Budget", label: "Decor finds" },
  { icon: <Shield size={20} />, num: "Clear", label: "Affiliate disclosure" },
];

export default function Hero({ onSearch }) {
  const isMobile = useIsMobile();
  const [query, setQuery] = useState("");

  const submitSearch = (e) => {
    e.preventDefault();
    onSearch?.(query.trim());
    document.getElementById("deals")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section style={{
      minHeight: isMobile ? "auto" : "620px",
      padding: isMobile ? "96px 18px 34px" : "118px 24px 48px",
      background: "#d9f1fc",
      borderBottom: "1px solid rgba(0,119,182,.08)",
      position: "relative",
      overflow: "hidden",
      textAlign: "center",
    }}>
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(0,119,182,.12) 1px, transparent 1px)", backgroundSize: "40px 40px", opacity: .36 }} />
      </div>

      <div style={{ position: "relative", zIndex: 1, maxWidth: 1180, margin: "0 auto" }}>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .4 }}
          style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "7px 16px", borderRadius: 999, background: "rgba(0,180,216,.12)", border: "1px solid rgba(0,180,216,.3)", color: "#0077b6", fontWeight: 800, fontSize: isMobile ? ".76rem" : ".86rem", marginBottom: isMobile ? 18 : 26 }}>
          <Zap size={15} fill="currentColor" /> Budget home decor and kitchen finds
        </motion.div>

        <motion.h1 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .48, delay: .05 }}
          style={{ margin: "0 auto", maxWidth: 860, color: "#023e8a", fontSize: isMobile ? "2rem" : "clamp(2.8rem,5vw,4.6rem)", lineHeight: 1.1, letterSpacing: 0, fontWeight: 900 }}>
          Affordable <span style={{ color: "#00a6d6" }}>Home Decor Finds</span>
          <br />
          for real rooms
        </motion.h1>

        <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .48, delay: .12 }}
          style={{ color: "#467ba4", fontSize: isMobile ? ".95rem" : "1.08rem", lineHeight: 1.55, maxWidth: 560, margin: isMobile ? "16px auto 24px" : "22px auto 30px" }}>
          Trend-led Amazon picks for mirrors, wall decor, lighting, storage, and small-space upgrades.
        </motion.p>

        <motion.form onSubmit={submitSearch} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .48, delay: .16 }}
          style={{ maxWidth: 560, margin: "0 auto 18px", display: "flex", gap: 8, background: "#fff", border: "1px solid rgba(0,180,216,.22)", borderRadius: 999, padding: 6, boxShadow: "0 10px 24px rgba(0,100,160,.08)" }}>
          <Search size={18} style={{ alignSelf: "center", marginLeft: 12, color: "#93b4c8", flexShrink: 0 }} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search mirrors, shelves, lamps..."
            style={{ flex: 1, border: 0, outline: 0, color: "#023e8a", fontSize: isMobile ? ".88rem" : ".96rem", minWidth: 0 }}
          />
          <button type="submit" style={{ border: 0, borderRadius: 999, background: "#023e8a", color: "#fff", fontWeight: 900, padding: isMobile ? "10px 14px" : "11px 18px" }}>
            Search
          </button>
        </motion.form>

        <motion.a initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .48, delay: .18 }}
          href="#deals"
          style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: isMobile ? "12px 22px" : "13px 26px", borderRadius: 999, background: "linear-gradient(135deg,#00b4d8,#0077b6)", color: "#fff", fontWeight: 850, fontSize: isMobile ? ".92rem" : ".98rem", boxShadow: "0 10px 24px rgba(0,180,216,.3)" }}>
          Browse Deals <ArrowDown size={16} />
        </motion.a>

        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .48, delay: .25 }}
          style={{ display: "flex", justifyContent: "center", gap: isMobile ? 10 : 12, flexWrap: "wrap", marginTop: isMobile ? 28 : 38 }}>
          {stats.map((item) => (
            <div key={item.label} style={{ minWidth: isMobile ? 118 : 150, background: "#fff", border: "1px solid rgba(255,255,255,.9)", borderRadius: 12, padding: isMobile ? "10px 12px" : "12px 16px", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, boxShadow: "0 8px 22px rgba(0,77,128,.08)" }}>
              <span style={{ color: "#00a6d6", display: "flex" }}>{item.icon}</span>
              <span style={{ textAlign: "left" }}>
                <strong style={{ display: "block", color: "#023e8a", fontSize: isMobile ? "1.05rem" : "1.22rem", lineHeight: 1, fontWeight: 900 }}>{item.num}</strong>
                <span style={{ display: "block", color: "#467ba4", fontSize: isMobile ? ".74rem" : ".78rem", marginTop: 3 }}>{item.label}</span>
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
