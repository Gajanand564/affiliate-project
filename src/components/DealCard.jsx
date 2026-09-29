import { motion } from "framer-motion";
import { ExternalLink, Star } from "lucide-react";
import { IMG_BASE } from "../services/api";

function StarRating({ rating }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
      {[1,2,3,4,5].map((s) => (
        <Star key={s} size={11} fill={s <= Math.round(rating) ? "#f59e0b" : "none"} color={s <= Math.round(rating) ? "#f59e0b" : "#c0d4e0"} />
      ))}
      <span style={{ fontSize: ".72rem", color: "#4a7fa5", marginLeft: 3 }}>{rating}</span>
    </div>
  );
}

const GRAD_MAP = {
  "from-purple-500 to-blue-500": "#8b5cf6,#3b82f6",
  "from-cyan-500 to-blue-600": "#06b6d4,#2563eb",
  "from-indigo-500 to-purple-600": "#6366f1,#9333ea",
  "from-blue-600 to-indigo-700": "#2563eb,#4338ca",
  "from-green-500 to-teal-600": "#22c55e,#0d9488",
  "from-orange-500 to-red-500": "#f97316,#ef4444",
  "from-blue-400 to-blue-700": "#60a5fa,#1d4ed8",
  "from-emerald-500 to-green-600": "#10b981,#16a34a",
  "from-yellow-500 to-orange-500": "#eab308,#f97316",
  "from-fuchsia-500 to-purple-600": "#d946ef,#9333ea",
  "from-red-500 to-pink-600": "#ef4444,#db2777",
  "from-sky-500 to-cyan-600": "#0ea5e9,#0891b2",
  "from-amber-500 to-yellow-600": "#f59e0b,#ca8a04",
  "from-rose-500 to-red-600": "#f43f5e,#dc2626",
};

export default function DealCard({ deal, index = 0, compact = false, isMobile = false }) {
  const grad = GRAD_MAP[deal.gradient] || "#00b4d8,#0077b6";
  const imgSrc = deal.image ? (/^https?:\/\//.test(deal.image) ? deal.image : IMG_BASE + deal.image) : null;

  // On mobile, always use compact sizing regardless of prop
  const isCompact = compact || isMobile;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.04, 0.3) }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      style={{
        background: "#fff",
        borderRadius: 14,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 3px 16px rgba(0,100,160,0.1)",
        border: "1px solid rgba(0,180,216,0.15)",
        transition: "box-shadow .22s, border-color .22s",
      }}
    >
      {/* Image */}
      <div style={{
        position: "relative",
        aspectRatio: isCompact ? "4/3" : "16/9",
        background: deal.image ? "#f0f9ff" : `linear-gradient(135deg,${grad})`,
        display: "flex", alignItems: "center", justifyContent: "center",
        overflow: "hidden",
      }}>
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={deal.title}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            onError={e => { e.target.style.display = "none"; e.target.nextSibling.style.display = "flex"; }}
          />
        ) : null}
        {/* Fallback emoji (shown if no image or image fails) */}
        <div style={{ display: deal.image ? "none" : "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%", position: deal.image ? "absolute" : "relative", inset: 0, background: `linear-gradient(135deg,${grad})` }}>
          <div style={{ position: "absolute", width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.18)", filter: "blur(18px)" }} />
          <motion.span
            animate={{ scale: [1,1.08,1] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            style={{ fontSize: isCompact ? "2.4rem" : "3.2rem", position: "relative", zIndex: 1 }}>
            {deal.emoji}
          </motion.span>
        </div>
        {deal.badge && (
          <span style={{ position: "absolute", top: 8, left: 8, background: "rgba(0,0,0,0.45)", backdropFilter: "blur(6px)", color: "#fff", fontSize: ".65rem", fontWeight: 700, padding: "3px 8px", borderRadius: 50, zIndex: 2 }}>
            {deal.badge}
          </span>
        )}
        {deal.discount && (
          <span style={{ position: "absolute", top: 8, right: 8, background: "linear-gradient(135deg,#00c851,#00a040)", color: "#fff", fontSize: ".65rem", fontWeight: 700, padding: "3px 8px", borderRadius: 50, zIndex: 2 }}>
            {deal.discount}
          </span>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: isCompact ? "10px 10px 6px" : "16px 16px 10px", flex: 1, display: "flex", flexDirection: "column", gap: isCompact ? 4 : 6 }}>
        <span style={{ fontSize: ".68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".09em", color: "#00b4d8" }}>
          {deal.category}
        </span>
        <h3 style={{
          fontSize: isMobile ? "1rem" : isCompact ? ".93rem" : "1rem",
          fontWeight: 800,
          color: "#023e8a",
          lineHeight: 1.3,
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          margin: 0,
        }}>
          {deal.title}
        </h3>
        {!isCompact && (
          <p style={{ fontSize: ".86rem", color: "#4a7fa5", lineHeight: 1.55, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", margin: 0 }}>
            {deal.desc}
          </p>
        )}
        <StarRating rating={deal.rating} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto", flexWrap: "wrap", gap: 4 }}>
          <div>
            <span style={{ fontSize: isMobile ? "1.05rem" : isCompact ? "1.05rem" : "1.15rem", fontWeight: 900, color: "#0077b6" }}>{deal.price}</span>
            {deal.original && <span style={{ fontSize: ".72rem", color: "#93b4c8", textDecoration: "line-through", marginLeft: 5 }}>{deal.original}</span>}
          </div>
          {!isCompact && <span style={{ fontSize: ".7rem", color: "#93b4c8" }}>{Number(deal.reviews||0).toLocaleString()} reviews</span>}
        </div>
      </div>

      {/* CTA */}
      <div style={{ padding: isCompact ? "0 10px 10px" : "0 14px 14px" }}>
        <motion.a
          href={deal.affiliateUrl}
          target="_blank"
          rel="noopener noreferrer nofollow"
          whileTap={{ scale: 0.96 }}
          style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            width: "100%", padding: isCompact ? "8px 6px" : "11px 10px",
            borderRadius: 10,
            background: "linear-gradient(135deg,#00b4d8,#0077b6)",
            color: "#fff", fontWeight: 700, fontSize: isCompact ? ".78rem" : ".88rem",
            boxShadow: "0 3px 12px rgba(0,180,216,0.28)", border: "none",
            textDecoration: "none",
          }}
        >
          Get Deal <ExternalLink size={12} />
        </motion.a>
      </div>
    </motion.div>
  );
}
