import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const links = [
  { label: "Featured", href: "#featured" },
  { label: "Categories", href: "#categories" },
  { label: "All Deals", href: "#deals" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
        background: scrolled ? "rgba(255,255,255,0.96)" : "rgba(255,255,255,0.85)",
        backdropFilter: "blur(16px)",
        borderBottom: `1px solid ${scrolled ? "rgba(0,180,216,0.25)" : "transparent"}`,
        boxShadow: scrolled ? "0 2px 20px rgba(0,100,160,0.1)" : "none",
        transition: "all 0.3s ease",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", height: 68, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {/* Logo */}
        <a href="/" style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: "linear-gradient(135deg, #00b4d8, #0077b6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem" }}>
            ⚡
          </div>
          <div>
            <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#023e8a", lineHeight: 1 }}>DealZone</div>
            <div style={{ fontSize: ".65rem", color: "#4a7fa5", fontWeight: 500, letterSpacing: ".05em" }}>Affiliate Deals Hub</div>
          </div>
        </a>

        {/* Desktop Nav */}
        <nav style={{ display: "flex", alignItems: "center", gap: 4 }} className="desk-nav">
          {links.map((l) => (
            <a key={l.label} href={l.href} style={{ padding: "8px 18px", borderRadius: 50, fontSize: ".9rem", fontWeight: 500, color: "#4a7fa5", transition: "all .2s" }}
              onMouseEnter={e => { e.currentTarget.style.color = "#0077b6"; e.currentTarget.style.background = "rgba(0,180,216,0.1)"; }}
              onMouseLeave={e => { e.currentTarget.style.color = "#4a7fa5"; e.currentTarget.style.background = "transparent"; }}>
              {l.label}
            </a>
          ))}
          <a href="#newsletter" style={{ padding: "9px 22px", borderRadius: 50, background: "linear-gradient(135deg,#00b4d8,#0077b6)", color: "#fff", fontWeight: 700, fontSize: ".9rem", boxShadow: "0 4px 14px rgba(0,180,216,0.35)", transition: "all .2s" }}
            onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
            onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
            Subscribe ✉
          </a>
          <a href="/admin" style={{ padding: "9px 18px", borderRadius: 50, background: "#fff", border: "1.5px solid #00b4d8", color: "#0077b6", fontWeight: 700, fontSize: ".9rem", marginLeft: 4, transition: "all .2s" }}
            onMouseEnter={e => { e.currentTarget.style.background = "#00b4d8"; e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = "#0077b6"; }}>
            Admin ⚙
          </a>
        </nav>

        <button onClick={() => setOpen(!open)} className="ham-btn"
          style={{ display: "none", background: "rgba(0,180,216,0.12)", border: "none", borderRadius: 8, padding: 8, color: "#0077b6" }}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            style={{ overflow: "hidden", background: "#fff", borderTop: "1px solid rgba(0,180,216,0.2)", padding: "0 24px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, padding: "16px 0" }}>
              {links.map((l) => (
                <a key={l.label} href={l.href} onClick={() => setOpen(false)}
                  style={{ padding: "11px 16px", borderRadius: 10, color: "#4a7fa5", fontWeight: 500 }}>{l.label}</a>
              ))}
              <a href="#newsletter" onClick={() => setOpen(false)}
                style={{ padding: "11px 16px", borderRadius: 10, background: "linear-gradient(135deg,#00b4d8,#0077b6)", color: "#fff", fontWeight: 700, textAlign: "center", marginTop: 4 }}>
                Subscribe ✉
              </a>
              <a href="/admin" onClick={() => setOpen(false)}
                style={{ padding: "11px 16px", borderRadius: 10, border: "1.5px solid #00b4d8", color: "#0077b6", fontWeight: 700, textAlign: "center" }}>
                Admin ⚙
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`@media(max-width:768px){.desk-nav{display:none!important}.ham-btn{display:flex!important}}`}</style>
    </motion.header>
  );
}
