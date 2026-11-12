import { useState } from 'react';
import { Link } from 'react-router-dom';

// Replace placeholders with real details. Drop a transparent analyst photo at
// client/public/images/analyst.webp (PNG also works — update the path).
const ANALYST_NAME = '[YOUR NAME]';
const SEBI_NO = '[YOUR SEBI NO]';
const ANALYST_PHOTO = '/images/analyst.webp';

const STATS = [
  { value: '[5000+]', label: 'Clients served' },
  { value: '[10+]', label: 'Years in markets' },
  { value: 'Mon–Sat', label: 'Client support' },
];

const SAMPLE_CALL = {
  stock: '[STOCK]',
  action: 'BUY',
  targets: ['[₹____]', '[₹____]'],
  stopLoss: '[₹____]',
};

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@1,600;1,700&display=swap');

.hero {
  position: relative;
  overflow: hidden;
  background: linear-gradient(180deg, var(--color-emerald-light) 0%, #f4fbf8 45%, var(--color-bg) 100%);
  padding: clamp(2.5rem, 6vw, 5rem) 0 clamp(3rem, 6vw, 5.5rem);
}
.hero::before {
  content: '';
  position: absolute;
  top: -180px;
  left: -160px;
  width: 420px;
  height: 420px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(20, 163, 139, 0.14), transparent 70%);
  pointer-events: none;
}
.hero__grid {
  position: relative;
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  align-items: center;
  gap: clamp(2rem, 5vw, 4rem);
}

/* ---- copy ---- */
.hero__badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-sm);
  padding: 0.375rem 0.875rem;
  border: 1px solid rgba(15, 122, 92, 0.25);
  border-radius: var(--radius-pill);
  background: rgba(255, 255, 255, 0.8);
  color: var(--color-emerald-dark);
  font-size: 0.8125rem;
  font-weight: 600;
}
.hero__badge-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-teal);
  box-shadow: 0 0 0 4px rgba(20, 163, 139, 0.18);
}
.hero__title {
  margin: 1.25rem 0 1rem;
  font-size: clamp(2.25rem, 5vw, 3.75rem);
  line-height: 1.08;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--color-navy);
}
.hero__accent {
  position: relative;
  display: inline-block;
  font-family: 'Playfair Display', Georgia, 'Times New Roman', serif;
  font-style: italic;
  font-weight: 700;
  color: var(--color-emerald);
  letter-spacing: 0;
  z-index: 0;
}
.hero__accent::after {
  content: '';
  position: absolute;
  left: -4px;
  right: -4px;
  bottom: 0.08em;
  height: 0.32em;
  background: rgba(20, 163, 139, 0.2);
  border-radius: 4px;
  z-index: -1;
}
.hero__lead {
  max-width: 34rem;
  margin: 0 0 1.75rem;
  font-size: 1.0625rem;
  color: var(--color-muted);
}
.hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}
.hero__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
  min-height: 48px;
  padding: 0 1.75rem;
  border-radius: var(--radius-pill);
  font-weight: 600;
  transition: transform var(--transition), box-shadow var(--transition), background-color var(--transition), color var(--transition);
}
.hero__btn--primary {
  background: var(--gradient-cta);
  color: #fff;
  box-shadow: 0 8px 20px rgba(15, 122, 92, 0.28);
}
.hero__btn--primary:hover,
.hero__btn--primary:focus-visible {
  color: #fff;
  transform: translateY(-2px);
  box-shadow: 0 12px 26px rgba(15, 122, 92, 0.34);
}
.hero__btn--ghost {
  border: 1.5px solid var(--color-navy);
  color: var(--color-navy);
  background: var(--color-bg);
}
.hero__btn--ghost:hover,
.hero__btn--ghost:focus-visible {
  background: var(--color-navy);
  color: #fff;
}
.hero__stats {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem 2.5rem;
  margin: 2.5rem 0 0;
  padding: 0;
  list-style: none;
}
.hero__stat-value {
  display: block;
  font-size: 1.625rem;
  font-weight: 800;
  color: var(--color-navy);
  line-height: 1.2;
}
.hero__stat-label {
  font-size: 0.8125rem;
  color: var(--color-muted);
}

/* ---- visual ---- */
.hero__visual {
  position: relative;
  min-height: 460px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}
.hero__panel {
  position: absolute;
  inset: 8% 4% 0 10%;
  border-radius: 28px;
  background: linear-gradient(150deg, #bfe8da 0%, var(--color-teal) 55%, var(--color-emerald) 100%);
  transform: rotate(-6deg);
  box-shadow: 0 30px 60px rgba(15, 122, 92, 0.22);
}
.hero__panel::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background-image: linear-gradient(rgba(255,255,255,0.12) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.12) 1px, transparent 1px);
  background-size: 32px 32px;
}
.hero__photo {
  position: relative;
  z-index: 1;
  width: min(100%, 420px);
  max-height: 520px;
  object-fit: contain;
  object-position: bottom;
}
.hero__photo-fallback {
  position: relative;
  z-index: 1;
  width: min(80%, 340px);
  aspect-ratio: 3 / 4;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 24px 24px 0 0;
  background: rgba(255, 255, 255, 0.35);
  color: var(--color-navy);
  font-size: 0.875rem;
  font-weight: 600;
}
.hero__card {
  position: absolute;
  z-index: 2;
  top: 4%;
  left: 0;
  width: 230px;
  padding: 1rem 1.125rem;
  border-radius: 14px;
  background: var(--color-bg);
  box-shadow: 0 18px 40px rgba(15, 29, 43, 0.16);
  animation: hero-float 6s ease-in-out infinite;
}
.hero__card-tag {
  display: inline-block;
  margin-bottom: 0.5rem;
  padding: 0.125rem 0.5rem;
  border-radius: var(--radius-pill);
  background: var(--color-emerald-light);
  color: var(--color-emerald);
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.08em;
}
.hero__card-title {
  margin: 0 0 0.375rem;
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-navy);
}
.hero__card-buy { color: var(--color-emerald); }
.hero__card-row {
  margin: 0;
  font-size: 0.8125rem;
  color: var(--color-muted);
}
.hero__card-note {
  margin: 0.5rem 0 0;
  font-size: 0.6875rem;
  color: var(--color-muted);
  font-style: italic;
}
.hero__sebi {
  position: absolute;
  z-index: 2;
  right: 0;
  bottom: 8%;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  background: var(--color-navy);
  color: #fff;
  box-shadow: 0 14px 30px rgba(15, 29, 43, 0.3);
}
.hero__sebi strong {
  display: block;
  font-size: 0.9375rem;
}
.hero__sebi span {
  font-size: 0.75rem;
  color: var(--color-on-dark-muted);
}

@keyframes hero-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}
@media (prefers-reduced-motion: reduce) {
  .hero__card { animation: none; }
  .hero__btn { transition: none; }
}
@media (max-width: 900px) {
  .hero__grid { grid-template-columns: 1fr; }
  .hero__visual { min-height: 380px; max-width: 440px; width: 100%; margin: 0 auto; }
}
@media (max-width: 480px) {
  .hero__actions .hero__btn { flex: 1 1 100%; }
  .hero__stats { gap: 1.25rem 1.75rem; }
  .hero__card { width: 190px; padding: 0.75rem 0.875rem; }
  .hero__sebi { padding: 0.625rem 0.75rem; }
}
`;

export default function Hero() {
  const [photoFailed, setPhotoFailed] = useState(false);

  return (
    <section className="hero" aria-labelledby="hero-title">
      <style>{styles}</style>
      <div className="container hero__grid">
        <div className="hero__copy">
          <span className="hero__badge">
            <span className="hero__badge-dot" aria-hidden="true" />
            {ANALYST_NAME} · SEBI Registered Research Analyst
          </span>

          <h1 id="hero-title" className="hero__title">
            Trade Smarter With <span className="hero__accent">Research</span> You Can Trust
          </h1>

          <p className="hero__lead">
            Fundamental, technical and news-based trade ideas, each with defined targets and a stop-loss.
          </p>

          <div className="hero__actions">
            <Link to="/free-trial" className="hero__btn hero__btn--primary">
              Start Free Trial
              <span aria-hidden="true">→</span>
            </Link>
            <Link to="/services" className="hero__btn hero__btn--ghost">View Services</Link>
          </div>

          <ul className="hero__stats">
            {STATS.map((stat) => (
              <li key={stat.label}>
                <span className="hero__stat-value">{stat.value}</span>
                <span className="hero__stat-label">{stat.label}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="hero__visual">
          <div className="hero__panel" aria-hidden="true" />

          {photoFailed ? (
            <div className="hero__photo-fallback">[ANALYST PHOTO]</div>
          ) : (
            <img
              className="hero__photo"
              src={ANALYST_PHOTO}
              alt={ANALYST_NAME + ', SEBI Registered Research Analyst'}
              width="420"
              height="520"
              onError={() => setPhotoFailed(true)}
            />
          )}

          <div className="hero__card" aria-label="Sample call, for illustration only">
            <span className="hero__card-tag">SAMPLE CALL</span>
            <p className="hero__card-title">
              {SAMPLE_CALL.stock} · <span className="hero__card-buy">{SAMPLE_CALL.action}</span>
            </p>
            <p className="hero__card-row">
              Target 1 {SAMPLE_CALL.targets[0]} · Target 2 {SAMPLE_CALL.targets[1]}
            </p>
            <p className="hero__card-row">Stop-loss {SAMPLE_CALL.stopLoss}</p>
            <p className="hero__card-note">Illustrative sample, not a recommendation.</p>
          </div>

          <div className="hero__sebi">
            <strong>SEBI Registered</strong>
            <span>RA No. {SEBI_NO}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
