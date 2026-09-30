import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronDown } from "lucide-react";
import DealCard from "./DealCard";
import { SectionHeader } from "./FeaturedDeals";
import { getDeals, getCategories } from "../services/api";
import { useIsMobile } from "../hooks/useIsMobile";

const PAGE_SIZE = 12;

const parsePrice = (p) => {
  const n = parseFloat(String(p || "").replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : null;
};

const SORT_OPTIONS = [
  { id: "newest",     label: "Newest First" },
  { id: "price_low",  label: "Price: Low to High" },
  { id: "price_high", label: "Price: High to Low" },
];

export default function AllDeals({ activeFilter, setFilter, externalSearch = "", lockCategory }) {
  const [deals, setDeals] = useState([]);
  const [cats, setCats]   = useState([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [loading, setLoading] = useState(true);
  const isMobile = useIsMobile();

  // Sync external search (from hero search bar on mobile)
  useEffect(() => { setSearch(externalSearch); }, [externalSearch]);

  // Reset pagination whenever the visible set would change
  useEffect(() => { setVisibleCount(PAGE_SIZE); }, [activeFilter, search, sortBy]);

  useEffect(() => {
    Promise.all([getDeals({ active: true }), getCategories()])
      .then(([d, c]) => {
        setDeals([...d].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        setCats(c);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let r = deals;
    if (activeFilter !== "all") r = r.filter((d) => d.category === activeFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      r = r.filter((d) => d.title?.toLowerCase().includes(q) || d.desc?.toLowerCase().includes(q) || d.category?.toLowerCase().includes(q));
    }
    if (sortBy === "price_low" || sortBy === "price_high") {
      r = [...r].sort((a, b) => {
        const pa = parsePrice(a.price), pb = parsePrice(b.price);
        if (pa === null) return 1;
        if (pb === null) return -1;
        return sortBy === "price_low" ? pa - pb : pb - pa;
      });
    }
    return r;
  }, [deals, activeFilter, search, sortBy]);

  const visible = filtered.slice(0, visibleCount);
  const allCats = [{ id: "all", name: "All", icon: "🌐" }, ...cats];

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(auto-fill, minmax(260px, 1fr))",
    gap: isMobile ? 10 : 16,
  };

  return (
    <section id="deals" style={{
      padding: isMobile ? "28px 0 60px" : "72px 0 90px",
      background: "#fff",
      borderTop: "1px solid rgba(0,180,216,0.15)",
      boxShadow: "0 -8px 30px rgba(0,60,120,0.06)",
      position: "relative",
      zIndex: 1,
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: isMobile ? "0 12px" : "0 16px" }}>

        {/* Section header — desktop only */}
        {!isMobile && (
          <SectionHeader tag="🛍️ All Offers" title="Latest Deals" sub={`Showing ${visible.length} of ${filtered.length} deals`} />
        )}

        {/* Mobile: compact count + search row */}
        {isMobile && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <span style={{ fontSize: ".78rem", fontWeight: 700, color: "#4a7fa5" }}>
              {filtered.length} deals
            </span>
            {search && (
              <button onClick={() => setSearch("")}
                style={{ fontSize: ".72rem", color: "#0077b6", background: "rgba(0,180,216,0.1)", border: "1px solid rgba(0,180,216,0.25)", borderRadius: 50, padding: "3px 10px", cursor: "pointer" }}>
                ✕ Clear "{search}"
              </button>
            )}
          </div>
        )}

        {/* Search + Sort row */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 14 }}>
          {/* Search — desktop only (mobile has it in hero) */}
          {!isMobile && (
            <div style={{ position: "relative", flex: "1 1 260px", maxWidth: 420 }}>
              <Search size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#93b4c8", pointerEvents: "none" }} />
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search deals..."
                style={{ width: "100%", padding: "11px 14px 11px 40px", borderRadius: 50, border: "1.5px solid rgba(0,180,216,0.25)", background: "#fff", color: "#023e8a", fontSize: ".9rem", outline: "none" }}
                onFocus={e => { e.target.style.borderColor = "#00b4d8"; e.target.style.boxShadow = "0 0 0 3px rgba(0,180,216,0.1)"; }}
                onBlur={e => { e.target.style.borderColor = "rgba(0,180,216,0.25)"; e.target.style.boxShadow = "none"; }} />
            </div>
          )}

          {/* Sort dropdown — helps users find things as the catalog grows */}
          <div style={{ position: "relative", flexShrink: 0 }}>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
              style={{
                appearance: "none", WebkitAppearance: "none",
                padding: isMobile ? "8px 30px 8px 14px" : "11px 34px 11px 16px",
                borderRadius: 50, border: "1.5px solid rgba(0,180,216,0.25)", background: "#fff",
                color: "#0077b6", fontSize: isMobile ? ".78rem" : ".85rem", fontWeight: 600, outline: "none", cursor: "pointer",
              }}>
              {SORT_OPTIONS.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
            </select>
            <ChevronDown size={14} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: "#93b4c8", pointerEvents: "none" }} />
          </div>
        </div>

        {/* Filter chips — hidden when this page is locked to one category (e.g. /kitchen) */}
        {!lockCategory && (
          <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch", marginBottom: isMobile ? 12 : 24, paddingBottom: 4, msOverflowStyle: "none", scrollbarWidth: "none" }}>
            <div style={{ display: "flex", gap: 7, flexWrap: isMobile ? "nowrap" : "wrap", minWidth: isMobile ? "max-content" : "unset" }}>
              {allCats.map((cat) => (
                <motion.button key={cat.id} whileTap={{ scale: 0.95 }}
                  onClick={() => setFilter(cat.id)}
                  style={{ padding: isMobile ? "6px 12px" : "7px 14px", borderRadius: 50, border: activeFilter === cat.id ? "1.5px solid #00b4d8" : "1.5px solid rgba(0,180,216,0.2)", background: activeFilter === cat.id ? "rgba(0,180,216,0.12)" : "#fff", color: activeFilter === cat.id ? "#0077b6" : "#4a7fa5", fontSize: isMobile ? ".75rem" : ".8rem", fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0, transition: "all .18s" }}>
                  {cat.icon} {cat.name}
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* Cards Grid */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={gridStyle}>
              {[1,2,3,4].map((i) => (
                <div key={i} style={{ background: "#fff", borderRadius: 14, overflow: "hidden", boxShadow: "0 3px 16px rgba(0,100,160,0.07)" }}>
                  <div style={{ height: 110, background: "linear-gradient(90deg,#e0f2fe,#bae6fd,#e0f2fe)", backgroundSize: "200%", animation: "shimmer 1.5s infinite" }} />
                  <div style={{ padding: 12 }}>
                    {[70,50].map((w,j) => <div key={j} style={{ height: 10, background: "#e0f2fe", borderRadius: 5, width: `${w}%`, marginBottom: 8 }} />)}
                  </div>
                </div>
              ))}
            </motion.div>
          ) : filtered.length > 0 ? (
            <motion.div key={activeFilter + search + sortBy} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.22 }}
              style={gridStyle}>
              {visible.map((d, i) => <DealCard key={d.id} deal={d} index={i} compact={isMobile} isMobile={isMobile} />)}
            </motion.div>
          ) : (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              style={{ textAlign: "center", padding: "40px 24px", color: "#4a7fa5" }}>
              <div style={{ fontSize: "2.5rem", marginBottom: 10 }}>🔍</div>
              <h3 style={{ color: "#023e8a", fontWeight: 700, marginBottom: 6, fontSize: "1rem" }}>No deals found</h3>
              <button onClick={() => { setSearch(""); setFilter("all"); }}
                style={{ marginTop: 12, padding: "8px 18px", borderRadius: 50, background: "rgba(0,180,216,0.12)", border: "1.5px solid rgba(0,180,216,0.3)", color: "#0077b6", fontWeight: 600, cursor: "pointer", fontSize: ".85rem" }}>
                Clear Filters
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Load More — keeps the initial scroll short as the catalog grows */}
        {!loading && filtered.length > visibleCount && (
          <div style={{ textAlign: "center", marginTop: isMobile ? 20 : 32 }}>
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={() => setVisibleCount((v) => v + PAGE_SIZE)}
              style={{
                padding: isMobile ? "10px 22px" : "13px 32px", borderRadius: 50,
                background: "#fff", border: "1.5px solid #00b4d8", color: "#0077b6",
                fontWeight: 700, fontSize: isMobile ? ".82rem" : ".9rem", cursor: "pointer",
                boxShadow: "0 3px 14px rgba(0,180,216,0.15)",
              }}>
              Load More ({filtered.length - visibleCount} left)
            </motion.button>
          </div>
        )}
      </div>
      <style>{`@keyframes shimmer{0%{background-position:200%}100%{background-position:-200%}}`}</style>
    </section>
  );
}
