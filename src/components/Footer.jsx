import { Camera, Heart, PlayCircle, Share2, Zap } from "lucide-react";

const cols = {
  Shop: [
    { label: "All Deals", href: "/#deals" },
    { label: "Newsletter", href: "/#newsletter" },
  ],
  Trending: [
    { label: "Home Decor Inspo", href: "/trends/home-decor-inspo-finds" },
    { label: "Fish Wallpaper", href: "/trends/fish-wallpaper-ideas" },
    { label: "Floating Shelves", href: "/trends/floating-shelf-decor-ideas" },
    { label: "Wainscoting", href: "/trends/wainscoting-and-beadboard-styles" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Affiliate Disclosure", href: "#" },
    { label: "Terms of Use", href: "#" },
  ],
};

const socials = [
  { icon: <Share2 size={17} />, label: "Twitter", href: "#" },
  { icon: <Camera size={17} />, label: "Instagram", href: "#" },
  { icon: <PlayCircle size={17} />, label: "YouTube", href: "#" },
];

export default function Footer() {
  return (
    <footer style={{ background: "#023e8a", color: "#90c4dd", padding: "58px 22px 0" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        <div className="footer-grid" style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 42, paddingBottom: 40, borderBottom: "1px solid rgba(255,255,255,.1)" }}>
          <div style={{ maxWidth: 330 }}>
            <a href="/" style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 14 }}>
              <span style={{ width: 40, height: 40, borderRadius: 10, background: "linear-gradient(135deg,#00b4d8,#0077b6)", color: "#fff", display: "grid", placeItems: "center" }}>
                <Zap size={21} fill="currentColor" />
              </span>
              <span>
                <span style={{ display: "block", color: "#fff", fontWeight: 950, fontSize: "1.12rem", lineHeight: 1 }}>DealZone</span>
                <span style={{ display: "block", color: "#90c4dd", fontWeight: 700, fontSize: ".68rem", marginTop: 3 }}>Affiliate Deals Hub</span>
              </span>
            </a>
            <p style={{ fontSize: ".88rem", lineHeight: 1.75, color: "#7db5cf", marginBottom: 18 }}>
              Home decor and kitchen deals selected around real shopping intent, seasonal trends, and practical use.
            </p>
            <div style={{ display: "flex", gap: 8 }}>
              {socials.map((s) => (
                <a key={s.label} href={s.href} aria-label={s.label}
                  style={{ width: 38, height: 38, borderRadius: 8, background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.12)", display: "grid", placeItems: "center", color: "#90c4dd" }}>
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          <div className="footer-links" style={{ display: "flex", gap: 42, flexWrap: "wrap" }}>
            {Object.entries(cols).map(([title, items]) => (
              <div key={title} style={{ display: "flex", flexDirection: "column", gap: 10, minWidth: 132 }}>
                <h4 style={{ color: "#fff", fontSize: ".86rem", fontWeight: 950, marginBottom: 4 }}>{title}</h4>
                {items.map((item) => (
                  <a key={item.label} href={item.href} style={{ color: "#90c4dd", fontSize: ".84rem", fontWeight: 650 }}>
                    {item.label}
                  </a>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div style={{ padding: "20px 0", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
          <p style={{ fontSize: ".78rem", color: "#4a7fa5" }}>© 2026 DealZone. This site contains affiliate links.</p>
          <p style={{ fontSize: ".78rem", color: "#4a7fa5", display: "flex", alignItems: "center", gap: 5 }}>
            Made with <Heart size={12} color="#00b4d8" fill="#00b4d8" /> for smart shoppers
          </p>
        </div>
      </div>
      <style>{`@media(max-width:768px){.footer-grid{grid-template-columns:1fr!important}.footer-links{gap:24px!important}}`}</style>
    </footer>
  );
}
