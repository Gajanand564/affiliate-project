import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { SectionHeader } from "./FeaturedDeals";
import { getCategories, getDeals, IMG_BASE } from "../services/api";
import { useIsMobile } from "../hooks/useIsMobile";

export default function Categories({ activeFilter, setFilter }) {
  const [cats, setCats] = useState([]);
  const [counts, setCounts] = useState({});
  const isMobile = useIsMobile();
  if (isMobile) return null; // Mobile pe AllDeals ki filter chips use hoti hain

  useEffect(() => {
    Promise.all([getCategories(), getDeals({ active: true })])
      .then(([c, d]) => {
        setCats(c);
        const m = {};
        d.forEach((deal) => { m[deal.category] = (m[deal.category] || 0) + 1; });
        setCounts(m);
      }).catch(() => {});
  }, []);

  const allCats = [{ id: "all", name: "All Deals", icon: "🌐" }, ...cats];
  const total = Object.values(counts).reduce((a, b) => a + b, 0);

  return (
    <section id="categories" style={{ padding: "60px 0", background: "#fff" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 16px" }}>
        <SectionHeader tag="📂 Browse By" title="Shop By Category" />

        {/* Horizontal scroll on mobile, wrap on desktop */}
        <div className="cat-scroll-wrap" style={{ overflowX: "auto", WebkitOverflowScrolling: "touch", paddingBottom: 6 }}>
          <div className="cat-grid" style={{ display: "flex", gap: 10, flexWrap: "wrap", minWidth: "max-content" }}>
            {allCats.map((cat, i) => {
              const count = cat.id === "all" ? total : (counts[cat.id] || 0);
              const isActive = activeFilter === cat.id;
              return (
                <motion.button key={cat.id}
                  initial={{ opacity: 0, scale: 0.88 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.28, delay: i * 0.03 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => { setFilter(cat.id); setTimeout(() => document.getElementById("deals")?.scrollIntoView({ behavior: "smooth" }), 80); }}
                  style={{
                    display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
                    padding: "16px 14px", borderRadius: 14,
                    border: isActive ? "2px solid #00b4d8" : "2px solid rgba(0,180,216,0.18)",
                    background: isActive ? "rgba(0,180,216,0.1)" : "#f8fcff",
                    cursor: "pointer", minWidth: 90, maxWidth: 120, flex: "0 0 auto",
                    boxShadow: isActive ? "0 3px 16px rgba(0,180,216,0.2)" : "0 1px 6px rgba(0,100,160,0.05)",
                    transition: "all .2s",
                  }}
                >
                  {cat.image ? (
                    <div style={{ width: 48, height: 48, borderRadius: 10, overflow: "hidden", flexShrink: 0 }}>
                      <img src={IMG_BASE + cat.image} alt={cat.name}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        onError={e => { e.target.parentElement.innerHTML = `<span style="font-size:1.7rem">${cat.icon}</span>`; }} />
                    </div>
                  ) : (
                    <span style={{ fontSize: "1.7rem" }}>{cat.icon}</span>
                  )}
                  <span style={{ fontSize: ".75rem", fontWeight: 700, color: isActive ? "#0077b6" : "#4a7fa5", textAlign: "center", lineHeight: 1.2 }}>{cat.name}</span>
                  <span style={{ fontSize: ".62rem", color: "#93b4c8", background: "rgba(0,180,216,0.08)", padding: "1px 7px", borderRadius: 50 }}>{count}</span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
      <style>{`
        .cat-scroll-wrap::-webkit-scrollbar { display: none; }
        .cat-scroll-wrap { -ms-overflow-style: none; scrollbar-width: none; }
        @media (min-width: 768px) {
          .cat-scroll-wrap { overflow-x: visible !important; }
          .cat-grid { flex-wrap: wrap !important; min-width: unset !important; justify-content: center; }
        }
      `}</style>
    </section>
  );
}
