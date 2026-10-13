import { useEffect, useMemo, useState } from "react";
import { ArrowRight, ExternalLink, Layers3, ShieldCheck, ShoppingBag, Sparkles, Store } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import BackToTop from "../components/BackToTop";
import DealCard from "../components/DealCard";
import Newsletter from "../components/Newsletter";
import { getDeals } from "../services/api";
import { useIsMobile } from "../hooks/useIsMobile";
import { AMAZON_STOREFRONT_URL, hasAmazonStorefront } from "../config/storefront";

const siteUrl = "https://www.freedealzone.biz";

const collections = [
  { id: "decor", name: "Home Decor", copy: "Mirrors, wall accents, shelves, and room-refresh finds." },
  { id: "wall-decor", name: "Wall Decor", copy: "Frames, panels, wallpaper ideas, and visual upgrades." },
  { id: "lighting", name: "Lighting", copy: "Table lamps, accent lighting, and cozy glow pieces." },
  { id: "kitchen", name: "Kitchen", copy: "Useful gadgets and affordable kitchen styling picks." },
  { id: "bathroom", name: "Bathroom", copy: "Mirrors, organizers, and compact bathroom upgrades." },
];

function setMeta(name, value) {
  let el = document.querySelector(`meta[name="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("name", name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", value);
}

function setCanonical(href) {
  let el = document.querySelector('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

function readCachedDeals() {
  try {
    return JSON.parse(window.sessionStorage.getItem("dealzone:deals") || "[]");
  } catch {
    return [];
  }
}

export default function StorefrontPage() {
  const [deals, setDeals] = useState(() => readCachedDeals());
  const [loading, setLoading] = useState(() => readCachedDeals().length === 0);
  const isMobile = useIsMobile();

  useEffect(() => {
    document.title = "Amazon Influencer Storefront | DealZone";
    setMeta(
      "description",
      "Browse DealZone's Amazon Influencer Storefront style collections for affordable home decor, lighting, wall decor, bathroom, and kitchen finds."
    );
    setCanonical(`${siteUrl}/storefront`);
  }, []);

  useEffect(() => {
    let alive = true;
    getDeals({ active: true })
      .then((items) => {
        if (!alive) return;
        const sorted = Array.isArray(items)
          ? [...items].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          : [];
        setDeals(sorted);
        try {
          window.sessionStorage.setItem("dealzone:deals", JSON.stringify(sorted));
        } catch {
          // Storage can fail in private browsing; the page still works.
        }
      })
      .catch(() => {})
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  const featured = useMemo(() => deals.slice(0, 8), [deals]);
  const grouped = useMemo(() => {
    return collections
      .map((collection) => ({
        ...collection,
        deals: deals.filter((deal) => deal.category === collection.id).slice(0, 4),
      }))
      .filter((collection) => collection.deals.length > 0);
  }, [deals]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Amazon Influencer Storefront | DealZone",
    description: "Curated Amazon home decor and kitchen finds from DealZone.",
    url: `${siteUrl}/storefront`,
    publisher: { "@type": "Organization", name: "DealZone" },
  };

  return (
    <>
      <Header />
      <main style={{ background: "#f8fdff", minHeight: "100vh" }}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

        <section style={{ padding: isMobile ? "102px 16px 36px" : "130px 24px 58px", background: "#d9f1fc", borderBottom: "1px solid rgba(0,119,182,.08)" }}>
          <div style={{ maxWidth: 1160, margin: "0 auto", display: "grid", gridTemplateColumns: isMobile ? "1fr" : "minmax(0,1.15fr) minmax(310px,.85fr)", gap: 28, alignItems: "center" }}>
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "7px 13px", borderRadius: 999, background: "rgba(0,180,216,.14)", color: "#0077b6", fontWeight: 900, fontSize: ".78rem", marginBottom: 16 }}>
                <Store size={16} /> Amazon Influencer Storefront
              </div>
              <h1 style={{ margin: 0, color: "#023e8a", fontSize: isMobile ? "2rem" : "3.4rem", lineHeight: 1.06, letterSpacing: 0 }}>
                Curated Amazon finds for budget-friendly rooms
              </h1>
              <p style={{ color: "#467ba4", fontSize: isMobile ? ".98rem" : "1.08rem", lineHeight: 1.72, maxWidth: 650, margin: "18px 0 24px" }}>
                Shop DealZone collections for home decor, wall accents, lighting, kitchen helpers, and small-space upgrades. Product buttons open detail pages first so pricing and links stay trackable.
              </p>

              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <a href="#storefront-finds" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 18px", borderRadius: 999, background: "#023e8a", color: "#fff", fontWeight: 900 }}>
                  Browse collections <ArrowRight size={16} />
                </a>
                {hasAmazonStorefront && (
                  <a href={AMAZON_STOREFRONT_URL} target="_blank" rel="noopener noreferrer nofollow"
                    style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 18px", borderRadius: 999, background: "#fff", color: "#0077b6", fontWeight: 900, border: "1px solid rgba(0,180,216,.25)" }}>
                    Open Amazon storefront <ExternalLink size={16} />
                  </a>
                )}
              </div>
            </div>

            <div style={{ background: "#fff", border: "1px solid rgba(0,180,216,.16)", borderRadius: 8, padding: 22, boxShadow: "0 16px 38px rgba(0,100,160,.1)" }}>
              {[
                { icon: <Layers3 size={18} />, label: `${collections.length} curated collections` },
                { icon: <ShoppingBag size={18} />, label: `${deals.length || "..."} active Amazon finds` },
                { icon: <ShieldCheck size={18} />, label: "Clear affiliate disclosure" },
                { icon: <Sparkles size={18} />, label: "Updated from the product feed" },
              ].map((item) => (
                <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 10, color: "#467ba4", fontWeight: 800, padding: "11px 0", borderBottom: "1px solid rgba(0,180,216,.1)" }}>
                  <span style={{ color: "#00a6d6", display: "flex" }}>{item.icon}</span>
                  {item.label}
                </div>
              ))}
              <p style={{ margin: "16px 0 0", color: "#64748b", fontSize: ".82rem", lineHeight: 1.55 }}>
                As an Amazon Associate I earn from qualifying purchases.
              </p>
            </div>
          </div>
        </section>

        <section id="storefront-finds" style={{ padding: isMobile ? "30px 12px" : "54px 24px", background: "#fff" }}>
          <div style={{ maxWidth: 1160, margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", gap: 14, flexWrap: "wrap", marginBottom: 18 }}>
              <div>
                <span style={{ color: "#00a6d6", fontWeight: 950, fontSize: ".78rem", textTransform: "uppercase" }}>Latest storefront picks</span>
                <h2 style={{ color: "#023e8a", margin: "5px 0 0", fontSize: isMobile ? "1.45rem" : "2rem" }}>Fresh Amazon finds</h2>
              </div>
              <span style={{ color: "#467ba4", fontWeight: 800 }}>{loading ? "Loading" : `${featured.length} featured picks`}</span>
            </div>

            {featured.length > 0 ? (
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2,1fr)" : "repeat(auto-fill,minmax(245px,1fr))", gap: isMobile ? 10 : 16 }}>
                {featured.map((deal, index) => (
                  <DealCard key={deal.id} deal={deal} index={index} compact={isMobile} isMobile={isMobile} />
                ))}
              </div>
            ) : (
              <div style={{ background: "#f0f9ff", border: "1px solid rgba(0,180,216,.16)", borderRadius: 8, padding: 24, color: "#467ba4" }}>
                Loading storefront products...
              </div>
            )}
          </div>
        </section>

        <section style={{ padding: isMobile ? "30px 12px 52px" : "54px 24px 78px", background: "#d9f1fc" }}>
          <div style={{ maxWidth: 1160, margin: "0 auto" }}>
            <h2 style={{ color: "#023e8a", margin: "0 0 18px", fontSize: isMobile ? "1.45rem" : "2rem" }}>Shop by collection</h2>
            <div style={{ display: "grid", gap: isMobile ? 22 : 28 }}>
              {grouped.map((collection) => (
                <div key={collection.id}>
                  <div style={{ display: "flex", alignItems: "end", justifyContent: "space-between", gap: 12, flexWrap: "wrap", marginBottom: 12 }}>
                    <div>
                      <h3 style={{ color: "#023e8a", margin: 0, fontSize: isMobile ? "1.14rem" : "1.35rem" }}>{collection.name}</h3>
                      <p style={{ color: "#467ba4", margin: "4px 0 0", fontSize: ".92rem" }}>{collection.copy}</p>
                    </div>
                    <a href={`/#deals`} style={{ color: "#0077b6", fontWeight: 900, fontSize: ".86rem" }}>View all</a>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2,1fr)" : "repeat(4,1fr)", gap: isMobile ? 10 : 16 }}>
                    {collection.deals.map((deal, index) => (
                      <DealCard key={deal.id} deal={deal} index={index} compact={isMobile} isMobile={isMobile} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Newsletter />
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
