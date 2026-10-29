// Amazon.in option for visitors in India (Amazon.in Associates, joined 2026-10-29).
// The amazon.com ASIN often has no Amazon.in listing, so this opens an
// Amazon.in search for the product name instead of claiming the same item.
import { useEffect, useState } from 'react';

export const INDIA_TAG = 'homedealzone-21';
const STORAGE_KEY = 'dz_country';

export function amazonInSearchUrl(title) {
  const words = String(title || '').replace(/[^\p{L}\p{N}\s-]/gu, ' ').split(/\s+/).filter(Boolean).slice(0, 10);
  const url = new URL('https://www.amazon.in/s');
  url.searchParams.set('k', words.join(' '));
  url.searchParams.set('tag', INDIA_TAG);
  return url.toString();
}

export function useVisitorCountry() {
  const [country, setCountry] = useState(() => {
    try { return sessionStorage.getItem(STORAGE_KEY) || ''; } catch { return ''; }
  });
  useEffect(() => {
    if (country) return;
    let cancelled = false;
    fetch('/api/geo', { cache: 'no-store' })
      .then((response) => (response.ok ? response.json() : {}))
      .then(({ country: code = '' }) => {
        if (cancelled || !code) return;
        setCountry(code);
        try { sessionStorage.setItem(STORAGE_KEY, code); } catch { /* Country is re-fetched next visit. */ }
      })
      .catch(() => { /* Unknown country keeps the Amazon.com button only. */ });
    return () => { cancelled = true; };
  }, [country]);
  return country;
}
