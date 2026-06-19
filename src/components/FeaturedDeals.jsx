import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import DealCard from "./DealCard";
import { getDeals } from "../services/api";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useIsMobile } from "../hooks/useIsMobile";

export function SectionHeader({ tag, title, sub }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }}
      style={{ textAlign: "center", marginBottom: 32 }}>
      <span style={{ display: "inline-block", background: "rgba(0,180,216,0.12)", border: "1px solid rgba(0,180,216,0.3)", color: "#0077b6", padding: "4px 14px", borderRadius: 50, fontSize: ".72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 10 }}>{tag}</span>
      <h2 style={{ fontSize: "clamp(1.4rem,3vw,2.2rem)", fontWeight: 900, color: "#023e8a", marginBottom: 6, letterSpacing: "-0.02em" }}>{title}</h2>
      {sub && <p style={{ color: "#4a7fa5", fontSize: ".9rem" }}>{sub}</p>}
    </motion.div>
  );
}

export default function FeaturedDeals() {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);
  const isMobile = useIsMobile();

  // Mobile users come for deals directly — skip featured section
  if (isMobile) return null;

  useEffect(() => {
    getDeals({ featured: true, active: true })
      .then((d) => setDeals([...d].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))))
      .catch(() => setDeals([]))
      .finally(() => setLoading(false));
  }, []);

  const scroll = (dir) => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: dir * 280, behavior: "smooth" });
  };

  const mobileScrollStyle = {
    display: "flex",
    overflowX: "auto",
    scrollSnapType: "x mandatory",
    gap: 12,
    paddingBottom: 8,
    msOverflowStyle: "none",
    scrollbarWidth: "none",
  };

  const desktopGridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))",
    gap: 16,
  };

  return (
    <section id="featured" style={{ padding: "60px 0", background: "rgba(255,255,255,0.5)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: isMobile ? "0 12px" : "0 16px" }}>
        <SectionHeader tag="⭐ Editor's Pick" title="Featured Deals" sub="Top picks — newest first" />

        {loading ? <LoadingGrid isMobile={isMobile} /> : (
          <div style={{ position: "relative" }}>
            <div ref={scrollRef} style={isMobile ? mobileScrollStyle : desktopGridStyle}>
              {deals.map((d, i) => (
                <div key={d.id} style={isMobile ? { scrollSnapAlign: "start", minWidth: 200, flexShrink: 0 } : {}}>
                  <DealCard deal={d} index={i} compact={false} isMobile={isMobile} />
                </div>
              ))}
            </div>

            {/* Scroll arrows on mobile */}
            {isMobile && deals.length > 1 && (
              <>
                <button onClick={() => scroll(-1)}
                  style={{ position: "absolute", left: -6, top: "50%", transform: "translateY(-50%)", zIndex: 5, width: 32, height: 32, borderRadius: "50%", background: "#fff", border: "1px solid rgba(0,180,216,0.3)", color: "#0077b6", boxShadow: "0 2px 10px rgba(0,100,160,0.15)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <ChevronLeft size={16} />
                </button>
                <button onClick={() => scroll(1)}
                  style={{ position: "absolute", right: -6, top: "50%", transform: "translateY(-50%)", zIndex: 5, width: 32, height: 32, borderRadius: "50%", background: "#fff", border: "1px solid rgba(0,180,216,0.3)", color: "#0077b6", boxShadow: "0 2px 10px rgba(0,100,160,0.15)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <ChevronRight size={16} />
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

function LoadingGrid({ isMobile }) {
  const style = isMobile
    ? { display: "flex", gap: 12, overflowX: "hidden" }
    : { display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(270px,1fr))", gap: 16 };
  return (
    <div style={style}>
      {[1,2,3].map((i) => (
        <div key={i} style={{ background: "#fff", borderRadius: 14, overflow: "hidden", boxShadow: "0 3px 16px rgba(0,100,160,0.07)", flexShrink: 0, minWidth: isMobile ? 200 : undefined }}>
          <div style={{ height: 130, background: "linear-gradient(90deg,#e0f2fe,#bae6fd,#e0f2fe)", backgroundSize: "200%", animation: "shimmer 1.5s infinite" }} />
          <div style={{ padding: 14 }}>
            {[70,50,40].map((w,j) => <div key={j} style={{ height: 11, background: "#e0f2fe", borderRadius: 5, width: `${w}%`, marginBottom: 9 }} />)}
          </div>
          <style>{`@keyframes shimmer{0%{background-position:200%}100%{background-position:-200%}}`}</style>
        </div>
      ))}
    </div>
  );
}
