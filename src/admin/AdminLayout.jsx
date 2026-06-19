import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard, ShoppingBag, Tag, Star,
  Mail, Settings, Users, LogOut, Menu, X, ChevronRight
} from "lucide-react";

const NAV = [
  { to: "/admin/dashboard",    label: "Dashboard",    icon: <LayoutDashboard size={19} />, badge: null },
  { to: "/admin/deals",        label: "Deals",        icon: <ShoppingBag size={19} />,     badge: "deals" },
  { to: "/admin/categories",   label: "Categories",   icon: <Tag size={19} />,             badge: null },
  { to: "/admin/featured",     label: "Featured",     icon: <Star size={19} />,            badge: null },
  { to: "/admin/subscribers",  label: "Subscribers",  icon: <Users size={19} />,           badge: "subs" },
  { to: "/admin/newsletter",   label: "Newsletter",   icon: <Mail size={19} />,            badge: null },
  { to: "/admin/settings",     label: "Settings",     icon: <Settings size={19} />,        badge: null },
];

const C = {
  bg: "#b8e4f8",
  activeBg: "#29b6f6",
  hoverBg: "rgba(0,180,216,0.2)",
  text: "#0c2d48",
  muted: "#3a7fa0",
  activeText: "#fff",
  border: "rgba(0,150,200,0.18)",
  sidebar: "#b8e4f8",
  header: "#fff",
  main: "#d0eaf8",
};

export default function AdminLayout({ children, counts = {} }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sideOpen, setSideOpen] = useState(false);

  const handleLogout = () => { logout(); navigate("/admin/login"); };

  const sidebar = (
    <div style={{ width: 240, minHeight: "100vh", background: C.sidebar, display: "flex", flexDirection: "column", borderRight: `1px solid ${C.border}`, flexShrink: 0 }}>
      {/* Logo */}
      <div style={{ padding: "20px 20px 16px", borderBottom: `1px solid ${C.border}` }}>
        <a href="/" target="_blank" style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 42, height: 42, borderRadius: 10, background: "linear-gradient(135deg,#00b4d8,#0077b6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: "1.3rem" }}>⚡</span>
          </div>
          <div>
            <div style={{ fontSize: "1.1rem", fontWeight: 900, color: "#023e8a", lineHeight: 1 }}>DealZone</div>
            <div style={{ fontSize: ".58rem", color: "#4a7fa5", fontWeight: 500, letterSpacing: ".06em" }}>Affiliate Manager</div>
          </div>
        </a>
      </div>

      {/* User */}
      <div style={{ margin: "14px 12px", background: C.activeBg, borderRadius: 12, padding: "12px 14px", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: ".85rem", color: "#fff", flexShrink: 0 }}>
          {user?.initials || "AD"}
        </div>
        <div style={{ overflow: "hidden" }}>
          <div style={{ fontWeight: 700, color: "#fff", fontSize: ".9rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user?.name || "Admin"}</div>
          <div style={{ fontSize: ".68rem", color: "rgba(255,255,255,0.75)" }}>{user?.role || "admin"}</div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "6px 10px" }}>
        <div style={{ fontSize: ".68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".12em", color: C.muted, padding: "8px 10px 6px", marginTop: 4 }}>OPERATIONS</div>
        {NAV.map((item) => {
          const badgeVal = item.badge === "deals" ? counts.deals : item.badge === "subs" ? counts.subs : null;
          return (
            <NavLink key={item.to} to={item.to} onClick={() => setSideOpen(false)}
              style={({ isActive }) => ({
                display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 10, marginBottom: 2,
                background: isActive ? C.activeBg : "transparent",
                color: isActive ? C.activeText : C.text,
                fontWeight: isActive ? 700 : 500, fontSize: ".9rem",
                textDecoration: "none", transition: "all .18s",
              })}
              onMouseEnter={e => { if (!e.currentTarget.classList.contains("active")) e.currentTarget.style.background = C.hoverBg; }}
              onMouseLeave={e => { if (!e.currentTarget.classList.contains("active")) e.currentTarget.style.background = "transparent"; }}
            >
              {({ isActive }) => (
                <>
                  <span style={{ flexShrink: 0, opacity: isActive ? 1 : 0.75 }}>{item.icon}</span>
                  <span style={{ flex: 1 }}>{item.label}</span>
                  {badgeVal > 0 && (
                    <span style={{ background: "#ef4444", color: "#fff", fontSize: ".65rem", fontWeight: 700, minWidth: 20, height: 20, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", padding: "0 5px" }}>
                      {badgeVal}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Logout */}
      <div style={{ padding: "12px 10px 20px", borderTop: `1px solid ${C.border}` }}>
        <button onClick={handleLogout}
          style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 10, width: "100%", background: "transparent", border: "none", color: "#ef4444", fontWeight: 600, fontSize: ".88rem", cursor: "pointer", transition: "background .18s" }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.1)"}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
          <LogOut size={18} /> Logout
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: C.main, fontFamily: "'Inter',sans-serif" }}>
      {/* Desktop sidebar */}
      <div className="admin-sidebar-desk">{sidebar}</div>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {sideOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSideOpen(false)}
              style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", zIndex: 1000 }} />
            <motion.div initial={{ x: -260 }} animate={{ x: 0 }} exit={{ x: -260 }} transition={{ type: "spring", damping: 28 }}
              style={{ position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 1001, width: 240 }}>
              {sidebar}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* Top bar */}
        <div style={{ height: 60, background: C.header, borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", padding: "0 20px", gap: 14, boxShadow: "0 1px 8px rgba(0,100,160,0.08)", flexShrink: 0 }}>
          <button className="admin-hamburger" onClick={() => setSideOpen(true)}
            style={{ background: "none", border: "none", color: "#0077b6", display: "none", padding: 4, cursor: "pointer" }}>
            <Menu size={24} />
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: ".82rem", color: "#4a7fa5" }}>
            <a href="/" target="_blank" style={{ color: "#00b4d8", fontWeight: 600 }}>DealZone</a>
            <ChevronRight size={13} />
            <span>Admin Panel</span>
          </div>
          <div style={{ flex: 1 }} />
          <a href="/" target="_blank" style={{ padding: "6px 16px", borderRadius: 50, background: "rgba(0,180,216,0.12)", border: "1px solid rgba(0,180,216,0.3)", color: "#0077b6", fontSize: ".82rem", fontWeight: 600 }}>
            View Site ↗
          </a>
        </div>

        {/* Page content */}
        <div style={{ flex: 1, padding: "28px 24px", overflowY: "auto" }}>
          {children}
        </div>
      </div>

      <style>{`
        @media(max-width:768px){
          .admin-sidebar-desk{display:none!important}
          .admin-hamburger{display:flex!important}
        }
      `}</style>
    </div>
  );
}
