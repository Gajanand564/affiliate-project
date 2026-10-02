import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Mail, Menu, X, Zap } from "lucide-react";

const links = [
  { label: "All Deals", href: "/#deals" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", fn);
    fn();
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <motion.header
      initial={{ y: -70, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: scrolled ? "rgba(248,253,255,.96)" : "rgba(248,253,255,.9)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(0,119,182,.08)",
        boxShadow: scrolled ? "0 10px 28px rgba(0,77,128,.08)" : "none",
      }}
    >
      <div style={{ maxWidth: 1180, margin: "0 auto", height: 66, padding: "0 22px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
        <a href="/" style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ width: 42, height: 42, borderRadius: 10, background: "linear-gradient(135deg,#00b4d8,#0077b6)", color: "#fff", display: "grid", placeItems: "center", boxShadow: "0 8px 20px rgba(0,180,216,.24)" }}>
            <Zap size={21} fill="currentColor" />
          </span>
          <span>
            <span style={{ display: "block", color: "#023e8a", fontWeight: 900, lineHeight: 1, fontSize: "1.12rem" }}>DealZone</span>
            <span style={{ display: "block", color: "#467ba4", fontWeight: 650, fontSize: ".68rem", marginTop: 3 }}>Affiliate Deals Hub</span>
          </span>
        </a>

        <nav className="desk-nav" style={{ display: "flex", alignItems: "center", gap: 18 }}>
          {links.map((link) => (
            <a key={link.label} href={link.href} style={{ color: "#467ba4", fontWeight: 750, fontSize: ".95rem" }}>
              {link.label}
            </a>
          ))}
          <a href="/#newsletter" style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "10px 18px", borderRadius: 999, background: "linear-gradient(135deg,#00b4d8,#0077b6)", color: "#fff", fontWeight: 850, fontSize: ".92rem", boxShadow: "0 10px 24px rgba(0,180,216,.28)" }}>
            Subscribe <Mail size={16} />
          </a>
        </nav>

        <button onClick={() => setOpen((v) => !v)} className="ham-btn" aria-label="Menu"
          style={{ display: "none", width: 44, height: 44, border: "1px solid rgba(0,119,182,.14)", borderRadius: 10, background: "#fff", color: "#023e8a", placeItems: "center" }}>
          {open ? <X size={23} /> : <Menu size={23} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            style={{ overflow: "hidden", background: "#f8fdff", borderTop: "1px solid rgba(0,119,182,.1)" }}>
            <div style={{ padding: "12px 20px 18px", display: "grid", gap: 8 }}>
              {links.map((link) => (
                <a key={link.label} href={link.href} onClick={() => setOpen(false)}
                  style={{ padding: "12px 10px", borderRadius: 8, color: "#023e8a", fontWeight: 850 }}>
                  {link.label}
                </a>
              ))}
              <a href="/#newsletter" onClick={() => setOpen(false)}
                style={{ padding: "12px 10px", borderRadius: 10, color: "#fff", background: "linear-gradient(135deg,#00b4d8,#0077b6)", fontWeight: 900, textAlign: "center" }}>
                Subscribe
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`@media(max-width:768px){.desk-nav{display:none!important}.ham-btn{display:grid!important}}`}</style>
    </motion.header>
  );
}
