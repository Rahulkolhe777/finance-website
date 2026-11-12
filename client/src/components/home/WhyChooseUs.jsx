// Only provable claims — replace each [YOUR CLAIMS] with a statement you can substantiate.
const REASONS = [
  {
    title: 'Expert Guidance',
    description: 'Calls built from technical and fundamental research.',
    icon: 'M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.4.9 1 .9 1.6V16h5.2v-.5c0-.6.3-1.2.9-1.6A6 6 0 0 0 12 3z',
  },
  {
    title: 'Certified Analyst',
    description: 'SEBI-registered and NISM Series XV certified.',
    icon: 'M12 3l2.4 1.8 3 .1.9 2.9 2.4 1.8-.9 2.9.9 2.9-2.4 1.8-.9 2.9-3 .1L12 21l-2.4-1.8-3-.1-.9-2.9-2.4-1.8.9-2.9-.9-2.9 2.4-1.8.9-2.9 3-.1L12 3zM8.5 12l2.5 2.5 4.5-5',
  },
  {
    title: 'Trusted Brokers',
    description: 'Trade through any SEBI-registered broker of your choice.',
    icon: 'M3 21h18M5 21V10M19 21V10M9 21v-7M15 21v-7M2 10l10-6 10 6H2z',
  },
  {
    title: 'Support Mon–Sun',
    description: 'Help available 9 AM – 9 PM, every day.',
    icon: 'M4 14v-2a8 8 0 0 1 16 0v2M4 14a2 2 0 0 0 2 2h1v-5H6a2 2 0 0 0-2 2zM20 14a2 2 0 0 1-2 2h-1v-5h1a2 2 0 0 1 2 2zM17 16v1a3 3 0 0 1-3 3h-2',
  },
];

const styles = `
.why-us {
  --wu-navy: #0B1B2B;
  --wu-emerald: #0B7A57;
  --wu-mint: #EEF5F2;
  --wu-border: #D9E5E0;
  --wu-muted: #4F5F6B;

  background: #fff;
  padding: clamp(3.5rem, 7vw, 5.5rem) 0;
}
.why-us__head {
  text-align: center;
  max-width: 40rem;
  margin: 0 auto clamp(2rem, 4vw, 3rem);
}
.why-us__title {
  margin: 0 0 0.75rem;
  font-size: clamp(2rem, 4vw, 2.75rem);
  font-weight: 800;
  line-height: 1.15;
  letter-spacing: -0.02em;
  color: var(--wu-navy);
}
.why-us__accent {
  font-family: 'Playfair Display', Georgia, 'Times New Roman', serif;
  font-style: italic;
  font-weight: 700;
  letter-spacing: 0;
  color: var(--wu-emerald);
}
.why-us__sub {
  margin: 0;
  color: var(--wu-muted);
  font-size: 1.0625rem;
}
.why-us__list {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: clamp(1rem, 2vw, 1.5rem);
  margin: 0;
  padding: 0;
  list-style: none;
}
.why-us__card {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  padding: 1.75rem 1.5rem;
  background: var(--wu-mint);
  border: 1px solid var(--wu-border);
  border-radius: 20px;
  transition: transform 200ms ease, box-shadow 200ms ease, background-color 200ms ease;
}
.why-us__card:hover {
  transform: translateY(-4px);
  background: #fff;
  box-shadow: 0 12px 28px rgba(11, 27, 43, 0.08);
}
.why-us__icon {
  width: 48px;
  height: 48px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.375rem;
  border-radius: 14px;
  background: #fff;
  border: 1px solid var(--wu-border);
  color: var(--wu-emerald);
}
.why-us__card-title {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 800;
  color: var(--wu-navy);
}
.why-us__desc {
  margin: 0;
  font-size: 0.9375rem;
  line-height: 1.6;
  color: var(--wu-muted);
}
@media (max-width: 1024px) {
  .why-us__list { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (max-width: 560px) {
  .why-us__list { grid-template-columns: 1fr; }
}
@media (prefers-reduced-motion: reduce) {
  .why-us__card { transition: none; }
  .why-us__card:hover { transform: none; }
}
`;

export default function WhyChooseUs() {
  return (
    <section className="why-us" aria-labelledby="why-us-title">
      <style>{styles}</style>
      <div className="container">
        <header className="why-us__head">
          <h2 id="why-us-title" className="why-us__title">
            Why Choose <span className="why-us__accent">Us</span>
          </h2>
          <p className="why-us__sub">Knowledge is the key to informed investment decisions</p>
        </header>

        <ul className="why-us__list">
          {REASONS.map((reason) => (
            <li key={reason.title}>
              <article className="why-us__card">
                <span className="why-us__icon" aria-hidden="true">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d={reason.icon} />
                  </svg>
                </span>
                <h3 className="why-us__card-title">{reason.title}</h3>
                <p className="why-us__desc">{reason.description}</p>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
