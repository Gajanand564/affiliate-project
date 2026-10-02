// Trend-page content lives in trendPages.json (not here) so the Google
// Trends automation (pinterest-bot/generate_trend_pages.py) can safely add
// new pages by editing JSON instead of parsing/rewriting JS source.
import trendPagesData from "./trendPages.json";

export const trendPages = trendPagesData;
export const trendPageBySlug = Object.fromEntries(trendPages.map((page) => [page.slug, page]));
