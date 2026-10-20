import { lazy, Suspense, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./admin/PrivateRoute";

// Public pages
import Header from "./components/Header";
import Hero from "./components/Hero";
import AllDeals from "./components/AllDeals";
import Footer from "./components/Footer";
import BackToTop from "./components/BackToTop";
import { trackVisit } from "./services/visitorTracking.mjs";

const Newsletter = lazy(() => import("./components/Newsletter"));
const DealPage = lazy(() => import("./pages/DealPage"));
const PrivacyPage = lazy(() => import("./pages/PrivacyPage"));
const StorefrontPage = lazy(() => import("./pages/StorefrontPage"));
const SocialFindsPage = lazy(() => import("./pages/SocialFindsPage"));
const TrendPage = lazy(() => import("./pages/TrendPage"));
const AdminLayout = lazy(() => import("./admin/AdminLayout"));
const AdminLogin = lazy(() => import("./admin/Login"));
const Dashboard = lazy(() => import("./admin/Dashboard"));
const DealsManager = lazy(() => import("./admin/DealsManager"));
const CategoriesManager = lazy(() => import("./admin/CategoriesManager"));
const FeaturedManager = lazy(() => import("./admin/FeaturedManager"));
const Subscribers = lazy(() => import("./admin/Subscribers"));
const Settings = lazy(() => import("./admin/Settings"));
const Visitors = lazy(() => import("./admin/Visitors"));

function PageFallback() {
  return (
    <main style={{ minHeight: "70vh", display: "grid", placeItems: "center", background: "#f8fdff", color: "#0077b6", fontWeight: 850 }}>
      Loading...
    </main>
  );
}

// ── Public site ──────────────────────────────────────
// lockCategory pins the deals feed to one category and hides the category
// chips, so a route like /kitchen feels like its own dedicated site while
// reusing the exact same design/backend as the main site.
function PublicSite({ lockCategory }) {
  const [activeFilter, setActiveFilter] = useState(lockCategory || "all");
  const [heroSearch, setHeroSearch] = useState("");
  return (
    <>
      <Header />
      <main>
        <Hero onSearch={(q) => { setHeroSearch(q); }} />
        <AllDeals
          key={`${lockCategory || "all"}:${heroSearch}`}
          activeFilter={activeFilter}
          setFilter={lockCategory ? () => {} : setActiveFilter}
          externalSearch={heroSearch}
          lockCategory={lockCategory}
        />
        <Suspense fallback={null}>
          <Newsletter />
        </Suspense>
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
      <Suspense fallback={<PageFallback />}>
        <AdminLayout>{children}</AdminLayout>
      </Suspense>
    </PrivateRoute>
  );
}

// ── Anonymous page-view tracking (first-party, for the admin journeys page) ──
function PageViewTracker() {
  const location = useLocation();
  useEffect(() => { trackVisit('page_view', { path: location.pathname }); }, [location.pathname]);
  return null;
}

// ── App ──────────────────────────────────────────────
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <PageViewTracker />
        <Routes>
          {/* Public */}
          <Route path="/" element={<PublicSite />} />
          <Route path="/kitchen" element={<PublicSite lockCategory="kitchen" />} />
          <Route path="/deal/:asin" element={<Suspense fallback={<PageFallback />}><DealPage /></Suspense>} />
          <Route path="/storefront" element={<Suspense fallback={<PageFallback />}><StorefrontPage /></Suspense>} />
          <Route path="/finds" element={<Suspense fallback={<PageFallback />}><SocialFindsPage /></Suspense>} />
          <Route path="/trends" element={<Navigate to="/trends/wainscoting-and-beadboard-styles" replace />} />
          <Route path="/trends/:slug" element={<Suspense fallback={<PageFallback />}><TrendPage /></Suspense>} />
          <Route path="/privacy" element={<Suspense fallback={<PageFallback />}><PrivacyPage /></Suspense>} />

          {/* Admin auth */}
          <Route path="/admin/login" element={<Suspense fallback={<PageFallback />}><AdminLogin /></Suspense>} />
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

          {/* Admin pages */}
          <Route path="/admin/dashboard"   element={<AdminPage><Dashboard /></AdminPage>} />
          <Route path="/admin/deals"       element={<AdminPage><DealsManager /></AdminPage>} />
          <Route path="/admin/categories"  element={<AdminPage><CategoriesManager /></AdminPage>} />
          <Route path="/admin/featured"    element={<AdminPage><FeaturedManager /></AdminPage>} />
          <Route path="/admin/subscribers" element={<AdminPage><Subscribers /></AdminPage>} />
          <Route path="/admin/newsletter"  element={<AdminPage><Subscribers /></AdminPage>} />
          <Route path="/admin/settings"    element={<AdminPage><Settings /></AdminPage>} />
          <Route path="/admin/visitors"    element={<AdminPage><Visitors /></AdminPage>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
