import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getStats } from "../services/api";
import { ShoppingBag, Star, Tag, Users, TrendingUp, Activity } from "lucide-react";

function StatCard({ icon, label, value, sub, color, delay = 0 }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay }}
      whileHover={{ y: -4 }}
      style={{ background: "#fff", borderRadius: 16, padding: "22px 24px", boxShadow: "0 4px 20px rgba(0,100,160,0.09)", border: "1px solid rgba(0,180,216,0.12)", display: "flex", alignItems: "center", gap: 18 }}>
      <div style={{ width: 52, height: 52, borderRadius: 14, background: `${color}18`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <span style={{ color }}>{icon}</span>
      </div>
      <div>
        <div style={{ fontSize: "1.8rem", fontWeight: 900, color: "#023e8a", lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: ".82rem", fontWeight: 600, color: "#4a7fa5", marginTop: 4 }}>{label}</div>
        {sub && <div style={{ fontSize: ".72rem", color: "#93b4c8", marginTop: 2 }}>{sub}</div>}
      </div>
    </motion.div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStats().then(setStats).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <Skeleton />;
  if (!stats) return <p style={{ color: "#4a7fa5" }}>Could not load stats. Is the backend running?</p>;

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: "1.6rem", fontWeight: 900, color: "#023e8a", marginBottom: 4 }}>Dashboard</h1>
        <p style={{ color: "#4a7fa5", fontSize: ".9rem" }}>Welcome back! Here's what's happening with your affiliate site.</p>
      </div>

      {/* Stats grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 16, marginBottom: 32 }}>
        <StatCard icon={<ShoppingBag size={24} />} label="Total Deals"       value={stats.totalDeals}       sub={`${stats.activeDeals} active`}        color="#00b4d8" delay={0} />
        <StatCard icon={<Star size={24} />}        label="Featured Deals"    value={stats.featuredDeals}    sub="pinned to homepage"                   color="#f59e0b" delay={0.05} />
        <StatCard icon={<Tag size={24} />}         label="Categories"        value={stats.totalCategories}  sub="product categories"                   color="#8b5cf6" delay={0.10} />
        <StatCard icon={<Users size={24} />}       label="Subscribers"       value={stats.totalSubscribers} sub={`+${stats.newSubscribers} this week`} color="#10b981" delay={0.15} />
      </div>

      {/* Category breakdown */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }} className="dash-grid">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          style={{ background: "#fff", borderRadius: 16, padding: "22px 24px", boxShadow: "0 4px 20px rgba(0,100,160,0.09)", border: "1px solid rgba(0,180,216,0.12)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
            <TrendingUp size={18} color="#00b4d8" />
            <h3 style={{ fontWeight: 800, color: "#023e8a", fontSize: "1rem" }}>Deals by Category</h3>
          </div>
          {stats.dealsByCategory.map((c, i) => (
            <div key={i} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                <span style={{ fontSize: ".85rem", color: "#4a7fa5", fontWeight: 500 }}>{c.icon} {c.name}</span>
                <span style={{ fontSize: ".85rem", fontWeight: 700, color: "#023e8a" }}>{c.count}</span>
              </div>
              <div style={{ height: 6, background: "#e0f2fe", borderRadius: 3, overflow: "hidden" }}>
                <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min((c.count / Math.max(stats.totalDeals,1)) * 100, 100)}%` }}
                  transition={{ duration: 0.7, delay: i * 0.05 }}
                  style={{ height: "100%", background: "linear-gradient(90deg,#00b4d8,#0077b6)", borderRadius: 3 }} />
              </div>
            </div>
          ))}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          style={{ background: "#fff", borderRadius: 16, padding: "22px 24px", boxShadow: "0 4px 20px rgba(0,100,160,0.09)", border: "1px solid rgba(0,180,216,0.12)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
            <Activity size={18} color="#00b4d8" />
            <h3 style={{ fontWeight: 800, color: "#023e8a", fontSize: "1rem" }}>Quick Actions</h3>
          </div>
          {[
            { label: "Add New Deal",     href: "/admin/deals",       icon: "➕", color: "#00b4d8" },
            { label: "Add Category",     href: "/admin/categories",  icon: "🏷️", color: "#8b5cf6" },
            { label: "View Subscribers", href: "/admin/subscribers", icon: "👥", color: "#10b981" },
            { label: "Manage Featured",  href: "/admin/featured",    icon: "⭐", color: "#f59e0b" },
          ].map((action, i) => (
            <a key={i} href={action.href}
              style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 10, background: "#f0f9ff", border: "1px solid rgba(0,180,216,0.15)", marginBottom: 8, color: "#023e8a", fontWeight: 600, fontSize: ".88rem", transition: "all .18s" }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(0,180,216,0.1)"; e.currentTarget.style.borderColor = "#00b4d8"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#f0f9ff"; e.currentTarget.style.borderColor = "rgba(0,180,216,0.15)"; }}>
              <span>{action.icon}</span>
              {action.label}
              <span style={{ marginLeft: "auto", color: "#93b4c8" }}>→</span>
            </a>
          ))}
        </motion.div>
      </div>
      <style>{`@media(max-width:640px){.dash-grid{grid-template-columns:1fr!important}}`}</style>
    </div>
  );
}

function Skeleton() {
  return (
    <div>
      <div style={{ height: 28, width: 160, background: "#cde8f5", borderRadius: 8, marginBottom: 8 }} />
      <div style={{ height: 16, width: 280, background: "#e0f2fe", borderRadius: 6, marginBottom: 28 }} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 16 }}>
        {[1,2,3,4].map((i) => <div key={i} style={{ height: 90, background: "#fff", borderRadius: 16, boxShadow: "0 4px 20px rgba(0,100,160,0.06)", animation: "pulse 1.5s ease infinite" }} />)}
      </div>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.6}}`}</style>
    </div>
  );
}
