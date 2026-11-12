import { Link } from 'react-router-dom';
import { services } from '../../data/services.js';

// 24x24 stroke icons, keyed by `icon` in data/services.js.
const ICONS = {
  advisory: 'M6 20V11M12 20V4M18 20v-6',
  cash: 'M3 17l6-6 4 4 8-8M15 7h6v6',
  stockOptions: 'M8 3v18M16 3v18M6 7h4v8H6zM14 9h4v7h-4z',
  indexOptions: 'M3 3v18h18M7 15l4-4 3 3 5-6',
  commodities: 'M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18zM12 7.5a4.5 4.5 0 1 0 0 9a4.5 4.5 0 1 0 0-9z',
  energy: 'M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z',
};

const styles = `
.services-grid {
  --sg-navy: #0B1B2B;
  --sg-card: #12283D;
  --sg-border: rgba(217, 229, 224, 0.12);
  --sg-emerald-on-dark: #3DD39B;
  --sg-text: #FFFFFF;
  --sg-muted: #A9BAC9;

  position: relative;
  background: var(--sg-navy);
  color: var(--sg-text);
  border-radius: clamp(24px, 4vw, 40px) clamp(24px, 4vw, 40px) 0 0;
  padding: clamp(3.5rem, 7vw, 5.5rem) 0;
}
.services-grid__head {
  max-width: 40rem;
  margin-bottom: clamp(2rem, 4vw, 3rem);
}
.services-grid__title {
  margin: 0 0 0.75rem;
  font-size: clamp(2rem, 4vw, 2.75rem);
  font-weight: 800;
  line-height: 1.15;
  letter-spacing: -0.02em;
}
.services-grid__accent {
  font-family: 'Playfair Display', Georgia, 'Times New Roman', serif;
  font-style: italic;
  font-weight: 700;
  letter-spacing: 0;
  color: var(--sg-emerald-on-dark);
}
.services-grid__sub {
  margin: 0;
  color: var(--sg-muted);
  font-size: 1.0625rem;
}
.services-grid__list {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: clamp(1rem, 2vw, 1.5rem);
  margin: 0;
  padding: 0;
  list-style: none;
}
.services-grid__card {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1.75rem;
  background: var(--sg-card);
  border: 1px solid var(--sg-border);
  border-radius: 20px;
  transition: transform var(--transition), border-color var(--transition), box-shadow var(--transition);
}
.services-grid__card:hover,
.services-grid__card:focus-within {
  transform: translateY(-4px);
  border-color: rgba(61, 211, 155, 0.45);
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.3);
}
.services-grid__icon {
  width: 48px;
  height: 48px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 14px;
  background: rgba(61, 211, 155, 0.12);
  border: 1px solid rgba(61, 211, 155, 0.25);
  color: var(--sg-emerald-on-dark);
  margin-bottom: 0.5rem;
}
.services-grid__card-title {
  margin: 0;
  font-size: 1.1875rem;
  font-weight: 700;
}
.services-grid__desc {
  margin: 0;
  color: var(--sg-muted);
  font-size: 0.9375rem;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: calc(2 * 1.6em);
}
.services-grid__link {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  align-self: flex-start;
  min-height: var(--touch-target);
  margin-top: auto;
  color: var(--sg-emerald-on-dark);
  font-weight: 600;
  font-size: 0.9375rem;
}
.services-grid__link span {
  transition: transform var(--transition);
}
.services-grid__link:hover,
.services-grid__link:focus-visible {
  color: var(--sg-text);
}
.services-grid__link:hover span,
.services-grid__link:focus-visible span {
  transform: translateX(4px);
}
@media (max-width: 1024px) {
  .services-grid__list { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (max-width: 640px) {
  .services-grid__list { grid-template-columns: 1fr; }
  .services-grid__card { padding: 1.5rem; }
}
@media (prefers-reduced-motion: reduce) {
  .services-grid__card,
  .services-grid__link span { transition: none; }
  .services-grid__card:hover,
  .services-grid__card:focus-within { transform: none; }
}
`;

export default function ServicesGrid() {
  return (
    <section className="services-grid" aria-labelledby="services-grid-title">
      <style>{styles}</style>
      <div className="container">
        <header className="services-grid__head">
          <h2 id="services-grid-title" className="services-grid__title">
            What We <span className="services-grid__accent">Offer</span>
          </h2>
          <p className="services-grid__sub">Invest hassle-free with research-backed advice</p>
        </header>

        <ul className="services-grid__list">
          {services.map((service) => (
            <li key={service.id}>
              <article className="services-grid__card">
                <span className="services-grid__icon" aria-hidden="true">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d={ICONS[service.icon]} />
                  </svg>
                </span>
                <h3 className="services-grid__card-title">{service.title}</h3>
                <p className="services-grid__desc">{service.description}</p>
                <Link to="/services" className="services-grid__link" aria-label={'Learn more about ' + service.title}>
                  Learn more <span aria-hidden="true">→</span>
                </Link>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
