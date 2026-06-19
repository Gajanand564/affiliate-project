import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, X, Zap } from "lucide-react";
import DealCard from "./DealCard";
import { getDeals } from "../services/api";
import { useIsMobile } from "../hooks/useIsMobile";

/* ──────────────────────────────────────────────────────────
   REFERRAL TRACKING

   How to use:
   Share links like: https://yoursite.com/?deal=DEAL_ID
   or:               https://yoursite.com/?category=tech

   When user lands with ?deal=ID  → shows that deal + related
   When user lands with ?category=X → auto-filters to category
────────────────────────────────────────────────────────── */

export default function ReferralSection({ onCategoryRef }) {
  const [refDeal, setRefDeal]       = useState(null);
  const [related, setRelated]       = useState([]);
  const [loading, setLoading]       = useState(false);
  const [dismissed, setDismissed]   = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const dealId    = params.get("deal") || params.get("ref") || params.get("product");
    const catFilter = params.get("category") || params.get("cat");

    // Auto-apply category filter if ?category= present
    if (catFilter && onCategoryRef) {
      onCategoryRef(catFilter);
      setTimeout(() => document.getElementById("deals")?.scrollIntoView({ behavior: "smooth" }), 600);
    }

    // Load specific deal if ?deal= present
    if (dealId) {
      setLoading(true);
      getDeals()
        .then((all) => {
          const found = all.find((d) => d.id === dealId || d.title?.toLowerCase().replace(/\s+/g, "-") === dealId);
          if (found) {
            setRefDeal(found);
            // Related = same category, newest first, exclude itself
            const rel = all
              .filter((d) => d.category === found.category && d.id !== found.id && d.active !== false)
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .slice(0, 4);
            setRelated(rel);
          }
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, []);

  if (dismissed || (!refDeal && !loading)) return null;

  return (
    <AnimatePresence>
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.45 }}
        style={{ padding: "20px 0 0", background: "linear-gradient(135deg, rgba(0,180,216,0.08), rgba(0,119,182,0.06))", borderBottom: "1px solid rgba(0,180,216,0.15)" }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 16px 28px" }}>
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: "linear-gradient(135deg,#00b4d8,#0077b6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Zap size={17} color="#fff" fill="#fff" />
              </div>
              <div>
                <div style={{ fontWeight: 800, color: "#023e8a", fontSize: "1rem" }}>Recommended For You</div>
                <div style={{ fontSize: ".72rem", color: "#4a7fa5" }}>Based on your affiliate link</div>
              </div>
            </div>
            <button onClick={() => setDismissed(true)}
              style={{ background: "rgba(0,180,216,0.1)", border: "1px solid rgba(0,180,216,0.2)", borderRadius: 8, padding: "5px 8px", color: "#4a7fa5", cursor: "pointer", display: "flex", alignItems: "center", gap: 5, fontSize: ".75rem" }}>
              <X size={13} /> Hide
            </button>
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: "20px 0", color: "#4a7fa5" }}>Loading your deal...</div>
          ) : refDeal && (
            <>
              {/* Main referred deal — full width highlight */}
              <div style={{ background: "#fff", borderRadius: 16, padding: "16px", marginBottom: 20, boxShadow: "0 4px 20px rgba(0,180,216,0.15)", border: "2px solid #00b4d8", display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center" }}>
                <div style={{ width: 80, height: 80, borderRadius: 14, background: "linear-gradient(135deg,#00b4d8,#0077b6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2.5rem", flexShrink: 0 }}>
                  {refDeal.emoji}
                </div>
                <div style={{ flex: 1, minWidth: 180 }}>
                  <span style={{ fontSize: ".7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".08em", color: "#00b4d8" }}>🎯 Your Searched Deal</span>
                  <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#023e8a", margin: "4px 0", lineHeight: 1.3 }}>{refDeal.title}</h3>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                    <span style={{ fontSize: "1.1rem", fontWeight: 900, color: "#0077b6" }}>{refDeal.price}</span>
                    {refDeal.original && <span style={{ fontSize: ".8rem", color: "#93b4c8", textDecoration: "line-through" }}>{refDeal.original}</span>}
                    {refDeal.discount && <span style={{ background: "rgba(0,200,81,0.1)", color: "#00a040", fontSize: ".72rem", fontWeight: 700, padding: "2px 8px", borderRadius: 50 }}>{refDeal.discount}</span>}
                  </div>
                </div>
                <motion.a href={refDeal.affiliateUrl} target="_blank" rel="noopener noreferrer nofollow"
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  style={{ display: "flex", alignItems: "center", gap: 7, padding: "11px 22px", borderRadius: 12, background: "linear-gradient(135deg,#00b4d8,#0077b6)", color: "#fff", fontWeight: 700, fontSize: ".9rem", boxShadow: "0 4px 16px rgba(0,180,216,0.35)", whiteSpace: "nowrap" }}>
                  Get This Deal <ExternalLink size={14} />
                </motion.a>
              </div>

              {/* Related deals */}
              {related.length > 0 && (
                <>
                  <div style={{ fontSize: ".82rem", fontWeight: 700, color: "#4a7fa5", marginBottom: 12 }}>
                    Related {refDeal.category} deals:
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(auto-fill, minmax(220px, 1fr))", gap: isMobile ? 10 : 12 }}>
                    {related.map((d, i) => <DealCard key={d.id} deal={d} index={i} compact={true} />)}
                  </div>
                </>
              )}
            </>
          )}
        </div>

        <style>{`
          @media (max-width: 640px) {
            .ref-related-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 10px !important; }
          }
        `}</style>
      </motion.section>
    </AnimatePresence>
  );
}
