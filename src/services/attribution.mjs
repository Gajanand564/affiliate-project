const KEY = 'dealzone:campaign';
const FIELDS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
const MAX_AGE = 30 * 60 * 1000;

export function campaignFrom(search) {
  const params = new URLSearchParams(search);
  return Object.fromEntries(FIELDS.flatMap((key) => {
    const value = params.get(key);
    return value && /^[a-zA-Z0-9_.: -]{1,120}$/.test(value) ? [[key, value]] : [];
  }));
}

export function getAttribution() {
  if (typeof window === 'undefined') return {};
  const current = campaignFrom(window.location.search);
  try {
    const stored = JSON.parse(window.sessionStorage.getItem(KEY) || 'null');
    // A new explicit source replaces the previous campaign rather than mixing them.
    const campaign = current.utm_source ? current
      : stored && Date.now() - stored.at < MAX_AGE ? stored.campaign : {};
    if (Object.keys(campaign).length) {
      window.sessionStorage.setItem(KEY, JSON.stringify({ campaign, at: Date.now() }));
    }
    return campaign;
  } catch {
    return current;
  }
}

export function attributedHref(href) {
  if (typeof window === 'undefined' || !href.startsWith('/') || href.startsWith('//')) return href;
  const url = new URL(href, window.location.origin);
  for (const [key, value] of Object.entries(getAttribution())) {
    if (!url.searchParams.has(key)) url.searchParams.set(key, value);
  }
  return url.pathname + url.search + url.hash;
}

export function trackProduct(event, deal) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
  const campaign = getAttribution();
  let linkDomain = '';
  try { linkDomain = new URL(deal.affiliateUrl).hostname; } catch { /* Missing URL does not block navigation. */ }
  window.gtag('event', event, {
    items: [{ item_id: deal.asin, item_name: deal.title, item_category: deal.category }],
    ...(event === 'affiliate_click' ? { link_domain: linkDomain, transport_type: 'beacon' } : {}),
    traffic_source: campaign.utm_source || 'site',
    content_id: campaign.utm_content || deal.asin,
  });
}
