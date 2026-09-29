import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowDown, Star, TrendingUp, Shield, Zap, Search } from "lucide-react";
import { useIsMobile } from "../hooks/useIsMobile";

const stats = [
  { icon: <Star size={14} />, num: "500+", label: "Deals" },
  { icon: <TrendingUp size={14} />, num: "50K+", label: "Readers" },
  { icon: <Shield size={14} />, num: "100%", label: "Trusted" },
];

export default function Hero({ onSearch }) {
  const isMobile = useIsMobile();
  const [q, setQ] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(q);
    setTimeout(() => document.getElementById("deals")?.scrollIntoView({ behavior: "smooth" }), 80);
  };

  /* ── MOBILE: compact strip ── */
  if (isMobile) {
    return (
      <section style={{
        background: "linear-gradient(135deg, #e0f4fd 0%, #cceeff 100%)",
        padding: "68px 16px 20px",
        textAlign: "center",
        borderBottom: "1px solid rgba(0,180,216,0.2)",
      }}>
        {/* Brand badge */}
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}
          style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "rgba(0,180,216,0.15)", border: "1px solid rgba(0,180,216,0.35)", borderRadius: 50, padding: "3px 12px", fontSize: ".7rem", fontWeight: 700, color: "#0077b6", marginBottom: 8 }}>
          <Zap size={11} fill="#00b4d8" color="#00b4d8" /> 🔥 Top Affiliate Deals
        </motion.div>

        {/* Title */}
        <motion.h1 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.05 }}
          style={{ fontSize: "1.5rem", fontWeight: 900, color: "#023e8a", lineHeight: 1.2, marginBottom: 10 }}>
          Best Deals &amp; Discounts
        </motion.h1>

        {/* Search bar */}
        <motion.form initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.1 }}
          onSubmit={handleSearch}
          style={{ display: "flex", gap: 8, maxWidth: 400, margin: "0 auto" }}>
          <div style={{ position: "relative", flex: 1 }}>
            <Search size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#93b4c8", pointerEvents: "none" }} />
            <input
              type="text" value={q} onChange={e => setQ(e.target.value)}
              placeholder="Search deals..."
              style={{ width: "100%", padding: "10px 12px 10px 36px", borderRadius: 50, border: "1.5px solid rgba(0,180,216,0.3)", background: "#fff", color: "#023e8a", fontSize: "16px", outline: "none" }}
            />
          </div>
          <button type="submit"
            style={{ padding: "10px 16px", borderRadius: 50, background: "linear-gradient(135deg,#00b4d8,#0077b6)", color: "#fff", fontWeight: 700, fontSize: ".82rem", border: "none", whiteSpace: "nowrap", boxShadow: "0 3px 12px rgba(0,180,216,0.35)" }}>
            Search
          </button>
        </motion.form>
      </section>
    );
  }

  /* ── DESKTOP: full hero ── */
  return (
    <section style={{
      minHeight: "100svh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "100px 20px 60px",
      position: "relative",
      overflow: "hidden",
      textAlign: "center",
    }}>
      {/* Background blobs */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <motion.div animate={{ scale: [1,1.15,1], x:[0,20,0] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          style={{ position: "absolute", top: "-5%", right: "-5%", width: "clamp(200px,50vw,480px)", height: "clamp(200px,50vw,480px)", borderRadius: "50%", background: "radial-gradient(circle, rgba(0,180,216,0.2) 0%, transparent 70%)", filter: "blur(40px)" }} />
        <motion.div animate={{ scale: [1.1,1,1.1], y:[0,20,0] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          style={{ position: "absolute", bottom: "5%", left: "-5%", width: "clamp(160px,40vw,400px)", height: "clamp(160px,40vw,400px)", borderRadius: "50%", background: "radial-gradient(circle, rgba(0,119,182,0.18) 0%, transparent 70%)", filter: "blur(40px)" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(0,180,216,0.07) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
      </div>

      <div style={{ position: "relative", zIndex: 2, maxWidth: 720, width: "100%" }}>
        <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
          style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(0,180,216,0.12)", border: "1px solid rgba(0,180,216,0.35)", borderRadius: 50, padding: "5px 14px", fontSize: ".78rem", fontWeight: 600, color: "#0077b6", marginBottom: 20 }}>
          <Zap size={13} fill="#00b4d8" color="#00b4d8" /> 🔥 Top Affiliate Deals — Updated Daily
        </motion.div>

        <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
          style={{ fontSize: "clamp(2rem, 5.5vw, 4rem)", fontWeight: 900, lineHeight: 1.15, letterSpacing: "-0.025em", marginBottom: 16 }}>
          <span style={{ color: "#023e8a" }}>Discover the </span>
          <span style={{ background: "linear-gradient(135deg, #00b4d8, #0077b6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Best Deals</span>
          <br />
          <span style={{ color: "#023e8a" }}>& Save More Today</span>
        </motion.h1>

        <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
          style={{ fontSize: "clamp(.9rem, 2.5vw, 1.05rem)", color: "#4a7fa5", maxWidth: 480, margin: "0 auto 28px", lineHeight: 1.65 }}>
          Handpicked affiliate offers, honest reviews, and exclusive discounts.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
          style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", marginBottom: 36 }}>
          <a href="#deals" style={{ padding: "12px 24px", borderRadius: 50, background: "linear-gradient(135deg,#00b4d8,#0077b6)", color: "#fff", fontWeight: 700, fontSize: ".95rem", boxShadow: "0 6px 20px rgba(0,180,216,0.4)", display: "flex", alignItems: "center", gap: 7, textDecoration: "none" }}>
            Browse Deals <ArrowDown size={15} />
          </a>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }}
          style={{ display: "flex", gap: 8, justifyContent: "center" }}>
          {stats.map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, background: "#fff", border: "1px solid rgba(0,180,216,0.2)", borderRadius: 12, padding: "10px 14px", boxShadow: "0 2px 12px rgba(0,100,160,0.07)", flex: "1 1 0", maxWidth: 130 }}>
              <span style={{ color: "#00b4d8" }}>{s.icon}</span>
              <div style={{ textAlign: "left" }}>
                <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#023e8a", lineHeight: 1 }}>{s.num}</div>
                <div style={{ fontSize: ".7rem", color: "#4a7fa5", marginTop: 2 }}>{s.label}</div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      <motion.div animate={{ y: [0,-7,0] }} transition={{ duration: 2.5, repeat: Infinity }}
        style={{ position: "absolute", bottom: 20, left: "50%", transform: "translateX(-50%)", color: "#4a7fa5", fontSize: ".7rem", display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
        <span>Scroll</span><ArrowDown size={14} />
      </motion.div>
    </section>
  );
}
