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

  // Homepage and /finds: crawlers used to get an empty loading skeleton (about
  // 10 words, no H1) and /finds carried the homepage canonical. Give both the
  // same visible starter content people see before React takes over.
  const guideList = pages.map((page) => `<li><a href="/trends/${page.slug}">${escape(page.title)}</a> — ${escape(page.metaDescription)}</li>`).join("");
  const disclosure = "<p>Amazon.com picks for US shoppers. Prices, availability and delivery depend on your address. As an Amazon Associate we earn from qualifying purchases.</p>";
  const staticPage = ({ pathname, title, description, body }) => {
    const html = shell.slice(0, start + rootStart.length)
      + `<main style="max-width:1000px;margin:auto;padding:32px 20px;font-family:system-ui,sans-serif;color:#023e8a;line-height:1.6">${body}</main>`
      + shell.slice(end);
    return html
      .replace(/<title>[^<]*<\/title>/, () => `<title>${escape(title)}</title>`)
      .replace(/<meta name="description"[^>]*>/, () => `<meta name="description" content="${escape(description)}" />`)
      .replace(/<link rel="canonical"[^>]*>/, () => `<link rel="canonical" href="${site}${pathname}" />`);
  };
  const homeTitle = (shell.match(/<title>([^<]*)<\/title>/) || [])[1] || "DealZone - Affordable Home Decor Finds and Amazon Picks";
  const homeDescription = (shell.match(/<meta name="description" content="([^"]*)"/) || [])[1] || "";
  await writeFile(path.join(dist, "index.html"), staticPage({
    pathname: "/", title: homeTitle, description: homeDescription,
    body: `<h1>Affordable home decor finds and Amazon buying guides</h1>
      <p>DealZone shares practical home decor ideas for small spaces, apartments and cozy rooms, with hand-picked Amazon.com products for each idea.</p>
      <p><a href="/finds">Shop the finds from our Instagram and Facebook posts</a></p>
      <h2>Home decor buying guides</h2><ul>${guideList}</ul>${disclosure}`,
  }));
  await writeFile(path.join(dist, "finds.html"), staticPage({
    pathname: "/finds", title: "Shop our Instagram & Facebook finds | DealZone",
    description: "Find the home decor products from DealZone's Instagram and Facebook posts, with a styling idea for each one and a one-tap link to Amazon.com.",
    body: `<p>SEEN ON @HOMEDEALZONE</p><h1>Find the piece you saved.</h1>
      <p>Shop the home decor finds from our Instagram and Facebook posts, with a styling idea for each one.</p>${disclosure}
      <h2>More home decor ideas</h2><ul>${guideList}</ul>`,
  }));
  console.log("Pre-rendered the homepage and /finds with starter content and their own canonicals.");
} finally {
  await server.close();
}
