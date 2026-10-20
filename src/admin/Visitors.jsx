import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Activity, ChevronDown, ChevronRight, Eye, Globe, Monitor, MousePointerClick, RefreshCw, Smartphone, Tablet, Users } from "lucide-react";
import { getVisitorJourneys } from "../services/api";

const C = { navy: "#023e8a", muted: "#4a7fa5", soft: "#93b4c8", accent: "#00b4d8", deep: "#0077b6", line: "#e0f2fe", green: "#10b981", amber: "#f59e0b" };
const card = { background: "#fff", borderRadius: 16, padding: 22, boxShadow: "0 4px 20px rgba(0,100,160,0.09)", border: "1px solid rgba(0,180,216,0.12)" };
const SOURCE_COLORS = { pinterest: "#e60023", instagram: "#c13584", facebook: "#1877f2", google: "#34a853", direct: "#64748b" };
const PERIODS = [[1, "Today"], [7, "7 days"], [30, "30 days"], [90, "90 days"]];

const sourceColor = (source = "") => SOURCE_COLORS[source] || (source.startsWith("ref:") ? "#8b5cf6" : C.deep);
const pct = (part, whole) => (whole ? `${Math.round((part / whole) * 100)}%` : "—");
const time = (stamp) => new Date(stamp).toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
const DeviceIcon = ({ device }) => device === "mobile" ? <Smartphone size={15} /> : device === "tablet" ? <Tablet size={15} /> : <Monitor size={15} />;

function Kpi({ icon, label, value, sub, color }) {
  return (
    <div style={{ ...card, display: "flex", gap: 14, alignItems: "center", padding: "18px 20px" }}>
      <div style={{ width: 44, height: 44, borderRadius: 12, background: `${color}18`, color, display: "grid", placeItems: "center", flexShrink: 0 }}>{icon}</div>
      <div>
        <div style={{ fontSize: "1.6rem", fontWeight: 900, color: C.navy, lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: ".8rem", fontWeight: 700, color: C.muted, marginTop: 4 }}>{label}</div>
        {sub && <div style={{ fontSize: ".72rem", color: C.soft, marginTop: 2 }}>{sub}</div>}
      </div>
    </div>
  );
}

function Bar({ value, max, color }) {
  return (
    <div style={{ background: C.line, borderRadius: 99, height: 8, overflow: "hidden", minWidth: 60 }}>
      <motion.div initial={{ width: 0 }} animate={{ width: `${max ? (value / max) * 100 : 0}%` }} transition={{ duration: 0.6 }}
        style={{ background: color, height: "100%", borderRadius: 99 }} />
    </div>
  );
}

function SourceBadge({ source }) {
  const color = sourceColor(source);
  return <span style={{ background: `${color}15`, color, fontWeight: 800, fontSize: ".72rem", padding: "3px 9px", borderRadius: 99, whiteSpace: "nowrap" }}>{source}</span>;
}

function Journey({ session, titles }) {
  const [open, setOpen] = useState(false);
  const clicked = session.amazonClicks.length > 0;
  return (
    <div style={{ borderTop: `1px solid ${C.line}` }}>
      <button onClick={() => setOpen(!open)} className="vz-row"
        style={{ width: "100%", background: "none", border: 0, padding: "12px 4px", cursor: "pointer", textAlign: "left", color: C.navy, fontSize: ".84rem" }}>
        <span style={{ color: C.soft }}>{open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}</span>
        <span style={{ color: C.muted }}>{time(session.start)}</span>
        <span style={{ fontWeight: 800 }}>Visitor #{session.visitorId.slice(1, 6)}</span>
        <SourceBadge source={session.source} />
        <span style={{ color: C.muted, display: "flex", gap: 6, alignItems: "center" }}><DeviceIcon device={session.device} />{session.country || "—"}</span>
        <span style={{ color: C.muted }}>{session.pageViews} pages · {session.productsViewed.length} products</span>
        <span style={{ fontWeight: 800, color: clicked ? C.green : C.soft }}>{clicked ? `${session.amazonClicks.length} Amazon click${session.amazonClicks.length > 1 ? "s" : ""}` : "no click"}</span>
      </button>
      {open && (
        <ol style={{ margin: "0 0 14px 34px", padding: 0, listStyle: "none", borderLeft: `2px solid ${C.line}` }}>
          {session.campaign && <li style={{ padding: "4px 12px", color: C.soft, fontSize: ".76rem" }}>Campaign: {session.campaign}{session.medium ? ` · ${session.medium}` : ""}</li>}
          {session.timeline.map((step, i) => (
            <li key={i} style={{ padding: "5px 12px", fontSize: ".8rem", color: step.type === "amazon_click" ? C.green : C.navy }}>
              <span style={{ color: C.soft, marginRight: 8 }}>{new Date(step.at).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit", second: "2-digit" })}</span>
              {step.type === "page_view" && <>Opened <code>{step.path}</code></>}
              {step.type === "product_view" && <>Viewed product <b>{titles.get(step.asin) || step.asin}</b></>}
              {step.type === "amazon_click" && <>Clicked to Amazon: <b>{titles.get(step.asin) || step.asin}</b></>}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

export default function Visitors() {
  const [days, setDays] = useState(7);
  const [source, setSource] = useState("all");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [tick, setTick] = useState(0);
  const load = useCallback(() => setTick((n) => n + 1), []);

  useEffect(() => {
    let cancelled = false;
    getVisitorJourneys(days)
      .then((d) => { if (!cancelled) { setData(d); setError(""); } })
      .catch(() => { if (!cancelled) setError("Could not load visitor data. Is the backend deployed with /api/analytics/visitors?"); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [days, tick]);

  useEffect(() => {
    const timer = setInterval(load, 60000);  // live-ish: refresh every minute
    return () => clearInterval(timer);
  }, [load]);

  const titles = useMemo(() => new Map((data?.topProducts || []).map((p) => [p.asin, p.title])), [data]);
  const sessions = useMemo(() => (data?.sessions || []).filter((s) => source === "all" || s.source === source), [data, source]);

  if (!data && loading) return <p style={{ color: C.muted }}>Loading visitor journeys…</p>;
  if (!data) return <p style={{ color: C.muted }}>{error}</p>;

  const t = data.totals;
  const maxSource = Math.max(1, ...data.bySource.map((r) => r.sessions + r.amazonClicks));
  const maxDay = Math.max(1, ...data.byDay.map((d) => Math.max(d.sessions, d.amazonClicks)));
  const maxProduct = Math.max(1, ...data.topProducts.map((p) => p.views + p.amazonClicks));

  return (
    <div>
      <style>{`
        .vz-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(190px,1fr)); gap:14px; margin-bottom:20px }
        .vz-two { display:grid; grid-template-columns:1.2fr 1fr; gap:18px; margin-bottom:20px }
        .vz-row { display:grid; grid-template-columns:20px 110px 120px auto 90px 1fr auto; gap:10px; align-items:center }
        @media (max-width: 900px) { .vz-two { grid-template-columns:1fr } .vz-row { grid-template-columns:20px 1fr auto; row-gap:4px } }
      `}</style>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 12, alignItems: "flex-end", marginBottom: 22 }}>
        <div>
          <h1 style={{ fontSize: "1.6rem", fontWeight: 900, color: C.navy, marginBottom: 4 }}>Visitors & journeys</h1>
          <p style={{ color: C.muted, fontSize: ".86rem" }}>Who came from where, what they viewed and which products they clicked to Amazon. Anonymous IDs only; bots excluded. Refreshes every minute.</p>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {PERIODS.map(([value, label]) => (
            <button key={value} onClick={() => setDays(value)}
              style={{ padding: "8px 14px", borderRadius: 10, border: `1px solid ${days === value ? C.deep : C.line}`, background: days === value ? C.deep : "#fff", color: days === value ? "#fff" : C.navy, fontWeight: 800, cursor: "pointer" }}>{label}</button>
          ))}
          <button onClick={load} title="Refresh" style={{ padding: "8px 12px", borderRadius: 10, border: `1px solid ${C.line}`, background: "#fff", color: C.deep, cursor: "pointer" }}><RefreshCw size={16} /></button>
        </div>
      </div>

      <div className="vz-grid">
        <Kpi icon={<Users size={22} />} label="Visitors" value={t.visitors} sub={`${t.sessions} visits`} color={C.accent} />
        <Kpi icon={<Activity size={22} />} label="Page views" value={t.pageViews} sub={`${(t.pageViews / Math.max(1, t.sessions)).toFixed(1)} per visit`} color="#8b5cf6" />
        <Kpi icon={<Eye size={22} />} label="Product views" value={t.productViews} sub={`${pct(t.sessionsWithProductView, t.sessions)} of visits`} color={C.amber} />
        <Kpi icon={<MousePointerClick size={22} />} label="Amazon clicks" value={t.amazonClicks} sub={`${pct(t.sessionsWithAmazonClick, t.sessions)} of visits clicked`} color={C.green} />
      </div>

      <section style={{ ...card, marginBottom: 20 }}>
        <h2 style={{ color: C.navy, fontSize: "1.05rem", marginBottom: 14 }}>Funnel</h2>
        {[["Visits", t.sessions, C.accent], ["Viewed a product", t.sessionsWithProductView, C.amber], ["Clicked to Amazon", t.sessionsWithAmazonClick, C.green]].map(([label, value, color]) => (
          <div key={label} style={{ display: "grid", gridTemplateColumns: "150px 1fr 70px", gap: 12, alignItems: "center", marginBottom: 10, fontSize: ".85rem", color: C.navy }}>
            <span style={{ fontWeight: 700 }}>{label}</span><Bar value={value} max={t.sessions} color={color} />
            <span style={{ textAlign: "right", fontWeight: 800 }}>{value} <span style={{ color: C.soft, fontWeight: 600 }}>{pct(value, t.sessions)}</span></span>
          </div>
        ))}
        <p style={{ color: C.soft, fontSize: ".74rem", marginTop: 6 }}>Amazon clicks are click events, not purchases — sales appear only in Amazon Associates.</p>
      </section>

      <div className="vz-two">
        <section style={card}>
          <h2 style={{ color: C.navy, fontSize: "1.05rem", marginBottom: 14 }}>By platform / source</h2>
          {data.bySource.length ? data.bySource.map((r) => (
            <button key={r.source} onClick={() => setSource(source === r.source ? "all" : r.source)}
              style={{ width: "100%", display: "grid", gridTemplateColumns: "120px 1fr 150px", gap: 10, alignItems: "center", padding: "7px 0", background: source === r.source ? "#f0f9ff" : "none", border: 0, cursor: "pointer", fontSize: ".82rem", color: C.navy }}>
              <SourceBadge source={r.source} /><Bar value={r.sessions + r.amazonClicks} max={maxSource} color={sourceColor(r.source)} />
              <span style={{ textAlign: "right" }}>{r.visitors} visitors · {r.productViews} views · <b style={{ color: C.green }}>{r.amazonClicks} clicks</b></span>
            </button>
          )) : <p style={{ color: C.muted }}>No visits yet in this period.</p>}
          {source !== "all" && <p style={{ color: C.deep, fontSize: ".76rem", marginTop: 8 }}>Journeys filtered to <b>{source}</b> — click again to clear.</p>}
        </section>

        <section style={card}>
          <h2 style={{ color: C.navy, fontSize: "1.05rem", marginBottom: 14 }}>Daily visits and Amazon clicks</h2>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 150, overflowX: "auto" }}>
            {data.byDay.map((d) => (
              <div key={d.date} title={`${d.date}: ${d.sessions} visits, ${d.amazonClicks} Amazon clicks`} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, minWidth: 28 }}>
                <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: 120 }}>
                  <div style={{ width: 10, height: `${(d.sessions / maxDay) * 100}%`, background: C.accent, borderRadius: 3 }} />
                  <div style={{ width: 10, height: `${(d.amazonClicks / maxDay) * 100}%`, background: C.green, borderRadius: 3 }} />
                </div>
                <span style={{ fontSize: ".65rem", color: C.soft }}>{d.date.slice(5)}</span>
              </div>
            ))}
            {!data.byDay.length && <p style={{ color: C.muted }}>No data yet.</p>}
          </div>
          <p style={{ fontSize: ".72rem", color: C.soft, marginTop: 6 }}><span style={{ color: C.accent }}>■</span> visits <span style={{ color: C.green, marginLeft: 10 }}>■</span> Amazon clicks</p>
        </section>
      </div>

      <div className="vz-two">
        <section style={{ ...card, overflowX: "auto" }}>
          <h2 style={{ color: C.navy, fontSize: "1.05rem", marginBottom: 14 }}>Products: views → Amazon clicks</h2>
          {data.topProducts.length ? <table style={{ width: "100%", borderCollapse: "collapse", fontSize: ".8rem", color: C.navy }}>
            <thead><tr style={{ textAlign: "left", color: C.muted }}><th style={{ padding: 6 }}>Product</th><th>Views</th><th>Clicks</th><th>Click rate</th><th style={{ width: 90 }} /></tr></thead>
            <tbody>{data.topProducts.map((p) => (
              <tr key={p.asin} style={{ borderTop: `1px solid ${C.line}` }}>
                <td style={{ padding: 6 }}><a href={`/deal/${p.asin}`} target="_blank" rel="noreferrer" style={{ color: C.navy, fontWeight: 700 }}>{(p.title || p.asin).slice(0, 48)}</a></td>
                <td>{p.views}</td><td style={{ color: C.green, fontWeight: 800 }}>{p.amazonClicks}</td><td>{pct(p.amazonClicks, p.views)}</td>
                <td><Bar value={p.views + p.amazonClicks} max={maxProduct} color={C.amber} /></td>
              </tr>
            ))}</tbody>
          </table> : <p style={{ color: C.muted }}>No product views yet.</p>}
        </section>

        <section style={card}>
          <h2 style={{ color: C.navy, fontSize: "1.05rem", marginBottom: 14 }}><Globe size={16} style={{ verticalAlign: -2 }} /> Countries & devices</h2>
          {[["Country", data.countries], ["Device", data.devices]].map(([label, rows]) => (
            <div key={label} style={{ marginBottom: 14 }}>
              <div style={{ fontSize: ".74rem", color: C.soft, fontWeight: 700, marginBottom: 6 }}>{label}</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {rows.map((r) => <span key={r.name} style={{ background: "#f0f9ff", color: C.navy, borderRadius: 99, padding: "4px 10px", fontSize: ".78rem", fontWeight: 700 }}>
                  {r.name === "unknown" ? "Unknown" : r.name} · {r.sessions}</span>)}
                {!rows.length && <span style={{ color: C.muted, fontSize: ".8rem" }}>—</span>}
              </div>
            </div>
          ))}
          <p style={{ fontSize: ".72rem", color: C.soft }}>Target market is the US: Amazon.com products need US buyers.</p>
        </section>
      </div>

      <section style={card}>
        <h2 style={{ color: C.navy, fontSize: "1.05rem", marginBottom: 6 }}>Visitor journeys ({sessions.length})</h2>
        <p style={{ color: C.soft, fontSize: ".76rem", marginBottom: 8 }}>Newest first. Click a visit to see each step with times.</p>
        {sessions.length ? sessions.map((s) => <Journey key={s.sessionId} session={s} titles={titles} />)
          : <p style={{ color: C.muted }}>No visits yet. New visits appear here as soon as people open the site.</p>}
      </section>
    </div>
  );
}
