import { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import DealCard from '../components/DealCard';
import { getDeals, getSocialPosts } from '../services/api';
import { getAttribution, attributedHref } from '../services/attribution.mjs';
import published from '../data/socialFinds.json';
import './SocialFindsPage.css';

export default function SocialFindsPage() {
  const [deals, setDeals] = useState([]);
  const [status, setStatus] = useState('loading');
  const [posts, setPosts] = useState(published);
  useEffect(() => {
    getAttribution();
    document.title = 'Shop our Instagram & Facebook finds | DealZone';
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.href = 'https://www.freedealzone.biz/finds';
    let alive = true;
    Promise.all([getDeals({ active: true }), getSocialPosts().catch(() => [])]).then(([items, feed]) => {
      if (alive) { setDeals(items); if (feed.length) setPosts(feed); setStatus('ready'); }
    }).catch(() => { if (alive) setStatus('error'); });
    return () => { alive = false; };
  }, []);
  return <>
    <Header />
    <main className="social-finds">
      <section className="finds-intro">
        <p className="finds-eyebrow">SEEN ON @FREEDEALZONE</p>
        <h1>Find the piece you saved.</h1>
        <p>Shop the home decor finds from our Instagram and Facebook posts, with a styling idea for each one.</p>
        <p className="finds-notice">Amazon.com picks for US shoppers. Prices, availability and delivery depend on your address. As an Amazon Associate I earn from qualifying purchases.</p>
      </section>
      <section className="finds-posts" aria-label="Products from our posts">
        {status === 'loading' && <p role="status">Loading our latest finds…</p>}
        {status === 'error' && <p role="alert">We could not load the products. Please refresh or <a href="/#deals">browse all finds</a>.</p>}
        {status === 'ready' && posts.map((post) => {
          const deal = deals.find((item) => item.asin === post.asin && item.active !== false);
          return <article className="finds-post" key={post.asin}>
            <div className="finds-post-copy"><h2>{post.title}</h2><p>{post.tip}</p>
              <a href={post.instagram || post.facebook} target="_blank" rel="noopener noreferrer">See the {post.instagram ? 'Instagram' : 'Facebook'} post ↗</a>
            </div>
            {deal ? <DealCard deal={deal} /> : <p>This find is currently unavailable. <a href={attributedHref('/#deals')}>Browse other finds</a>.</p>}
          </article>;
        })}
      </section>
      <div className="finds-more"><a href={attributedHref('/#deals')}>Explore all home finds →</a></div>
    </main>
    <Footer />
  </>;
}
