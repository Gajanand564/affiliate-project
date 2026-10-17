import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { renderProductPage } from '../lib/product-page.mjs';
import { createHandler } from '../api/product-page.mjs';

const shell = await readFile(new URL('../index.html', import.meta.url), 'utf8');
const deal = { asin: 'B009R2SWY8', title: 'Laundry cart </script><script>alert(1)</script>',
  image: 'https://m.media-amazon.com/images/I/cart.jpg', desc: 'Measure your floor space & doorway.', active: true };
function response() {
  return { headers: {}, setHeader(key, value) { this.headers[key] = value; },
    status(value) { this.code = value; return this; }, end(value) { this.body = value; return this; } };
}

test('initial HTML has exact product metadata, content, canonical and escaped structured data', () => {
  const html = renderProductPage(shell, deal);
  assert.match(html, /property="og:image" content="https:\/\/m.media-amazon.com\/images\/I\/cart.jpg"/);
  assert.match(html, /rel="canonical" href="https:\/\/www.freedealzone.biz\/deal\/B009R2SWY8"/);
  assert.match(html, /<h1>Laundry cart &lt;\/script&gt;/);
  assert.doesNotMatch(html, /<script>alert\(1\)<\/script>/);
  const json = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs)]
    .map((match) => JSON.parse(match[1])).find((item) => item['@type'] === 'Product');
  assert.equal(json.sku, deal.asin);
  assert.equal(json.name, deal.title);
  assert.equal(json.offers, undefined);
  assert.equal(json.aggregateRating, undefined);
  assert.match(html, /type="module" src="\/src\/main.jsx"/);
});

test('handler fetches exact ASIN and ignores tracking parameters in canonical', async () => {
  const handler = createHandler({ readShell: async () => shell, fetcher: async (url) => {
    assert.equal(url, 'https://affiliate-backend-pi.vercel.app/api/deals/asin/B009R2SWY8');
    return { ok: true, status: 200, json: async () => deal };
  } });
  const res = response();
  await handler({ method: 'GET', query: { asin: deal.asin, utm_source: 'pinterest' } }, res);
  assert.equal(res.code, 200);
  assert.match(res.body, /B009R2SWY8/);
});

test('missing, wrong-product and invalid requests do not become generic 200 pages', async () => {
  for (const outcome of [{ ok: false, status: 404 }, { ok: true, status: 200, json: async () => ({ ...deal, asin: 'B012345678' }) }]) {
    const res = response();
    await createHandler({ fetcher: async () => outcome })({ method: 'GET', query: { asin: deal.asin } }, res);
    assert.equal(res.code, 404);
    assert.equal(res.headers['X-Robots-Tag'], 'noindex');
  }
  const res = response();
  await createHandler({ fetcher: () => { throw new Error('Should not fetch'); } })({ method: 'GET', query: { asin: '../../secret' } }, res);
  assert.equal(res.code, 404);
});

test('unavailable catalog is retriable and not cached as a product', async () => {
  const res = response();
  await createHandler({ fetcher: async () => { throw new Error('offline'); } })({ method: 'GET', query: { asin: deal.asin } }, res);
  assert.equal(res.code, 503);
  assert.equal(res.headers['Cache-Control'], 'no-store');
});
