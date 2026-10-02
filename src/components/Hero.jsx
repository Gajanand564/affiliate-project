import { motion } from "framer-motion";
import { ArrowDown, Shield, Star, TrendingUp, Zap } from "lucide-react";
import { useIsMobile } from "../hooks/useIsMobile";

const stats = [
  { icon: <Star size={20} />, num: "500+", label: "Deals" },
  { icon: <TrendingUp size={20} />, num: "50K+", label: "Readers" },
  { icon: <Shield size={20} />, num: "100%", label: "Trusted" },
];

export default function Hero() {
  const isMobile = useIsMobile();

  return (
    <section style={{
      minHeight: isMobile ? "auto" : "620px",
      padding: isMobile ? "96px 18px 34px" : "118px 24px 48px",
      background: "linear-gradient(180deg,#d9f1fc 0%,#c9ebfa 100%)",
      borderBottom: "1px solid rgba(0,119,182,.08)",
      position: "relative",
      overflow: "hidden",
      textAlign: "center",
    }}>
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(0,119,182,.12) 1px, transparent 1px)", backgroundSize: "40px 40px", opacity: .36 }} />
        <motion.div animate={{ scale: [1, 1.12, 1] }} transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          style={{ position: "absolute", top: 60, right: "8%", width: 360, height: 360, borderRadius: "50%", background: "rgba(0,180,216,.18)", filter: "blur(60px)" }} />
        <motion.div animate={{ scale: [1.08, 1, 1.08] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          style={{ position: "absolute", bottom: 40, left: "4%", width: 280, height: 280, borderRadius: "50%", background: "rgba(0,119,182,.12)", filter: "blur(60px)" }} />
      </div>

      <div style={{ position: "relative", zIndex: 1, maxWidth: 1180, margin: "0 auto" }}>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .4 }}
          style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "7px 16px", borderRadius: 999, background: "rgba(0,180,216,.12)", border: "1px solid rgba(0,180,216,.3)", color: "#0077b6", fontWeight: 800, fontSize: isMobile ? ".76rem" : ".86rem", marginBottom: isMobile ? 18 : 26 }}>
          <Zap size={15} fill="currentColor" /> Top Affiliate Deals - Updated Daily
        </motion.div>

        <motion.h1 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .48, delay: .05 }}
          style={{ margin: "0 auto", maxWidth: 860, color: "#023e8a", fontSize: isMobile ? "2rem" : "clamp(2.8rem,5vw,4.6rem)", lineHeight: 1.1, letterSpacing: 0, fontWeight: 900 }}>
          Discover the <span style={{ color: "#00a6d6" }}>Best Deals</span>
          <br />
          &amp; Save More Today
        </motion.h1>

        <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .48, delay: .12 }}
          style={{ color: "#467ba4", fontSize: isMobile ? ".95rem" : "1.08rem", lineHeight: 1.55, maxWidth: 560, margin: isMobile ? "16px auto 24px" : "22px auto 30px" }}>
          Handpicked affiliate offers, honest reviews, and exclusive discounts.
        </motion.p>

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
