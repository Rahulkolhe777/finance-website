import { useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import PricingSection from '../components/home/PricingSection.jsx';
import { periods, plans, segments } from '../data/plans.js';
import CheckoutForm from '../components/forms/CheckoutForm.jsx';
import formatPrice from '../utils/formatPrice.js';

// Replace placeholders with your real details.
const GATEWAYS = [{ id: 'primary', label: 'Razorpay' }];
const PAYMENT_METHODS = ['UPI', 'Debit / Credit Cards', 'Net Banking', 'Wallets'];
const REFUND_POLICY = 'Fees once paid are non-refundable. Please use the free trial before subscribing.';

const PERIOD_COLUMNS = periods.map((p) => ({ period: p.period, label: p.name, featured: p.featured }));

const priceLabel = (price) => (typeof price === 'number' ? formatPrice(price) : '[₹ PRICE]');
const planFor = (segment, period) => plans.find((p) => p.segment === segment && p.period === period);
const segmentLabel = (id) => segments.find((s) => s.id === id)?.label || id;

const styles = `
.pricing-page {
  --pp-navy: #0B1B2B;
  --pp-emerald: #0B7A57;
  --pp-mint: #EEF5F2;
  --pp-border: #D9E5E0;
  --pp-muted: #4F5F6B;
  --pp-gradient: linear-gradient(90deg, #087F58, #0E6E8C);
  color: var(--pp-navy);
}
.pricing-page__hero {
  background: linear-gradient(#EAF8F1, #fff);
  padding: clamp(3rem, 7vw, 4.5rem) 0 clamp(1rem, 3vw, 1.5rem);
  text-align: center;
}
.pricing-page__title {
  margin: 0 0 0.75rem;
  font-size: clamp(2.25rem, 5vw, 3.25rem);
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -0.02em;
}
.pricing-page__accent {
  font-family: 'Playfair Display', Georgia, 'Times New Roman', serif;
  font-style: italic;
  font-weight: 700;
  letter-spacing: 0;
  color: var(--pp-emerald);
}
.pricing-page__sub { margin: 0 auto; max-width: 38rem; color: var(--pp-muted); font-size: 1.0625rem; }
.pricing-page__section { padding-block: clamp(2.5rem, 6vw, 4rem); }
.pricing-page__h2 { margin: 0 0 1.25rem; font-size: clamp(1.5rem, 3vw, 2rem); font-weight: 800; letter-spacing: -0.01em; }

/* checkout */
.checkout {
  --checkout-error: #FFB4A8;
  scroll-margin-top: calc(var(--header-height) + 1rem);
  display: grid;
  gap: 1.25rem;
  margin-top: 1.5rem;
  padding: clamp(1.5rem, 4vw, 2rem);
  border-radius: 24px;
  background: var(--pp-navy);
  color: #fff;
}
.checkout:focus { outline: none; }
.checkout__label { margin: 0 0 0.25rem; font-size: 0.8125rem; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; color: #3DD39B; }
.checkout__plan { margin: 0; font-size: 1.5rem; font-weight: 800; }
.checkout__meta { margin: 0.25rem 0 0; color: #A9BAC9; }
.checkout__change { color: #3DD39B; text-decoration: underline; font-size: 0.9375rem; }

/* comparison */
.compare__scroll {
  overflow-x: auto;
  border: 1px solid var(--pp-border);
  border-radius: 20px;
}
.compare__table {
  width: 100%;
  min-width: 640px;
  border-collapse: collapse;
  font-size: 0.9375rem;
}
.compare__table caption { text-align: left; padding: 1rem 1.25rem 0; color: var(--pp-muted); font-size: 0.875rem; }
.compare__table th,
.compare__table td { padding: 0.875rem 1.25rem; text-align: left; border-bottom: 1px solid var(--pp-border); }
.compare__table thead th { background: var(--pp-mint); font-weight: 800; }
.compare__table thead th.is-featured { background: var(--pp-navy); color: #fff; }
.compare__table tbody th { font-weight: 600; }
.compare__table tbody tr:last-child th,
.compare__table tbody tr:last-child td { border-bottom: 0; }
.compare__group th { background: #F7FAF9; font-size: 0.8125rem; font-weight: 800; letter-spacing: 0.06em; text-transform: uppercase; color: var(--pp-emerald); }
.compare__yes { color: var(--pp-emerald); font-weight: 700; }

/* payment info */
.pay-info {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: clamp(1rem, 2vw, 1.5rem);
}
.pay-info__card {
  padding: 1.75rem;
  border: 1px solid var(--pp-border);
  border-radius: 20px;
  background: var(--pp-mint);
}
.pay-info__title { margin: 0 0 0.75rem; font-size: 1.125rem; font-weight: 800; }
.pay-info__text { margin: 0; color: var(--pp-muted); line-height: 1.7; }
.pay-info__chips { display: flex; flex-wrap: wrap; gap: 0.5rem; margin: 0; padding: 0; list-style: none; }
.pay-info__chips li { padding: 0.375rem 0.75rem; border: 1px solid var(--pp-border); border-radius: 9999px; background: #fff; font-size: 0.875rem; font-weight: 600; }
.pay-info__link { color: var(--pp-emerald); text-decoration: underline; }
@media (max-width: 900px) {
  .pay-info { grid-template-columns: 1fr; }
}
`;

export default function Pricing() {
  const [searchParams] = useSearchParams();
  const selectedPlan = plans.find((p) => p.slug === searchParams.get('plan')) || null;
  const checkoutRef = useRef(null);

  // Bring the checkout panel into view when arriving with ?plan=…
  useEffect(() => {
    if (!selectedPlan) return undefined;
    const frame = requestAnimationFrame(() => {
      checkoutRef.current?.scrollIntoView({ block: 'start' });
      checkoutRef.current?.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(frame);
  }, [selectedPlan]);

  return (
    <div className="pricing-page">
      <style>{styles}</style>

      <section className="pricing-page__hero" aria-labelledby="pricing-page-title">
        <div className="container">
          <h1 id="pricing-page-title" className="pricing-page__title">
            Pricing &amp; <span className="pricing-page__accent">Payments</span>
          </h1>
          <p className="pricing-page__sub">Pick a segment, then choose the plan that fits you</p>

          {selectedPlan && (
            <section ref={checkoutRef} className="checkout" tabIndex={-1} aria-labelledby="checkout-plan" style={{ textAlign: 'left' }}>
              <div>
                <p className="checkout__label">Selected plan</p>
                <h2 id="checkout-plan" className="checkout__plan">
                  {segmentLabel(selectedPlan.segment)} · {selectedPlan.name}
                </h2>
                <p className="checkout__meta">
                  {priceLabel(selectedPlan.price)} {selectedPlan.perLabel} · {selectedPlan.billedLabel} ·{' '}
                  <a href="#plans" className="checkout__change">Change plan</a>
                </p>
              </div>
              <CheckoutForm
                key={selectedPlan.slug}
                purpose="plan"
                refId={selectedPlan.slug}
                idPrefix="plan-checkout"
                payLabel={'Pay ' + priceLabel(selectedPlan.price) + ' securely'}
              />
            </section>
          )}
        </div>
      </section>

      <div id="plans">
        <PricingSection />
      </div>

      <section className="pricing-page__section" style={{ paddingTop: 0 }} aria-labelledby="compare-title">
        <div className="container">
          <h2 id="compare-title" className="pricing-page__h2">Compare all plans</h2>
          <div className="compare__scroll" tabIndex={0} role="region" aria-labelledby="compare-title">
            <table className="compare__table">
              <caption>Prices per billing period. Scroll sideways on small screens.</caption>
              <thead>
                <tr>
                  <th scope="col">Plan</th>
                  {PERIOD_COLUMNS.map((col) => (
                    <th key={col.period} scope="col" className={col.featured ? 'is-featured' : undefined}>
                      {col.label}
                      {col.featured && ' · Best value'}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="compare__group"><th scope="rowgroup" colSpan={PERIOD_COLUMNS.length + 1}>Price by segment</th></tr>
                {segments.map((segment) => (
                  <tr key={segment.id}>
                    <th scope="row">{segment.label}</th>
                    {PERIOD_COLUMNS.map((col) => {
                      const plan = planFor(segment.id, col.period);
                      return <td key={col.period}>{plan ? priceLabel(plan.price) + ' ' + plan.perLabel : '—'}</td>;
                    })}
                  </tr>
                ))}
                <tr className="compare__group"><th scope="rowgroup" colSpan={PERIOD_COLUMNS.length + 1}>What you get</th></tr>
                <tr>
                  <th scope="row">Calls</th>
                  {PERIOD_COLUMNS.map((col) => <td key={col.period}>25–30 a month*</td>)}
                </tr>
                <tr>
                  <th scope="row">Entry, two targets and a stop-loss</th>
                  {PERIOD_COLUMNS.map((col) => <td key={col.period} className="compare__yes">✓ Every call</td>)}
                </tr>
                <tr>
                  <th scope="row">Support</th>
                  {PERIOD_COLUMNS.map((col) => <td key={col.period}>Monday to Sunday</td>)}
                </tr>
                <tr>
                  <th scope="row">Savings vs paying quarterly</th>
                  {PERIOD_COLUMNS.map((col) => {
                    const savings = planFor(segments[0].id, col.period)?.savings;
                    return <td key={col.period}>{savings ? '₹' + savings.amount.toLocaleString('en-IN') + ' (' + savings.percent + '%)' : '—'}</td>;
                  })}
                </tr>
                <tr>
                  <th scope="row">Billing</th>
                  {PERIOD_COLUMNS.map((col) => <td key={col.period}>{planFor(segments[0].id, col.period)?.billedLabel}</td>)}
                </tr>
              </tbody>
            </table>
          </div>
          <p style={{ margin: '0.75rem 0 0', fontSize: '0.8125rem', color: '#4F5F6B' }}>* Number of calls is subject to market conditions.</p>
        </div>
      </section>

      <section className="pricing-page__section" style={{ paddingTop: 0 }} aria-labelledby="payments-title">
        <div className="container">
          <h2 id="payments-title" className="pricing-page__h2">Payments</h2>
          <div className="pay-info">
            <article className="pay-info__card">
              <h3 className="pay-info__title">Accepted payment methods</h3>
              <ul className="pay-info__chips">
                {PAYMENT_METHODS.map((method) => <li key={method}>{method}</li>)}
              </ul>
              <p className="pay-info__text" style={{ marginTop: '1rem' }}>
                Payments are processed securely by {GATEWAYS[0].label}.
              </p>
            </article>
            <article className="pay-info__card">
              <h3 className="pay-info__title">Payment receipt</h3>
              <p className="pay-info__text">
                Fees are inclusive of GST. A payment receipt is sent to your email after every successful payment.
              </p>
            </article>
            <article className="pay-info__card">
              <h3 className="pay-info__title">Refund policy</h3>
              <p className="pay-info__text">{REFUND_POLICY}</p>
              <p className="pay-info__text" style={{ marginTop: '0.75rem' }}>
                See our <Link to="/legal/terms" className="pay-info__link">Terms &amp; Conditions</Link>.
              </p>
            </article>
          </div>
        </div>
      </section>
    </div>
  );
}
