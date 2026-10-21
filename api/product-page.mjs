import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { api, renderProductPage } from '../lib/product-page.mjs';

export function createHandler({ fetcher = fetch, readShell = () => readFile(path.join(process.cwd(), 'dist/index.html'), 'utf8') } = {}) {
  return async function handler(req, res) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    if (!['GET', 'HEAD'].includes(req.method)) {
      res.setHeader('Allow', 'GET, HEAD');
      return res.status(405).end();
    }
    const asin = String(req.query?.asin || '').toUpperCase();
    if (!/^[A-Z0-9]{10}$/.test(asin)) return res.status(404).end('Product not found');
    try {
      const response = await fetcher(`${api}/deals/asin/${asin}`, { signal: AbortSignal.timeout(8000) });
      if (response.status === 404) {
        res.setHeader('X-Robots-Tag', 'noindex');
        return res.status(404).end('Product not found');
      }
      if (!response.ok) throw new Error('Catalog unavailable');
      const deal = await response.json();
      if (String(deal.asin).toUpperCase() !== asin || deal.active === false) {
        res.setHeader('X-Robots-Tag', 'noindex');
        return res.status(404).end('Product not found');
      }
      const html = renderProductPage(await readShell(), deal);
      // Served from the CDN and refreshed in the background, so visitors rarely wait for a cold function.
      res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400');
      return res.status(200).end(req.method === 'HEAD' ? undefined : html);
    } catch {
      res.setHeader('Cache-Control', 'no-store');
      res.setHeader('Retry-After', '60');
      return res.status(503).end('Product details are temporarily unavailable. Please try again shortly.');
    }
  };
}

export default createHandler();
