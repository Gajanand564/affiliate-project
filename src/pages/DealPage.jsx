import { useEffect, useMemo, useRef, useState } from "react";
import { Link, Navigate, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft, CheckCircle2, ExternalLink, ShieldCheck, Sparkles, Star } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import BackToTop from "../components/BackToTop";
import DealCard from "../components/DealCard";
import { dealRedirectUrl, getDealByAsin, getDeals, IMG_BASE } from "../services/api";
import { useIsMobile } from "../hooks/useIsMobile";
import { getAttribution, trackProduct } from "../services/attribution.mjs";
import { journeyParams, trackVisit } from "../services/visitorTracking.mjs";
import { productMetadata } from "../../lib/product-page.mjs";
import { sizedImage } from "../services/images.mjs";

const siteUrl = "https://www.freedealzone.biz";

const categoryLabels = {
  decor: "Home Decor",
  "wall-decor": "Wall Decor",
  lighting: "Lighting",
  bathroom: "Bathroom",
  kitchen: "Kitchen",
};

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

function cleanDescription(text) {
  return String(text || "")
    .replace(/#\w+/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^[|·:\-\s]+/, ""); // left over after removing a leading "#ad |"
}

function reasonList(deal) {
  const desc = cleanDescription(deal.desc);
  const sentences = desc.split(/(?<=[.!?])\s+/).filter(Boolean).slice(0, 3);
  const fallback = [
    `Fits ${categoryLabels[deal.category] || "home"} shopping intent.`,
    "Good for quick room refreshes without a full redesign.",
    "Selected from products already matched to Pinterest search demand.",
  ];
  return sentences.length ? sentences : fallback;
}

function displayPrice(price) {
  return price || "Check live price";
}

function cachedDeal(asin) {
  try {
    const items = JSON.parse(window.sessionStorage.getItem("dealzone:deals") || "[]");
    return items.find((item) => String(item.asin || "").toUpperCase() === String(asin || "").toUpperCase()) || null;
  } catch {
    return null;
  }
}

export default function DealPage() {
  const { asin } = useParams();
  const [searchParams] = useSearchParams();
  const [deal, setDeal] = useState(() => cachedDeal(asin));
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(() => !cachedDeal(asin));
  const [missing, setMissing] = useState(false);
  const isMobile = useIsMobile();
  const viewedAsin = useRef(null);

  useEffect(() => {
    if (deal?.asin === asin && viewedAsin.current !== asin) {
      trackProduct('view_item', deal);
      trackVisit('product_view', { asin: deal.asin });
      viewedAsin.current = asin;
    }
  }, [deal, asin]);

  useEffect(() => {
    let alive = true;
    getDealByAsin(asin)
      .then((item) => {
        if (!alive) return;
        setDeal(item);
        document.title = `${item.title} | DealZone`;
        setMeta("description", cleanDescription(item.desc).slice(0, 155) || `Shop ${item.title} with DealZone.`);
        setCanonical(`${siteUrl}/deal/${item.asin || asin}`);
        const metadata = productMetadata(item);
        // The mounted product renders its current structured data below.
        document.getElementById('initial-product-data')?.remove();
        for (const [property, value] of Object.entries({ 'og:type': 'product', 'og:title': metadata.title,
          'og:description': metadata.description, 'og:url': metadata.url, 'og:image': metadata.image, 'og:image:alt': metadata.name })) {
          let element = document.querySelector(`meta[property="${property}"]`);
          if (!element) {
            element = document.createElement('meta');
            element.setAttribute('property', property);
            document.head.appendChild(element);
          }
          element.setAttribute('content', value);
        }
      })
      .catch(() => {
        if (alive) setMissing(true);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [asin]);

  useEffect(() => {
    if (!deal) return;
    // Only a few related products are fetched, not the whole catalog.
    getDeals({ active: true, category: deal.category, exclude: deal.id, limit: 5 })
      .then((items) => {
        const same = items
          .filter((item) => item.id !== deal.id && item.category === deal.category)
          .slice(0, 4);
        setRelated(same);
      })
      .catch(() => setRelated([]));
  }, [deal]);

  const imgSrc = useMemo(() => {
    if (!deal?.image) return null;
    return /^https?:\/\//.test(deal.image) ? sizedImage(deal.image, 800) : IMG_BASE + deal.image;
  }, [deal]);

  if (missing) return <Navigate to="/" replace />;

  if (loading || !deal) {
    return (
      <>
        <Header />
        <main style={{ minHeight: "70vh", background: "#f8fdff", padding: "120px 24px", color: "#467ba4", textAlign: "center" }}>
          Loading deal...
        </main>
        <Footer />
      </>
    );
  }

  const reasons = reasonList(deal);
  const category = categoryLabels[deal.category] || deal.category || "Deal";
  const campaign = getAttribution();
  const source = campaign.utm_source || searchParams.get("src") || "site";
  const redirect = dealRedirectUrl(deal.asin || asin, {
    src: source,
    utm_medium: campaign.utm_medium || "deal_page",
    utm_campaign: campaign.utm_campaign || deal.category || "dealzone",
    utm_content: campaign.utm_content || deal.asin || asin,
    ...journeyParams(),
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: deal.title,
    image: imgSrc ? [imgSrc] : undefined,
    description: cleanDescription(deal.desc),
    sku: deal.asin,
    ...(Number(deal.rating) > 0 && Number(deal.reviews) > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: Number(deal.rating),
            reviewCount: Number(deal.reviews),
          },
        }
      : {}),
  };

  return (
    <>
      <Header />
      <main style={{ background: "#f8fdff", minHeight: "100vh" }}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <section style={{ padding: isMobile ? "98px 16px 34px" : "126px 24px 54px", background: "#fff", borderBottom: "1px solid rgba(0,180,216,.14)" }}>
          <div style={{ maxWidth: 1160, margin: "0 auto" }}>
            <Link to="/#deals" style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "#0077b6", fontWeight: 850, marginBottom: 22 }}>
              <ArrowLeft size={16} /> Back to deals
            </Link>

            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "minmax(320px,.85fr) minmax(0,1.15fr)", gap: isMobile ? 22 : 42, alignItems: "center" }}>
              <div style={{ background: "#f0f9ff", border: "1px solid rgba(0,180,216,.16)", borderRadius: 8, minHeight: isMobile ? 260 : 440, display: "grid", placeItems: "center", padding: 18 }}>
                {imgSrc ? (
                  <img src={imgSrc} alt={deal.title} style={{ width: "100%", maxHeight: isMobile ? 300 : 430, objectFit: "contain" }} />
                ) : (
                  <strong style={{ color: "#023e8a", fontSize: "2rem" }}>DealZone</strong>
                )}
              </div>

              <div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
                  <span style={{ padding: "7px 11px", borderRadius: 999, background: "rgba(0,180,216,.12)", color: "#0077b6", fontSize: ".78rem", fontWeight: 900 }}>{category}</span>
                  <span style={{ padding: "7px 11px", borderRadius: 999, background: "#eef8fd", color: "#467ba4", fontSize: ".78rem", fontWeight: 800 }}>Amazon find</span>
                </div>

                <h1 style={{ color: "#023e8a", margin: 0, fontSize: isMobile ? "1.85rem" : "3rem", lineHeight: 1.08, letterSpacing: 0 }}>
                  {deal.title}
                </h1>

                <p style={{ color: "#467ba4", lineHeight: 1.7, fontSize: isMobile ? ".96rem" : "1.04rem", margin: "18px 0" }}>
                  {cleanDescription(deal.desc)}
                </p>

                <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap", marginBottom: 20 }}>
                  <strong style={{ color: "#0077b6", fontSize: "1.42rem" }}>{displayPrice(deal.price)}</strong>
                  {Number(deal.rating) > 0 && Number(deal.reviews) > 0 && <span style={{ display: "inline-flex", alignItems: "center", gap: 5, color: "#4a7fa5", fontWeight: 800 }}>
                    <Star size={16} fill="#00a6d6" color="#00a6d6" /> {Number(deal.rating).toFixed(1)}
                  </span>}
                  {!!deal.reviews && <span style={{ color: "#7ca5bb", fontWeight: 700 }}>{Number(deal.reviews).toLocaleString()} reviews</span>}
                </div>

                <a href={redirect} target="_blank" rel="noopener noreferrer nofollow sponsored" onClick={() => trackProduct('affiliate_click', deal)}
                  style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 9, width: isMobile ? "100%" : "auto", padding: "14px 24px", borderRadius: 8, background: "#023e8a", color: "#fff", fontWeight: 950, boxShadow: "0 14px 28px rgba(2,62,138,.22)" }}>
                  Check live price on Amazon <ExternalLink size={17} />
                </a>

                <p style={{ margin: "12px 0 0", color: "#64748b", fontSize: ".8rem", lineHeight: 1.55 }}>
                  Amazon.com picks for US shoppers. Availability and shipping depend on your address. As an Amazon Associate I earn from qualifying purchases. Price and availability can change on Amazon.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section style={{ padding: isMobile ? "28px 16px" : "46px 24px", background: "#d9f1fc" }}>
          <div style={{ maxWidth: 1160, margin: "0 auto", display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 18 }}>
            <div style={{ background: "#fff", border: "1px solid rgba(0,180,216,.16)", borderRadius: 8, padding: 22 }}>
              <h2 style={{ color: "#023e8a", margin: "0 0 14px", fontSize: "1.2rem" }}>Why it is worth a look</h2>
              <div style={{ display: "grid", gap: 11 }}>
                {reasons.map((reason) => (
                  <div key={reason} style={{ display: "flex", gap: 10, color: "#467ba4", lineHeight: 1.6 }}>
                    <CheckCircle2 size={18} color="#00a6d6" style={{ marginTop: 2, flexShrink: 0 }} /> {reason}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: "#fff", border: "1px solid rgba(0,180,216,.16)", borderRadius: 8, padding: 22 }}>
              <h2 style={{ color: "#023e8a", margin: "0 0 14px", fontSize: "1.2rem" }}>Best fit</h2>
              <div style={{ display: "grid", gap: 12, color: "#467ba4", lineHeight: 1.6 }}>
                <div style={{ display: "flex", gap: 10 }}>
                  <Sparkles size={18} color="#00a6d6" style={{ marginTop: 2, flexShrink: 0 }} />
                  Use this when you want a quick {category.toLowerCase()} upgrade without rebuilding the whole room.
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <ShieldCheck size={18} color="#00a6d6" style={{ marginTop: 2, flexShrink: 0 }} />
                  Check the product dimensions, materials and delivery options on Amazon before ordering.
                </div>
              </div>
            </div>
          </div>
        </section>

        {related.length > 0 && (
          <section style={{ padding: isMobile ? "28px 12px 56px" : "48px 24px 78px", background: "#fff" }}>
            <div style={{ maxWidth: 1160, margin: "0 auto" }}>
              <h2 style={{ color: "#023e8a", margin: "0 0 18px", fontSize: isMobile ? "1.35rem" : "1.9rem" }}>Related finds</h2>
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2,1fr)" : "repeat(auto-fill,minmax(245px,1fr))", gap: isMobile ? 10 : 16 }}>
                {related.map((item, index) => <DealCard key={item.id} deal={item} index={index} compact={isMobile} isMobile={isMobile} />)}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
