// Builds dist/sitemap.xml after prerendering. Lists only pages worth indexing:
// the hubs, every guide, and product pages that have a listing-based guide
// (thin product pages carry noindex and stay out). lastmod only where a real
// date is known (product details' checkedAt); no invented dates.
import { readFile, readdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = fileURLToPath(new URL("../", import.meta.url));
const site = "https://www.freedealzone.biz";
const guides = JSON.parse(await readFile(path.join(root, "src/data/trendPages.json"), "utf8"));
const detailsDir = path.join(root, "dist/product-details");

const urls = [
  { loc: "/", priority: "1.0" }, { loc: "/trends", priority: "0.9" }, { loc: "/finds", priority: "0.8" },
  { loc: "/storefront", priority: "0.5" }, { loc: "/privacy", priority: "0.2" },
  ...guides.map((g) => ({ loc: `/trends/${g.slug}`, priority: "0.8" })),
];
for (const file of (await readdir(detailsDir).catch(() => [])).filter((f) => /^[A-Z0-9]{10}\.json$/.test(f)).sort()) {
  try {
    const details = JSON.parse(await readFile(path.join(detailsDir, file), "utf8"));
    const day = String(details.checkedAt || "").slice(0, 10);
    urls.push({ loc: `/deal/${file.slice(0, 10)}`, priority: "0.6", lastmod: /^\d{4}-\d{2}-\d{2}$/.test(day) ? day : "" });
  } catch { /* unreadable details: leave the page out */ }
}
const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) =>
  `  <url><loc>${site}${u.loc}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ""}<priority>${u.priority}</priority></url>`).join("\n")}\n</urlset>\n`;
await writeFile(path.join(root, "dist/sitemap.xml"), xml);
console.log(`Sitemap: ${urls.length} URLs (${guides.length} guides).`);
