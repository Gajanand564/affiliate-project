import { motion } from "framer-motion";
import { ExternalLink, Star } from "lucide-react";
import { IMG_BASE } from "../services/api";

function StarRating({ rating }) {
  const value = Number(rating) || 4.7;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} size={12} fill={s <= Math.round(value) ? "#00a6d6" : "none"} color={s <= Math.round(value) ? "#00a6d6" : "#c0d4e0"} />
      ))}
      <span style={{ fontSize: ".74rem", color: "#64748b", marginLeft: 4 }}>{value}</span>
    </div>
  );
}

export default function DealCard({ deal, index = 0, compact = false, isMobile = false }) {
  const imgSrc = deal.image ? (/^https?:\/\//.test(deal.image) ? deal.image : IMG_BASE + deal.image) : null;
  const isCompact = compact || isMobile;

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.035, 0.25) }}
      whileHover={{ y: -4 }}
      style={{
        background: "#fff",
        borderRadius: 8,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        border: "1px solid rgba(0,180,216,.15)",
        boxShadow: "0 14px 34px rgba(0,100,160,.1)",
      }}
    >
      <div style={{
        position: "relative",
        aspectRatio: isCompact ? "1/1" : "4/3",
        background: "#f0f9ff",
        display: "grid",
        placeItems: "center",
        overflow: "hidden",
      }}>
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={deal.title}
            style={{ width: "100%", height: "100%", objectFit: "contain", padding: isCompact ? 8 : 14 }}
            onError={(e) => { e.currentTarget.style.display = "none"; }}
          />
        ) : (
          <div style={{ color: "#0077b6", fontWeight: 950, fontSize: isCompact ? "1.6rem" : "2rem" }}>DealZone</div>
        )}

        {deal.badge && (
          <span style={{ position: "absolute", top: 10, left: 10, background: "#023e8a", color: "#fff", fontSize: ".68rem", fontWeight: 900, padding: "5px 8px", borderRadius: 7 }}>
            {deal.badge}
          </span>
        )}
        {deal.discount && (
          <span style={{ position: "absolute", top: 10, right: 10, background: "#00a6d6", color: "#fff", fontSize: ".68rem", fontWeight: 900, padding: "5px 8px", borderRadius: 7 }}>
            {deal.discount}
          </span>
        )}
      </div>

      <div style={{ padding: isCompact ? "10px 10px 8px" : "15px 15px 10px", flex: 1, display: "flex", flexDirection: "column", gap: 7 }}>
        <span style={{ color: "#0077b6", fontSize: ".7rem", fontWeight: 950, textTransform: "uppercase", letterSpacing: ".04em" }}>
          {deal.category || "Deal"}
        </span>
        <h3 style={{
          margin: 0,
          color: "#023e8a",
          fontSize: isCompact ? ".92rem" : "1.02rem",
          lineHeight: 1.32,
          fontWeight: 900,
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}>
          {deal.title}
        </h3>
        {!isCompact && (
          <p style={{ margin: 0, color: "#4a7fa5", fontSize: ".86rem", lineHeight: 1.55, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
            {deal.desc}
          </p>
        )}
        <StarRating rating={deal.rating} />
        <div style={{ marginTop: "auto", display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 8, flexWrap: "wrap" }}>
          <div>
            <span style={{ color: "#0077b6", fontSize: isCompact ? "1.04rem" : "1.18rem", fontWeight: 950 }}>{deal.price}</span>
            {deal.original && <span style={{ color: "#93b4c8", fontSize: ".75rem", textDecoration: "line-through", marginLeft: 6 }}>{deal.original}</span>}
          </div>
          {!isCompact && <span style={{ color: "#93b4c8", fontSize: ".72rem" }}>{Number(deal.reviews || 0).toLocaleString()} reviews</span>}
        </div>
      </div>

      <div style={{ padding: isCompact ? "0 10px 10px" : "0 15px 15px" }}>
        <motion.a
          href={deal.affiliateUrl}
          target="_blank"
          rel="noopener noreferrer nofollow"
          whileTap={{ scale: 0.97 }}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 7,
            width: "100%",
            padding: isCompact ? "9px 7px" : "11px 10px",
            borderRadius: 8,
            background: "#023e8a",
            color: "#fff",
            fontWeight: 900,
            fontSize: isCompact ? ".78rem" : ".9rem",
          }}
        >
          View Deal <ExternalLink size={13} />
        </motion.a>
      </div>
    </motion.article>
  );
}
