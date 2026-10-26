import { readFile, writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { createServer } from "vite";

const root = fileURLToPath(new URL("../", import.meta.url));
const dist = path.join(root, "dist");
const site = "https://www.freedealzone.biz";
const escape = (text) => String(text).replace(/[&<>"']/g, (char) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
})[char]);
const pages = JSON.parse(await readFile(path.join(root, "src/data/trendPages.json"), "utf8"));
const shell = await readFile(path.join(dist, "index.html"), "utf8");
const rootStart = '<div id="root">';
const start = shell.indexOf(rootStart);
const end = shell.lastIndexOf("</div>", shell.indexOf("</body>"));
if (start === -1 || end < start || !shell.includes('rel="canonical"')) {
  throw new Error("The HTML template changed; update prerendering before publishing.");
}

const server = await createServer({
  root, server: { middlewareMode: true }, appType: "custom",
});
try {
  const { renderTrend } = await server.ssrLoadModule("/src/entry-prerender.jsx");
  const seen = new Set();
  await mkdir(path.join(dist, "trends"), { recursive: true });
  for (const page of pages) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(page.slug) || seen.has(page.slug)) {
      throw new Error(`Invalid or duplicate guide slug: ${page.slug}`);
    }
    seen.add(page.slug);
    const pathname = `/trends/${page.slug}`;
    const body = renderTrend(pathname);
    if (!body.includes("<h1") || !body.includes("Buying guide")) {
      throw new Error(`Guide did not render: ${pathname}`);
    }
    let html = shell.slice(0, start + rootStart.length) + body + shell.slice(end);
    html = html
      .replace(/<title>[^<]*<\/title>/, () => `<title>${escape(page.seoTitle)}</title>`)
      .replace(/<meta name="description"[^>]*>/, () => `<meta name="description" content="${escape(page.metaDescription)}" />`)
      .replace(/<link rel="canonical"[^>]*>/, () => `<link rel="canonical" href="${site}${pathname}" />`)
      // Open Graph article tags in the static HTML: Pinterest (Rich Pins) and
      // other crawlers read these without running JavaScript.
      .replace("</head>", () => [
        ["og:type", "article"], ["og:title", page.seoTitle], ["og:description", page.metaDescription],
        ["og:url", `${site}${pathname}`],
      ].map(([property, value]) => `<meta property="${property}" content="${escape(value)}" />`).join("") + "</head>");
    await writeFile(path.join(dist, "trends", `${page.slug}.html`), html);
  }
  console.log(`Pre-rendered ${pages.length} guides with content, links and individual canonicals.`);
} finally {
  await server.close();
}
