const site = 'https://www.freedealzone.biz';
const api = 'https://affiliate-backend-pi.vercel.app/api';
export const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g,
  (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

export function productMetadata(deal) {
  const asin = String(deal.asin || '').toUpperCase();
  if (!/^[A-Z0-9]{10}$/.test(asin) || !deal.title || deal.active === false) throw new Error('Invalid product');
  const image = new URL(deal.image || '', 'https://affiliate-backend-pi.vercel.app/');
  if (!deal.image || image.protocol !== 'https:') throw new Error('Invalid product image');
  return { asin, title: `${deal.title} | DealZone`, name: String(deal.title), image: image.href,
    description: String(deal.desc || `Explore ${deal.title}. Check current product details, size and delivery on Amazon.com.`)
      .replace(/#\w+/g, '').replace(/\s+/g, ' ').trim().replace(/^[|·:\-\s]+/, '').slice(0, 300),
    url: `${site}/deal/${asin}` };
}

export function renderProductPage(shell, deal) {
  const meta = productMetadata(deal);
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
    <p>Check current price, dimensions and delivery for your ZIP code before ordering.</p>
    <a href="${site}/finds">Explore more home finds</a></main>`;
  return html.slice(0, start + marker.length) + body + html.slice(end);
}

export { api };
