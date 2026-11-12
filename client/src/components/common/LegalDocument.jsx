import { useEffect, useState } from 'react';

const styles = `
.legal {
  --lg-navy: #0B1B2B;
  --lg-emerald: #0B7A57;
  --lg-mint: #EEF5F2;
  --lg-border: #D9E5E0;
  --lg-muted: #4F5F6B;
  color: var(--lg-navy);
}
.legal__hero { background: linear-gradient(#EAF8F1, #fff); padding: clamp(2.5rem, 6vw, 4rem) 0 clamp(1.25rem, 3vw, 2rem); }
.legal__title { margin: 0 0 0.75rem; font-size: clamp(2rem, 5vw, 3rem); font-weight: 800; line-height: 1.1; letter-spacing: -0.02em; }
.legal__meta { display: flex; flex-wrap: wrap; align-items: center; gap: 0.75rem 1.25rem; margin: 0; color: var(--lg-muted); font-size: 0.9375rem; }
.legal__print {
  min-height: 44px;
  padding: 0 1.125rem;
  border: 1.5px solid var(--lg-navy);
  border-radius: 9999px;
  background: #fff;
  color: var(--lg-navy);
  font: inherit;
  font-size: 0.875rem;
  font-weight: 700;
  cursor: pointer;
}
.legal__print:hover, .legal__print:focus-visible { background: var(--lg-navy); color: #fff; }
.legal__layout {
  display: grid;
  grid-template-columns: 260px minmax(0, 1fr);
  gap: clamp(1.5rem, 4vw, 3.5rem);
  align-items: start;
  padding-block: clamp(1.5rem, 4vw, 2.5rem) clamp(3.5rem, 7vw, 5.5rem);
}
.legal__toc { position: sticky; top: calc(var(--header-height) + 1.5rem); max-height: calc(100vh - var(--header-height) - 3rem); overflow-y: auto; }
.legal__toc-title { margin: 0 0 0.75rem; font-size: 0.8125rem; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; color: var(--lg-muted); }
.legal__toc ol { display: grid; gap: 0.125rem; margin: 0; padding: 0; list-style: none; border-left: 2px solid var(--lg-border); }
.legal__toc a {
  display: block;
  margin-left: -2px;
  padding: 0.5rem 0.875rem;
  border-left: 2px solid transparent;
  color: var(--lg-muted);
  font-size: 0.9375rem;
  line-height: 1.4;
}
.legal__toc a:hover { color: var(--lg-emerald); }
.legal__toc a.is-active { border-left-color: var(--lg-emerald); color: var(--lg-navy); font-weight: 700; }
.legal__toc-mobile { display: none; margin-bottom: 1.5rem; border: 1px solid var(--lg-border); border-radius: 16px; background: var(--lg-mint); }
.legal__toc-mobile summary { min-height: 48px; display: flex; align-items: center; padding: 0 1.25rem; font-weight: 700; cursor: pointer; }
.legal__toc-mobile ol { margin: 0; padding: 0 1.25rem 1rem 2.5rem; display: grid; gap: 0.5rem; }
.legal__toc-mobile a { color: var(--lg-navy); }
.legal__content { max-width: 760px; font-size: 1.0625rem; line-height: 1.8; }
.legal__intro { margin: 0 0 2rem; color: var(--lg-muted); }
.legal__section { scroll-margin-top: calc(var(--header-height) + 1.5rem); padding-bottom: 1.75rem; margin-bottom: 1.75rem; border-bottom: 1px solid var(--lg-border); }
.legal__section:last-child { border-bottom: 0; }
.legal__section h2 { margin: 0 0 0.75rem; font-size: clamp(1.25rem, 2.5vw, 1.5rem); font-weight: 800; line-height: 1.3; }
.legal__section p { margin: 0 0 1rem; color: #24343F; white-space: pre-line; }
.legal__section p:last-child { margin-bottom: 0; }
@media (max-width: 960px) {
  .legal__layout { grid-template-columns: 1fr; }
  .legal__toc { display: none; }
  .legal__toc-mobile { display: block; }
}
@media print {
  .info-bar, .header, .footer, .skip-link, .whatsapp-fab, .modal__backdrop,
  .legal__toc, .legal__toc-mobile, .legal__print { display: none !important; }
  body { background: #fff; color: #000; font-size: 11pt; }
  .legal__hero { background: none; padding: 0 0 12pt; }
  .legal__title { font-size: 20pt; }
  .legal__layout { display: block; padding: 0; }
  .legal__content { max-width: none; font-size: 11pt; line-height: 1.5; }
  .legal__section { break-inside: avoid-page; border-bottom: 0; padding-bottom: 0; margin-bottom: 14pt; }
  .legal__section h2 { font-size: 13pt; break-after: avoid; }
  .legal__section p { color: #000; orphans: 3; widows: 3; }
  a { color: #000; text-decoration: underline; }
}
`;

const paragraphs = (body) => (Array.isArray(body) ? body : String(body).split(/\n{2,}/));

// Shared layout for legal pages: sticky table of contents, last-updated date, print styles.
// sections: [{ id, heading, body: string | string[] }]
export default function LegalDocument({ title, lastUpdated, intro, sections }) {
  const [activeId, setActiveId] = useState(sections[0]?.id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length) setActiveId(visible[0].target.id);
      },
      { rootMargin: '-20% 0px -70% 0px' }
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [sections]);

  const tocLinks = (withActive) =>
    sections.map((s) => (
      <li key={s.id}>
        <a
          href={'#' + s.id}
          className={withActive && activeId === s.id ? 'is-active' : undefined}
          aria-current={withActive && activeId === s.id ? 'location' : undefined}
        >
          {s.heading}
        </a>
      </li>
    ));

  return (
    <article className="legal" aria-labelledby="legal-title">
      <style>{styles}</style>

      <header className="legal__hero">
        <div className="container">
          <h1 id="legal-title" className="legal__title">{title}</h1>
          <p className="legal__meta">
            <span>Last updated: <time>{lastUpdated}</time></span>
            <button type="button" className="legal__print" onClick={() => window.print()}>Print / Save as PDF</button>
          </p>
        </div>
      </header>

      <div className="container legal__layout">
        <nav className="legal__toc" aria-label="Table of contents">
          <p className="legal__toc-title">On this page</p>
          <ol>{tocLinks(true)}</ol>
        </nav>

        <div className="legal__content">
          <details className="legal__toc-mobile">
            <summary>On this page</summary>
            <nav aria-label="Table of contents">
              <ol>{tocLinks(false)}</ol>
            </nav>
          </details>

          {intro && <p className="legal__intro">{intro}</p>}

          {sections.map((s) => (
            <section key={s.id} id={s.id} className="legal__section" aria-labelledby={s.id + '-heading'}>
              <h2 id={s.id + '-heading'}>{s.heading}</h2>
              {paragraphs(s.body).map((text, i) => <p key={i}>{text}</p>)}
            </section>
          ))}
        </div>
      </div>
    </article>
  );
}
