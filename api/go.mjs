// Short pin link: freedealzone.biz/go/ASIN sends the visitor's browser to the
// API's tracked redirect, which picks Amazon.in for India and Amazon.com for
// everyone else (the browser's own request carries its country there).
const backend = 'https://affiliate-backend-pi.vercel.app/api/go/';
const KEEP = ['src', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content'];

export function goTarget(query = {}) {
  const asin = String(query.asin || '').toUpperCase();
  if (!/^[A-Z0-9]{10}$/.test(asin)) return '';
  const url = new URL(backend + asin);
  for (const key of KEEP) {
    const value = String(query[key] || '');
    if (/^[a-zA-Z0-9_.:-]{1,120}$/.test(value)) url.searchParams.set(key, value);
  }
  url.searchParams.set('route', 'country');
  return url.toString();
}

export default function handler(req, res) {
  const target = goTarget(req.query);
  res.setHeader('Cache-Control', 'no-store');
  if (!target) return res.status(404).end('Product not found');
  res.setHeader('Location', target);
  return res.status(302).end();
}
