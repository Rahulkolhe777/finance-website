import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

// One block per segment. `pricingSegment` must match a tab id in data/plans.js
// (null = no dedicated pricing tab). Replace every [PLACEHOLDER].
const SEGMENTS = [
  { id: 'advisory', title: 'Advisory', pricingSegment: null },
  { id: 'cash', title: 'Cash', pricingSegment: 'cash' },
  { id: 'stock-options', title: 'Stock Options', pricingSegment: 'stock-options' },
  { id: 'index-options', title: 'Index Options', pricingSegment: 'index-options' },
  { id: 'commodities', title: 'Commodities', pricingSegment: 'commodities' },
  { id: 'energy', title: 'Energy', pricingSegment: 'energy' },
].map((segment) => ({
  ...segment,
  whoFor: '[TEXT]',
  callsPerDay: '[N]',
  approach: '[TEXT]',
  riskNote: '[RISK NOTE]',
}));

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const styles = `
.services-page {
  --sp-navy: #0B1B2B;
  --sp-emerald: #0B7A57;
  --sp-mint: #EEF5F2;
  --sp-border: #D9E5E0;
  --sp-muted: #4F5F6B;
  --sp-gradient: linear-gradient(90deg, #087F58, #0E6E8C);
  color: var(--sp-navy);
}
.services-page__hero {
  background: linear-gradient(#EAF8F1, #fff);
  padding: clamp(3rem, 7vw, 4.5rem) 0 clamp(2rem, 4vw, 3rem);
  text-align: center;
}
.services-page__title {
  margin: 0 0 0.75rem;
  font-size: clamp(2.25rem, 5vw, 3.25rem);
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -0.02em;
}
.services-page__accent {
  font-family: 'Playfair Display', Georgia, 'Times New Roman', serif;
  font-style: italic;
  font-weight: 700;
  letter-spacing: 0;
  color: var(--sp-emerald);
}
.services-page__sub { margin: 0 auto; max-width: 36rem; color: var(--sp-muted); font-size: 1.0625rem; }
.services-page__layout {
  display: grid;
  grid-template-columns: 240px minmax(0, 1fr);
  gap: clamp(1.5rem, 4vw, 3rem);
  align-items: start;
  padding-block: clamp(1.5rem, 4vw, 3rem) clamp(3.5rem, 7vw, 5.5rem);
}
.services-nav {
  position: sticky;
  top: calc(var(--header-height) + 1.5rem);
}
.services-nav__list {
  display: grid;
  gap: 0.25rem;
  margin: 0;
  padding: 0.5rem;
  border: 1px solid var(--sp-border);
  border-radius: 20px;
  background: #fff;
  list-style: none;
}
.services-nav__link {
  display: flex;
  align-items: center;
  min-height: 44px;
  padding: 0 1rem;
  border-radius: 9999px;
  color: var(--sp-navy);
  font-weight: 600;
  font-size: 0.9375rem;
  white-space: nowrap;
  transition: background-color 200ms ease, color 200ms ease;
}
.services-nav__link:hover { background: var(--sp-mint); color: var(--sp-emerald); }
.services-nav__link.is-active { background: var(--sp-navy); color: #fff; }
.services-blocks { display: grid; gap: clamp(1.25rem, 3vw, 2rem); }
.service-block {
  scroll-margin-top: calc(var(--header-height) + 1.5rem);
  padding: clamp(1.5rem, 4vw, 2.5rem);
  border: 1px solid var(--sp-border);
  border-radius: 24px;
  background: #fff;
}
.service-block:focus { outline: none; }
.service-block:focus-visible { outline: 2px solid var(--sp-emerald); outline-offset: 4px; }
.service-block__title {
  margin: 0 0 1.25rem;
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 800;
  letter-spacing: -0.01em;
}
.service-block__facts {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
  margin: 0;
}
.service-block__fact {
  padding: 1.25rem;
  border-radius: 16px;
  background: var(--sp-mint);
}
.service-block__fact dt {
  margin-bottom: 0.375rem;
  font-size: 0.8125rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--sp-emerald);
}
.service-block__fact dd { margin: 0; color: var(--sp-navy); line-height: 1.65; }
.service-block__risk {
  display: flex;
  gap: 0.625rem;
  margin: 1.25rem 0 0;
  padding: 1rem 1.25rem;
  border: 1px solid #F3D7A6;
  border-radius: 16px;
  background: #FFF8EC;
  color: #6B4A0E;
  font-size: 0.9375rem;
  line-height: 1.6;
}
.service-block__risk svg { flex-shrink: 0; margin-top: 0.15em; }
.service-block__cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  min-height: 48px;
  margin-top: 1.5rem;
  padding: 0 1.75rem;
  border-radius: 9999px;
  background: var(--sp-gradient);
  color: #fff;
  font-weight: 700;
}
.service-block__cta:hover,
.service-block__cta:focus-visible { color: #fff; box-shadow: 0 10px 22px rgba(8, 127, 88, 0.3); }
@media (max-width: 900px) {
  .services-page__layout { grid-template-columns: 1fr; }
  .services-nav {
    top: var(--header-height);
    z-index: 5;
    margin-inline: calc(-1 * var(--space-md));
    padding: 0.5rem var(--space-md);
    background: rgba(255, 255, 255, 0.96);
    border-bottom: 1px solid var(--sp-border);
  }
  .services-nav__list {
    display: flex;
    gap: 0.375rem;
    overflow-x: auto;
    padding: 0;
    border: 0;
    border-radius: 0;
    background: transparent;
    scrollbar-width: none;
  }
  .services-nav__list::-webkit-scrollbar { display: none; }
  .services-nav__link { border: 1px solid var(--sp-border); }
  .service-block { scroll-margin-top: calc(var(--header-height) + 4.5rem); }
}
@media (max-width: 560px) {
  .service-block__facts { grid-template-columns: 1fr; }
}
`;

export default function Services() {
  const [activeId, setActiveId] = useState(SEGMENTS[0].id);
  const blockRefs = useRef({});
  const navRefs = useRef({});
  const { hash } = useLocation();

  // Highlight the block currently in the middle band of the viewport.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length) setActiveId(visible[0].target.id);
      },
      { rootMargin: '-35% 0px -60% 0px' }
    );
    Object.values(blockRefs.current).forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Keep the active chip visible in the horizontal mobile nav.
  useEffect(() => {
    navRefs.current[activeId]?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  }, [activeId]);

  const jumpTo = useCallback((id, smooth = true) => {
    const el = blockRefs.current[id];
    if (!el) return;
    el.scrollIntoView({ behavior: smooth && !prefersReducedMotion() ? 'smooth' : 'auto', block: 'start' });
    el.focus({ preventScroll: true });
    setActiveId(id);
  }, []);

  // Deep links like /services#cash: wait a frame so the layout's scroll-to-top runs first.
  useEffect(() => {
    const id = hash.replace('#', '');
    if (!id || !blockRefs.current[id]) return undefined;
    const frame = requestAnimationFrame(() => jumpTo(id, false));
    return () => cancelAnimationFrame(frame);
  }, [hash, jumpTo]);

  const onNavClick = (e, id) => {
    e.preventDefault();
    window.history.replaceState(null, '', '#' + id);
    jumpTo(id);
  };

  return (
    <div className="services-page">
      <style>{styles}</style>

      <section className="services-page__hero" aria-labelledby="services-page-title">
        <div className="container">
          <h1 id="services-page-title" className="services-page__title">
            Our <span className="services-page__accent">Services</span>
          </h1>
          <p className="services-page__sub">Invest hassle-free with research-backed advice</p>
        </div>
      </section>

      <div className="container services-page__layout">
        <nav className="services-nav" aria-label="Service segments">
          <ul className="services-nav__list">
            {SEGMENTS.map((segment) => (
              <li key={segment.id}>
                <a
                  ref={(el) => { navRefs.current[segment.id] = el; }}
                  href={'#' + segment.id}
                  className={'services-nav__link' + (activeId === segment.id ? ' is-active' : '')}
                  aria-current={activeId === segment.id ? 'location' : undefined}
                  onClick={(e) => onNavClick(e, segment.id)}
                >
                  {segment.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="services-blocks">
          {SEGMENTS.map((segment) => (
            <section
              key={segment.id}
              id={segment.id}
              ref={(el) => { blockRefs.current[segment.id] = el; }}
              className="service-block"
              tabIndex={-1}
              aria-labelledby={segment.id + '-title'}
            >
              <h2 id={segment.id + '-title'} className="service-block__title">{segment.title}</h2>

              <dl className="service-block__facts">
                <div className="service-block__fact">
                  <dt>Who it&apos;s for</dt>
                  <dd>{segment.whoFor}</dd>
                </div>
                <div className="service-block__fact">
                  <dt>Calls per day</dt>
                  <dd>{segment.callsPerDay}</dd>
                </div>
                <div className="service-block__fact" style={{ gridColumn: '1 / -1' }}>
                  <dt>Target &amp; stop-loss approach</dt>
                  <dd>{segment.approach}</dd>
                </div>
              </dl>

              <p className="service-block__risk">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 3l9.5 17h-19L12 3zM12 10v4M12 17h.01" />
                </svg>
                <span><strong>Risk note: </strong>{segment.riskNote}</span>
              </p>

              <Link
                to={segment.pricingSegment ? '/pricing?segment=' + segment.pricingSegment : '/pricing'}
                className="service-block__cta"
                aria-label={'Subscribe to ' + segment.title}
              >
                Subscribe <span aria-hidden="true">→</span>
              </Link>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
