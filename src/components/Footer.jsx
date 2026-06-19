import { motion } from "framer-motion";
import { Heart, Share2, Camera, PlayCircle } from "lucide-react";

const cols = {
  "Quick Links": [{ label: "Featured Deals", href: "#featured" }, { label: "Categories", href: "#categories" }, { label: "All Deals", href: "#deals" }, { label: "Newsletter", href: "#newsletter" }],
  "Legal":       [{ label: "Privacy Policy", href: "#" }, { label: "Affiliate Disclosure", href: "#" }, { label: "Terms of Use", href: "#" }],
  "Categories":  [{ label: "Tech & Gadgets", href: "#" }, { label: "Gaming", href: "#" }, { label: "Fashion", href: "#" }, { label: "Health", href: "#" }],
};
const socials = [
  { icon: <Share2 size={17} />, label: "Twitter", href: "#" },
  { icon: <Camera size={17} />, label: "Instagram", href: "#" },
  { icon: <PlayCircle size={17} />, label: "YouTube", href: "#" },
];

export default function Footer() {
  return (
    <footer style={{ background: "#023e8a", color: "#90c4dd", padding: "56px 24px 0" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 40, paddingBottom: 40, borderBottom: "1px solid rgba(255,255,255,0.1)" }} className="footer-grid">
          {/* Brand */}
          <div style={{ maxWidth: 280 }}>
            <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem" }}>⚡</div>
              <div>
                <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#fff" }}>DealZone</div>
                <div style={{ fontSize: ".6rem", color: "#90c4dd", letterSpacing: ".05em" }}>Affiliate Deals Hub</div>
              </div>
            </a>
            <p style={{ fontSize: ".85rem", lineHeight: 1.7, marginBottom: 20, color: "#7db5cf" }}>Your trusted source for the best affiliate deals and honest product reviews.</p>
            <div style={{ display: "flex", gap: 8 }}>
              {socials.map((s) => (
                <motion.a key={s.label} href={s.href} whileHover={{ scale: 1.1, y: -2 }} whileTap={{ scale: 0.95 }}
                  style={{ width: 36, height: 36, borderRadius: 8, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", color: "#7db5cf", transition: "color .2s, border-color .2s" }}
                  onMouseEnter={e => { e.currentTarget.style.color = "#00b4d8"; e.currentTarget.style.borderColor = "rgba(0,180,216,0.5)"; }}
                  onMouseLeave={e => { e.currentTarget.style.color = "#7db5cf"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; }}>
                  {s.icon}
                </motion.a>
              ))}
            </div>
          </div>
          {/* Links */}
          <div style={{ display: "flex", gap: 40, flexWrap: "wrap" }} className="footer-links">
            {Object.entries(cols).map(([title, items]) => (
              <div key={title} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <h4 style={{ color: "#fff", fontSize: ".85rem", fontWeight: 700, marginBottom: 4 }}>{title}</h4>
                {items.map((item) => (
                  <a key={item.label} href={item.href} style={{ color: "#7db5cf", fontSize: ".83rem", transition: "color .2s" }}
                    onMouseEnter={e => e.currentTarget.style.color = "#00b4d8"}
                    onMouseLeave={e => e.currentTarget.style.color = "#7db5cf"}>
                    {item.label}
                  </a>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div style={{ padding: "20px 0", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
          <p style={{ fontSize: ".78rem", color: "#4a7fa5" }}>© 2026 DealZone. All rights reserved. | This site contains affiliate links.</p>
          <p style={{ fontSize: ".78rem", color: "#4a7fa5", display: "flex", alignItems: "center", gap: 4 }}>
            Made with <Heart size={12} color="#00b4d8" fill="#00b4d8" /> for deal hunters
          </p>
        </div>
      </div>
      <style>{`@media(max-width:768px){.footer-grid{grid-template-columns:1fr!important}.footer-links{gap:24px!important}}`}</style>
    </footer>
  );
}
