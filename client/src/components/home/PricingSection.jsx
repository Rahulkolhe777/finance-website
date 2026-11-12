import { useCallback, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { plans, segments } from '../../data/plans.js';
import formatPrice from '../../utils/formatPrice.js';

const styles = `
.pricing {
  --pr-navy: #0B1B2B;
  --pr-emerald: #0B7A57;
  --pr-emerald-on-dark: #3DD39B;
  --pr-mint: #EEF5F2;
  --pr-border: #D9E5E0;
  --pr-muted: #5B6B78;
  --pr-muted-on-dark: #A9BAC9;
  --pr-gradient: linear-gradient(90deg, #087F58, #0E6E8C);

  background: #fff;
  padding: clamp(3.5rem, 7vw, 5.5rem) 0;
}
.pricing__head {
  text-align: center;
  max-width: 40rem;
  margin: 0 auto 1.75rem;
}
.pricing__title {
  margin: 0 0 0.75rem;
  font-size: clamp(2rem, 4vw, 2.75rem);
  font-weight: 800;
  line-height: 1.15;
  letter-spacing: -0.02em;
  color: var(--pr-navy);
}
.pricing__accent {
  font-family: 'Playfair Display', Georgia, 'Times New Roman', serif;
  font-style: italic;
  font-weight: 700;
  letter-spacing: 0;
  color: var(--pr-emerald);
}
.pricing__sub {
  margin: 0;
  color: var(--pr-muted);
  font-size: 1.0625rem;
}
.pricing__tabs {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 0 auto clamp(2rem, 4vw, 2.75rem);
}
.pricing__tab {
  min-height: 44px;
  padding: 0 1.25rem;
  border: 1px solid var(--pr-border);
  border-radius: 9999px;
  background: var(--pr-mint);
  color: var(--pr-navy);
  font: inherit;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 200ms ease, color 200ms ease, border-color 200ms ease;
}
.pricing__tab:hover { border-color: var(--pr-emerald); }
.pricing__tab:focus-visible {
  outline: 2px solid var(--pr-emerald);
  outline-offset: 2px;
}
.pricing__tab[aria-selected='true'] {
  background: var(--pr-navy);
  border-color: var(--pr-navy);
  color: #fff;
}
.pricing__list {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  align-items: stretch;
  gap: clamp(1rem, 2vw, 1.5rem);
  margin: 0;
  padding: 0;
  list-style: none;
}
.plan-card {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 2rem 1.75rem;
  background: #fff;
  border: 1px solid var(--pr-border);
  border-radius: 24px;
  color: var(--pr-navy);
  transition: transform 200ms ease, box-shadow 200ms ease;
}
.plan-card:hover,
.plan-card:focus-within {
  transform: translateY(-4px);
  box-shadow: 0 16px 32px rgba(11, 27, 43, 0.1);
}
.plan-card--featured {
  background: var(--pr-navy);
  border-color: var(--pr-navy);
  color: #fff;
  box-shadow: 0 24px 48px rgba(11, 27, 43, 0.25);
}
.plan-card__top {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  flex-wrap: wrap;
}
.plan-card__name {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 800;
}
.plan-card__tag {
  padding: 0.25rem 0.625rem;
  border-radius: 9999px;
  background: var(--pr-emerald-on-dark);
  color: var(--pr-navy);
  font-size: 0.6875rem;
  font-weight: 800;
  letter-spacing: 0.08em;
}
.plan-card__tagline {
  margin: -0.5rem 0 0;
  font-size: 0.875rem;
  color: var(--pr-muted);
}
.plan-card--featured .plan-card__tagline,
.plan-card--featured .plan-card__billed { color: var(--pr-muted-on-dark); }
.plan-card__price {
  margin: 0.25rem 0 0;
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 0.375rem;
}
.plan-card__amount {
  font-size: clamp(1.875rem, 3vw, 2.25rem);
  font-weight: 800;
  letter-spacing: -0.02em;
}
.plan-card__per {
  font-size: 0.9375rem;
  font-weight: 600;
}
.plan-card__billed {
  margin: -0.5rem 0 0;
  font-size: 0.8125rem;
  color: var(--pr-muted);
}
.plan-card__features {
  display: grid;
  gap: 0.625rem;
  margin: 0.5rem 0 0;
  padding: 1.25rem 0 0;
  border-top: 1px solid var(--pr-border);
  list-style: none;
  font-size: 0.9375rem;
}
.plan-card--featured .plan-card__features { border-top-color: rgba(217, 229, 224, 0.15); }
.plan-card__features li {
  display: flex;
  gap: 0.5rem;
  align-items: flex-start;
}
.plan-card__features svg {
  flex-shrink: 0;
  margin-top: 0.25em;
  color: var(--pr-emerald);
}
.plan-card--featured .plan-card__features svg { color: var(--pr-emerald-on-dark); }
.plan-card__cta {
  margin-top: auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;
  padding: 0 1.5rem;
  border-radius: 9999px;
  background: var(--pr-gradient);
  color: #fff;
  font-weight: 700;
  transition: box-shadow 200ms ease, transform 200ms ease;
}
.plan-card__cta:hover,
.plan-card__cta:focus-visible {
  color: #fff;
  box-shadow: 0 10px 22px rgba(8, 127, 88, 0.35);
}
.pricing__note {
  max-width: 48rem;
  margin: clamp(1.75rem, 3vw, 2.5rem) auto 0;
  text-align: center;
  font-size: 0.8125rem;
  line-height: 1.7;
  color: var(--pr-muted);
}
@media (max-width: 1024px) {
  .pricing__list { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (max-width: 680px) {
  .pricing__list { grid-template-columns: 1fr; }
  .pricing__tabs {
    flex-wrap: nowrap;
    justify-content: flex-start;
    overflow-x: auto;
    padding-bottom: 0.25rem;
    scrollbar-width: none;
  }
  .pricing__tab { flex-shrink: 0; }
  .plan-card { padding: 1.75rem 1.5rem; }
}
@media (prefers-reduced-motion: reduce) {
  .plan-card,
  .pricing__tab,
  .plan-card__cta { transition: none; }
  .plan-card:hover,
  .plan-card:focus-within { transform: none; }
}
`;

const priceLabel = (price) => (typeof price === 'number' ? formatPrice(price) : '[₹ PRICE]');

export default function PricingSection() {
  const [activeSegment, setActiveSegment] = useState(segments[0].id);
  const tabRefs = useRef([]);

  const visiblePlans = useMemo(
    () => plans.filter((plan) => plan.segment === activeSegment),
    [activeSegment]
  );

  // Arrow-key navigation between tabs (WAI-ARIA tabs pattern).
  const onTabKeyDown = useCallback((e, index) => {
    const last = segments.length - 1;
    const keys = { ArrowRight: index === last ? 0 : index + 1, ArrowLeft: index === 0 ? last : index - 1, Home: 0, End: last };
    if (!(e.key in keys)) return;
    e.preventDefault();
    const next = keys[e.key];
    setActiveSegment(segments[next].id);
    tabRefs.current[next]?.focus();
  }, []);

  return (
    <section className="pricing" aria-labelledby="pricing-title">
      <style>{styles}</style>
      <div className="container">
        <header className="pricing__head">
          <h2 id="pricing-title" className="pricing__title">
            Simple <span className="pricing__accent">Pricing</span>
          </h2>
          <p className="pricing__sub">Pick a segment, then choose the plan that fits you</p>
        </header>

        <div className="pricing__tabs" role="tablist" aria-label="Market segment">
          {segments.map((segment, index) => {
            const selected = segment.id === activeSegment;
            return (
              <button
                key={segment.id}
                ref={(el) => { tabRefs.current[index] = el; }}
                type="button"
                role="tab"
                id={'pricing-tab-' + segment.id}
                aria-selected={selected}
                aria-controls="pricing-panel"
                tabIndex={selected ? 0 : -1}
                className="pricing__tab"
                onClick={() => setActiveSegment(segment.id)}
                onKeyDown={(e) => onTabKeyDown(e, index)}
              >
                {segment.label}
              </button>
            );
          })}
        </div>

        <div id="pricing-panel" role="tabpanel" aria-labelledby={'pricing-tab-' + activeSegment}>
          <ul className="pricing__list">
            {visiblePlans.map((plan) => (
              <li key={plan.slug}>
                <article className={'plan-card' + (plan.featured ? ' plan-card--featured' : '')}>
                  <div className="plan-card__top">
                    <h3 className="plan-card__name">{plan.name}</h3>
                    {plan.featured && <span className="plan-card__tag">BEST VALUE</span>}
                  </div>
                  <p className="plan-card__tagline">Research calls from a SEBI registered research analyst</p>

                  <p className="plan-card__price">
                    <span className="plan-card__amount">{priceLabel(plan.price)}</span>
                    <span className="plan-card__per">{plan.perLabel}</span>
                  </p>
                  <p className="plan-card__billed">{plan.billedLabel}</p>

                  <ul className="plan-card__features">
                    {plan.features.map((feature) => (
                      <li key={feature}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M5 12l5 5L20 7" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Link
                    to={'/pricing?plan=' + encodeURIComponent(plan.slug)}
                    className="plan-card__cta"
                    aria-label={'Subscribe to the ' + plan.name + ' plan'}
                  >
                    Subscribe · {plan.name}
                  </Link>
                </article>
              </li>
            ))}
          </ul>
        </div>

        <p className="pricing__note">
          Fees are [inclusive / exclusive] of GST. Pay securely online through [YOUR PAYMENT GATEWAY].{' '}
          [YOUR REFUND POLICY]. No guaranteed returns; market investments carry risk.{' '}
          [ADD YOUR FEE DISCLOSURE AS REQUIRED BY SEBI]
        </p>
      </div>
    </section>
  );
}
