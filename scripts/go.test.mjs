import { test } from 'node:test';
import assert from 'node:assert/strict';
import handler, { goTarget } from '../api/go.mjs';

test('pin link keeps tracking fields, asks for country routing and drops anything else', () => {
  const url = new URL(goTarget({ asin: 'b0abc12345', utm_source: 'pinterest', utm_content: 'B0ABC12345', fbclid: 'x', utm_campaign: 'bad value<' }));
  assert.equal(url.origin + url.pathname, 'https://affiliate-backend-pi.vercel.app/api/go/B0ABC12345');
  assert.deepEqual(Object.fromEntries(url.searchParams), { utm_source: 'pinterest', utm_content: 'B0ABC12345', route: 'country' });
});

test('invalid ASIN is a 404, valid one a non-cached 302', () => {
  const res = () => { const r = { headers: {}, setHeader: (k, v) => { r.headers[k] = v; }, status: (c) => { r.code = c; return r; }, end: () => r }; return r; };
  assert.equal(handler({ query: { asin: '../x' } }, res()).code, 404);
  const ok = handler({ query: { asin: 'B0ABC12345' } }, res());
  assert.equal(ok.code, 302);
  assert.equal(ok.headers['Cache-Control'], 'no-store');
  assert.match(ok.headers.Location, /route=country$/);
});
