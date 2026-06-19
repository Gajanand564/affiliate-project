import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getDeals, updateDeal } from "../services/api";
import { Star } from "lucide-react";

export default function FeaturedManager() {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => { setLoading(true); getDeals().then(setDeals).catch(() => {}).finally(() => setLoading(false)); };
  useEffect(load, []);

  const toggle = async (deal) => {
    await updateDeal(deal.id, { ...deal, featured: !deal.featured });
    load();
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 900, color: "#023e8a" }}>Featured Deals</h1>
        <p style={{ color: "#4a7fa5", fontSize: ".88rem" }}>Toggle which deals appear in the Featured section on homepage</p>
      </div>
      {loading ? <p style={{ color: "#4a7fa5" }}>Loading...</p> : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 14 }}>
          {deals.map((deal, i) => (
            <motion.div key={deal.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
              style={{ background: "#fff", borderRadius: 14, padding: "16px 18px", boxShadow: "0 4px 16px rgba(0,100,160,0.09)", border: deal.featured ? "2px solid #f59e0b" : "1px solid rgba(0,180,216,0.12)", display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ fontSize: "2rem", flexShrink: 0 }}>{deal.emoji}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, color: "#023e8a", fontSize: ".9rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{deal.title}</div>
                <div style={{ fontSize: ".72rem", color: "#4a7fa5" }}>{deal.price}</div>
              </div>
              <button onClick={() => toggle(deal)} title={deal.featured ? "Remove from featured" : "Add to featured"}
                style={{ background: deal.featured ? "rgba(245,158,11,0.1)" : "rgba(0,180,216,0.08)", border: deal.featured ? "1.5px solid rgba(245,158,11,0.3)" : "1.5px solid rgba(0,180,216,0.2)", borderRadius: 10, padding: "8px", cursor: "pointer", color: deal.featured ? "#f59e0b" : "#93b4c8", flexShrink: 0 }}>
                <Star size={20} fill={deal.featured ? "#f59e0b" : "none"} />
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
