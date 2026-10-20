import { test } from 'node:test';
import assert from 'node:assert/strict';
import { visitorIds, randomId } from '../src/services/visitorTracking.mjs';

function memoryStorage() {
  const data = new Map();
  return { getItem: (k) => (data.has(k) ? data.get(k) : null), setItem: (k, v) => data.set(k, String(v)) };
}

test('anonymous visitor id persists; session id changes after 30 idle minutes', () => {
  const storage = memoryStorage();
  const first = visitorIds(1_000_000, storage);
  assert.match(first.visitorId, /^v[a-z0-9]{8,39}$/);
  assert.match(first.sessionId, /^s[a-z0-9]{8,39}$/);
  const soon = visitorIds(1_000_000 + 10 * 60 * 1000, storage);
  assert.deepEqual(soon, first);
  const later = visitorIds(1_000_000 + 10 * 60 * 1000 + 31 * 60 * 1000, storage);
  assert.equal(later.visitorId, first.visitorId);
  assert.notEqual(later.sessionId, first.sessionId);
});

test('blocked storage disables tracking and ids are random', () => {
  const blocked = { getItem() { throw new Error('blocked'); }, setItem() { throw new Error('blocked'); } };
  assert.equal(visitorIds(Date.now(), blocked), null);
  assert.notEqual(randomId('v'), randomId('v'));
});
