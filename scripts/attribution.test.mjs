import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { getAttribution, attributedHref } from '../src/services/attribution.mjs';

beforeEach(() => {
  const storage = new Map();
  globalThis.window = {
    location: { origin: 'https://www.freedealzone.biz', search: '?utm_source=instagram&utm_medium=organic_social&utm_campaign=profile' },
    sessionStorage: { getItem: (key) => storage.get(key), setItem: (key, value) => storage.set(key, value) },
  };
});

test('retains campaign from a bio landing through an untagged product link', () => {
  getAttribution();
  window.location.search = '';
  assert.equal(attributedHref('/deal/B0B9QKF7L7'), '/deal/B0B9QKF7L7?utm_source=instagram&utm_medium=organic_social&utm_campaign=profile');
});

test('new explicit source replaces earlier campaign and does not inherit old content', () => {
  getAttribution();
  window.location.search = '?utm_source=facebook&utm_content=post2';
  assert.deepEqual(getAttribution(), { utm_source: 'facebook', utm_content: 'post2' });
});

test('does not tag external URLs, copy click IDs, or overwrite explicit product attribution', () => {
  window.location.search += '&fbclid=private-click-id&email=someone@example.com';
  const link = attributedHref('/deal/B0B9QKF7L7?utm_content=specific_post');
  assert.ok(link.includes('utm_content=specific_post'));
  assert.ok(!link.includes('fbclid'));
  assert.ok(!link.includes('email'));
  assert.equal(attributedHref('https://example.com/'), 'https://example.com/');
  assert.equal(attributedHref('//example.com/'), '//example.com/');
});

test('storage denied still retains current landing attribution', () => {
  window.sessionStorage.getItem = () => { throw new Error('Denied'); };
  assert.equal(getAttribution().utm_source, 'instagram');
});
