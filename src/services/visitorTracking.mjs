// Anonymous first-party visit tracking for the admin journeys dashboard.
// A random visitor ID (localStorage) and session ID (30 minutes of inactivity)
// join page views, product views and Amazon clicks. No names, emails or IPs.
// Respects Do Not Track and never tracks admin pages.
import { getAttribution } from './attribution.mjs';

const VISITOR_KEY = 'dz_vid';
const SESSION_KEY = 'dz_sid';
const SESSION_IDLE = 30 * 60 * 1000;
const API_BASE = import.meta.env?.VITE_API_BASE || 'http://localhost:3001/api';

export function randomId(prefix) {
  const bytes = new Uint8Array(10);
  (globalThis.crypto || window.crypto).getRandomValues(bytes);
  return prefix + Array.from(bytes, (b) => b.toString(36).padStart(2, '0')).join('').slice(0, 16);
}

export function trackingAllowed(path = '') {
  if (typeof window === 'undefined' || path.startsWith('/admin')) return false;
  return !(navigator.doNotTrack === '1' || window.doNotTrack === '1');
}

export function visitorIds(now = Date.now(), storage = typeof window !== 'undefined' ? window.localStorage : null) {
  try {
    let visitorId = storage.getItem(VISITOR_KEY);
    if (!/^[a-z0-9]{8,40}$/.test(visitorId || '')) {
      visitorId = randomId('v');
      storage.setItem(VISITOR_KEY, visitorId);
    }
    const stored = JSON.parse(storage.getItem(SESSION_KEY) || 'null');
    const sessionId = stored && now - stored.at < SESSION_IDLE && /^[a-z0-9]{8,40}$/.test(stored.id) ? stored.id : randomId('s');
    storage.setItem(SESSION_KEY, JSON.stringify({ id: sessionId, at: now }));
    return { visitorId, sessionId };
  } catch {
    return null;  // Storage blocked: do not track.
  }
}

let lastEvent = { key: '', at: 0 };

export function trackVisit(type, { path = window.location.pathname, asin = '' } = {}) {
  if (!trackingAllowed(path)) return;
  // Ignore an identical event within 2 s (React re-runs effects in development).
  const key = `${type}|${path}|${asin}`;
  if (key === lastEvent.key && Date.now() - lastEvent.at < 2000) return;
  lastEvent = { key, at: Date.now() };
  const ids = visitorIds();
  if (!ids) return;
  const campaign = getAttribution();
  const body = JSON.stringify({
    type, ...ids, path, asin,
    source: campaign.utm_source || '', medium: campaign.utm_medium || '',
    campaign: campaign.utm_campaign || '', content: campaign.utm_content || '',
    referrer: document.referrer && !document.referrer.startsWith(window.location.origin) ? document.referrer : '',
  });
  fetch(`${API_BASE}/events`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body, keepalive: true })
    .catch(() => {});
}

// Query params that join an Amazon click to the current visit journey.
export function journeyParams() {
  if (!trackingAllowed(typeof window !== 'undefined' ? window.location.pathname : '')) return {};
  const ids = visitorIds();
  return ids ? { vid: ids.visitorId, sid: ids.sessionId } : {};
}
