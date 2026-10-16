import { useEffect, useMemo, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, ShoppingBag } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import BackToTop from "../components/BackToTop";
import DealCard from "../components/DealCard";
import Newsletter from "../components/Newsletter";
import { getDeals } from "../services/api";
import { useIsMobile } from "../hooks/useIsMobile";
import { trendPageBySlug, trendPages } from "../data/trendPages";

const siteUrl = "https://www.freedealzone.biz";

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

function textForDeal(deal) {
  return `${deal.title || ""} ${deal.desc || ""} ${deal.category || ""}`.toLowerCase();
}

function trendMatches(page, deal) {
  const haystack = textForDeal(deal);
  return page.matchTerms.some((term) => haystack.includes(term.toLowerCase()));
}

function scoreDeal(page, deal) {
  const haystack = textForDeal(deal);
  return page.matchTerms.reduce((score, term) => (
    haystack.includes(term.toLowerCase()) ? score + 1 : score
  ), 0);
}

export default function TrendPage({ staticRender = false }) {
  const { slug } = useParams();
  const page = trendPageBySlug[slug];
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!page) return;
    document.title = page.seoTitle;
    setMeta("description", page.metaDescription);
    setCanonical(`${siteUrl}/trends/${page.slug}`);
  }, [page]);

  useEffect(() => {
    getDeals({ active: true })
      .then((items) => setDeals(Array.isArray(items) ? items : []))
      .catch(() => setLoadError(true))
      .finally(() => setLoading(false));
  }, []);

  const selectedDeals = useMemo(() => {
    if (!page) return [];
    const exact = deals
      .filter((deal) => trendMatches(page, deal))
      .sort((a, b) => scoreDeal(page, b) - scoreDeal(page, a));

    return exact.slice(0, 12);
  }, [deals, page]);

  if (!page) return <Navigate to="/trends/wainscoting-and-beadboard-styles" replace />;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: page.seoTitle,
        description: page.metaDescription,
        url: `${siteUrl}/trends/${page.slug}`,
        publisher: { "@type": "Organization", "@id": "https://www.freedealzone.biz/#organization", name: "DealZone", logo: "https://www.freedealzone.biz/brand/dz-logo.png" },
      },
      {
        "@type": "FAQPage",
        mainEntity: page.faq.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      },
    ],
  };

  return (
    <>
      <Header staticRender={staticRender} />
      <main style={{ background: "#d9f1fc", minHeight: "100vh" }}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

        <section style={{ padding: isMobile ? "104px 16px 34px" : "132px 24px 58px", background: "#ffffff" }}>
          <div className="trend-hero-grid" style={{ maxWidth: 1160, margin: "0 auto", display: "grid", gridTemplateColumns: isMobile ? "1fr" : "minmax(0, 1.2fr) minmax(300px, .8fr)", gap: 28, alignItems: "center" }}>
            <div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
                {["Home & kitchen buying guide"].map((label) => (
                  <span key={label} style={{ padding: "7px 11px", borderRadius: 999, background: "rgba(0,180,216,.12)", color: "#0077b6", fontSize: ".78rem", fontWeight: 800 }}>
                    {label}
                  </span>
                ))}
              </div>
              <h1 className="trend-title" style={{ margin: 0, color: "#023e8a", fontSize: isMobile ? "2rem" : "3.35rem", lineHeight: 1.05, letterSpacing: 0 }}>
                {page.title}
              </h1>
              <p style={{ color: "#467ba4", fontSize: isMobile ? "1rem" : "1.08rem", lineHeight: 1.75, maxWidth: 700, margin: "18px 0 24px" }}>
                {page.intro}
              </p>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <a href="#trend-deals" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 18px", borderRadius: 999, background: "linear-gradient(135deg,#00b4d8,#0077b6)", color: "#fff", fontWeight: 800 }}>
                  Shop related finds <ArrowRight size={16} />
                </a>
                <a href="/" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 18px", borderRadius: 999, background: "#fff", color: "#0077b6", fontWeight: 800, border: "1px solid rgba(0,180,216,.25)" }}>
                  Browse all deals
                </a>
              </div>
            </div>

            <div style={{ background: "#f0f9ff", border: "1px solid rgba(0,180,216,.18)", borderRadius: 8, padding: 22 }}>
              <h2 style={{ margin: "0 0 14px", color: "#023e8a", fontSize: "1.1rem" }}>What to look for</h2>
              <div style={{ display: "grid", gap: 10 }}>
                {page.productAngles.map((angle) => (
                  <div key={angle} style={{ display: "flex", alignItems: "center", gap: 10, color: "#467ba4", fontWeight: 700 }}>
                    <ShoppingBag size={17} color="#00a6d6" /> {angle}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="trend-deals" style={{ padding: isMobile ? "30px 12px" : "54px 24px" }}>
          <div style={{ maxWidth: 1160, margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "end", flexWrap: "wrap", marginBottom: 18 }}>
              <div>
                <span style={{ color: "#00a6d6", fontWeight: 900, fontSize: ".78rem", textTransform: "uppercase" }}>Trend-matched deals</span>
                <h2 style={{ color: "#023e8a", margin: "5px 0 0", fontSize: isMobile ? "1.45rem" : "2rem" }}>
                  Related finds for {page.title}
                </h2>
              </div>
              <span style={{ color: "#467ba4", fontWeight: 700 }}>{loading ? "Loading deals" : loadError ? "Products temporarily unavailable" : `${selectedDeals.length} finds`}</span>
            </div>

            {selectedDeals.length > 0 ? (
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(auto-fill, minmax(245px, 1fr))", gap: isMobile ? 10 : 16 }}>
                {selectedDeals.map((deal, index) => (
                  <DealCard key={deal.id} deal={deal} index={index} compact={isMobile} isMobile={isMobile} />
                ))}
              </div>
            ) : (
              <div style={{ background: "#fff", borderRadius: 8, padding: 26, color: "#467ba4", border: "1px solid rgba(0,180,216,.16)" }}>
                {loading
                  ? "Loading related products. You can read the buying guide below while they load."
                  : loadError
                    ? "Products could not be loaded. Please try again later; the buying guide is still available below."
                    : "No matching products are available right now. Use the buying guide below to plan your search."}
              </div>
            )}
          </div>
        </section>

        <section style={{ padding: isMobile ? "24px 16px 42px" : "36px 24px 70px", background: "#fff" }}>
          <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr", gap: 24 }}>
            <div>
              <h2 style={{ color: "#023e8a", margin: "0 0 14px" }}>Buying guide</h2>
              <div style={{ display: "grid", gap: 12 }}>
                {page.buyingTips.map((tip) => (
                  <motion.div key={tip} initial={staticRender ? false : { opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    style={{ display: "flex", gap: 10, color: "#467ba4", lineHeight: 1.55 }}>
                    <CheckCircle2 size={18} color="#00a6d6" style={{ marginTop: 2, flexShrink: 0 }} /> {tip}
                  </motion.div>
                ))}
              </div>
            </div>

          </div>
        </section>

        <section style={{ padding: isMobile ? "30px 16px 50px" : "50px 24px 78px" }}>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <h2 style={{ color: "#023e8a", margin: "0 0 16px" }}>Quick answers</h2>
            <div style={{ display: "grid", gap: 12 }}>
              {page.faq.map((item) => (
                <div key={item.question} style={{ background: "#fff", border: "1px solid rgba(0,180,216,.16)", borderRadius: 8, padding: 18 }}>
                  <h3 style={{ color: "#023e8a", margin: "0 0 7px", fontSize: "1rem" }}>{item.question}</h3>
                  <p style={{ color: "#467ba4", margin: 0, lineHeight: 1.6 }}>{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section style={{ padding: isMobile ? "0 16px 52px" : "0 24px 76px" }}>
          <div style={{ maxWidth: 1160, margin: "0 auto" }}>
            <h2 style={{ color: "#023e8a", margin: "0 0 14px" }}>More trend pages</h2>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {trendPages.filter((item) => item.slug !== page.slug).map((item) => (
                <a key={item.slug} href={`/trends/${item.slug}`} style={{ padding: "10px 13px", borderRadius: 999, background: "#fff", color: "#0077b6", fontWeight: 800, border: "1px solid rgba(0,180,216,.22)" }}>
                  {item.title}
                </a>
              ))}
            </div>
          </div>
        </section>

        <Newsletter staticRender={staticRender} />
      </main>
      <Footer />
      <BackToTop />
      <style>{`@media(max-width:1024px){.trend-hero-grid{grid-template-columns:1fr!important}.trend-title{font-size:2rem!important}}`}</style>
    </>
  );
}
