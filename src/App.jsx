import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./admin/PrivateRoute";
import AdminLayout from "./admin/AdminLayout";

// Public pages
import Header from "./components/Header";
import Hero from "./components/Hero";
import ReferralSection from "./components/ReferralSection";
import FeaturedDeals from "./components/FeaturedDeals";
import Categories from "./components/Categories";
import AllDeals from "./components/AllDeals";
import Newsletter from "./components/Newsletter";
import Footer from "./components/Footer";
import BackToTop from "./components/BackToTop";

// Admin pages
import AdminLogin from "./admin/Login";
import Dashboard from "./admin/Dashboard";
import DealsManager from "./admin/DealsManager";
import CategoriesManager from "./admin/CategoriesManager";
import FeaturedManager from "./admin/FeaturedManager";
import Subscribers from "./admin/Subscribers";
import AdminNewsletter from "./admin/Subscribers"; // reuse for now
import Settings from "./admin/Settings";

// ── Public site ──────────────────────────────────────
function PublicSite() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [heroSearch, setHeroSearch] = useState("");
  return (
    <>
      <Header />
      <main>
        <Hero onSearch={(q) => { setHeroSearch(q); }} />
        <ReferralSection onCategoryRef={setActiveFilter} />
        <FeaturedDeals />
        <Categories activeFilter={activeFilter} setFilter={setActiveFilter} />
        <AllDeals activeFilter={activeFilter} setFilter={setActiveFilter} externalSearch={heroSearch} />
        <Newsletter />
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}

// ── Admin wrapper (with sidebar) ─────────────────────
function AdminPage({ children }) {
  return (
    <PrivateRoute>
      <AdminLayout>{children}</AdminLayout>
    </PrivateRoute>
  );
}

// ── App ──────────────────────────────────────────────
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<PublicSite />} />

          {/* Admin auth */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

          {/* Admin pages */}
          <Route path="/admin/dashboard"   element={<AdminPage><Dashboard /></AdminPage>} />
          <Route path="/admin/deals"       element={<AdminPage><DealsManager /></AdminPage>} />
          <Route path="/admin/categories"  element={<AdminPage><CategoriesManager /></AdminPage>} />
          <Route path="/admin/featured"    element={<AdminPage><FeaturedManager /></AdminPage>} />
          <Route path="/admin/subscribers" element={<AdminPage><Subscribers /></AdminPage>} />
          <Route path="/admin/newsletter"  element={<AdminPage><Subscribers /></AdminPage>} />
          <Route path="/admin/settings"    element={<AdminPage><Settings /></AdminPage>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
