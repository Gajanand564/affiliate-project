import { renderToString } from "react-dom/server";
import { Routes, Route, StaticRouter } from "react-router-dom";
import TrendPage from "./pages/TrendPage";

// Render the same guide visitors read. Product availability is refreshed by
// the browser; publishing guides never depends on the live catalog API.
export function renderTrend(pathname) {
  return renderToString(
    <StaticRouter location={pathname}>
      <Routes>
        <Route path="/trends/:slug" element={<TrendPage staticRender />} />
      </Routes>
    </StaticRouter>
  );
}
