const site = 'https://www.freedealzone.biz';
const api = 'https://affiliate-backend-pi.vercel.app/api';
export const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g,
  (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

// Listing-based details written by pinterest-bot/generate_product_details.py
// (public/product-details/<ASIN>.json). Only well-formed text lists are used.
export function cleanDetails(details, asin) {
  if (!details || String(details.asin || '').toUpperCase() !== String(asin || '').toUpperCase()) return null;
  const list = (value) => (Array.isArray(value) ? value.filter((x) => typeof x === 'string' && x.trim()).slice(0, 6) : []);
  const faq = Array.isArray(details.faq)
    ? details.faq.filter((q) => q && typeof q.question === 'string' && typeof q.answer === 'string').slice(0, 5) : [];
  if (typeof details.summary !== 'string' || !details.summary.trim()) return null;
  return { summary: details.summary.trim(), highlights: list(details.highlights), bestFor: list(details.bestFor),
    stylingTips: list(details.stylingTips), beforeYouBuy: list(details.beforeYouBuy), faq };
}

export const detailSections = (d) => [
  ['What the listing says', d.highlights], ['Where it fits', d.bestFor],
  ['Styling tips', d.stylingTips], ['Before you buy', d.beforeYouBuy],
].filter(([, items]) => items.length);

export function productMetadata(deal, details = null) {
  const asin = String(deal.asin || '').toUpperCase();
  if (!/^[A-Z0-9]{10}$/.test(asin) || !deal.title || deal.active === false) throw new Error('Invalid product');
  const image = new URL(deal.image || '', 'https://affiliate-backend-pi.vercel.app/');
  if (!deal.image || image.protocol !== 'https:') throw new Error('Invalid product image');
  return { asin, title: `${deal.title} | DealZone`, name: String(deal.title), image: image.href,
    description: String(details?.summary || deal.desc || `Explore ${deal.title}. Check current product details, size and delivery on Amazon.com.`)
      .replace(/#\w+/g, '').replace(/\s+/g, ' ').trim().replace(/^[|·:\-\s]+/, '').slice(0, 300),
    url: `${site}/deal/${asin}` };
}

export function renderProductPage(shell, deal, rawDetails = null) {
  const details = cleanDetails(rawDetails, deal.asin);
  const meta = productMetadata(deal, details);
  const e = escapeHtml;
  let html = shell.replace(/<title>[^<]*<\/title>/, () => `<title>${e(meta.title)}</title>`)
    .replace(/<meta name="description"[^>]*>/, () => `<meta name="description" content="${e(meta.description)}" />`)
    .replace(/<link rel="canonical"[^>]*>/, () => `<link rel="canonical" href="${e(meta.url)}" />`)
    .replace(/<meta property="og:image"[^>]*>/, '')
    .replace(/<meta property="og:image:alt"[^>]*>/, '');
  const tags = { 'og:type': 'product', 'og:title': meta.title, 'og:description': meta.description,
    'og:url': meta.url, 'og:image': meta.image, 'og:image:alt': meta.name };
  const metadata = Object.entries(tags).map(([key, value]) => `<meta property="${key}" content="${e(value)}" />`).join('\n');
  const structured = JSON.stringify({ '@context': 'https://schema.org', '@type': 'Product',
    name: meta.name, description: meta.description, image: [meta.image], sku: meta.asin, url: meta.url })
    .replace(/</g, '\\u003c');
  html = html.replace('</head>', `${metadata}\n<script id="initial-product-data" type="application/ld+json">${structured}</script>\n</head>`);
  const marker = '<div id="root">';
  const start = html.indexOf(marker);
  const end = html.lastIndexOf('</div>', html.indexOf('</body>'));
  if (start < 0 || end < start) throw new Error('Product page template changed');
  // Same content for people and crawlers. React replaces this initial view.
  const body = `<main style="max-width:1000px;margin:auto;padding:32px 20px"><a href="/">DealZone</a>
    <h1>${e(meta.name)}</h1><img src="${e(meta.image)}" alt="${e(meta.name)}" style="max-width:100%;max-height:600px;object-fit:contain" />
    <p>${e(meta.description)}</p><p>Affiliate disclosure: As an Amazon Associate, we earn from qualifying purchases.</p>
    ${details ? detailSections(details).map(([heading, items]) => `<h2>${e(heading)}</h2><ul>${items.map((item) => `<li>${e(item)}</li>`).join('')}</ul>`).join('')
      + (details.faq.length ? `<h2>Questions</h2>${details.faq.map((q) => `<h3>${e(q.question)}</h3><p>${e(q.answer)}</p>`).join('')}` : '') : ''}
    <p>Check current price, dimensions and delivery for your ZIP code before ordering.</p>
    <a href="${site}/finds">Explore more home finds</a></main>`;
  return html.slice(0, start + marker.length) + body + html.slice(end);
}

export { api };
