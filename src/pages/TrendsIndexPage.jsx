import { useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { trendPages } from "../data/trendPages";

const siteUrl = "https://www.freedealzone.biz";
export const TRENDS_TITLE = "Home Decor Buying Guides and Trend Ideas | DealZone";
export const TRENDS_DESCRIPTION =
  "Every DealZone home decor guide in one place: wall decor, lighting, storage, cozy rooms and holiday ideas, each with practical buying tips and Amazon.com picks.";

// /trends hub: one crawlable page that links every guide (it used to redirect
// to a single guide, so the guides had no index page of their own).
export default function TrendsIndexPage() {
  useEffect(() => {
    document.title = TRENDS_TITLE;
    document.querySelector('meta[name="description"]')?.setAttribute("content", TRENDS_DESCRIPTION);
    document.querySelector('link[rel="canonical"]')?.setAttribute("href", `${siteUrl}/trends`);
  }, []);

  return (
    <>
      <Header />
      <main style={{ maxWidth: 1000, margin: "0 auto", padding: "32px 20px", lineHeight: 1.6 }}>
        <h1 style={{ fontSize: "clamp(28px, 5vw, 40px)", marginBottom: 8 }}>Home decor buying guides</h1>
        <p style={{ marginBottom: 24 }}>
          Practical ideas for apartments, small spaces and cozy rooms, with Amazon.com picks for each one.
        </p>
        <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: 16 }}>
          {trendPages.map((page) => (
            <li key={page.slug} style={{ padding: 16, borderRadius: 12, background: "rgba(2,62,138,0.05)" }}>
              <Link to={`/trends/${page.slug}`} style={{ fontWeight: 700, fontSize: 18 }}>{page.title}</Link>
              <p style={{ margin: "6px 0 0" }}>{page.metaDescription}</p>
            </li>
          ))}
        </ul>
        <p style={{ marginTop: 24, fontSize: 14 }}>As an Amazon Associate we earn from qualifying purchases.</p>
      </main>
      <Footer />
    </>
  );
}
