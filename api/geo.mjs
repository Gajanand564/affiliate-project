// Visitor country from Vercel's edge header, so product pages (cached for every
// country) can show an Amazon.in option to visitors in India.
export default function handler(req, res) {
  res.setHeader('Cache-Control', 'private, no-store');
  const country = String(req.headers['x-vercel-ip-country'] || '').toUpperCase();
  res.status(200).json({ country: /^[A-Z]{2}$/.test(country) ? country : '' });
}
