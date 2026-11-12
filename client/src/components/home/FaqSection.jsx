import Accordion from '../common/Accordion.jsx';
import { faqs } from '../../data/faqs.js';

const hasPlaceholder = (text) => /\[[^\]]+\]/.test(text);

// FAQPage structured data, built once at module load. Answers still containing
// [PLACEHOLDERS] are left out so unfinished text never reaches search engines.
const completedFaqs = faqs.filter((faq) => !hasPlaceholder(faq.question) && !hasPlaceholder(faq.answer));
const faqSchemaJson = completedFaqs.length
  ? JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: completedFaqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: { '@type': 'Answer', text: faq.answer },
      })),
    }).replace(/</g, '\\u003c')
  : null;

const styles = `
.faq {
  --fq-navy: #0B1B2B;
  --fq-emerald: #0B7A57;
  --fq-muted: #5B6B78;

  background: #fff;
  padding: clamp(3.5rem, 7vw, 5.5rem) 0;
}
.faq__inner {
  max-width: 820px;
  margin: 0 auto;
}
.faq__head {
  text-align: center;
  margin-bottom: clamp(2rem, 4vw, 2.75rem);
}
.faq__title {
  margin: 0;
  font-size: clamp(2rem, 4vw, 2.75rem);
  font-weight: 800;
  line-height: 1.15;
  letter-spacing: -0.02em;
  color: var(--fq-navy);
}
.faq__accent {
  font-family: 'Playfair Display', Georgia, 'Times New Roman', serif;
  font-style: italic;
  font-weight: 700;
  letter-spacing: 0;
  color: var(--fq-emerald);
}
`;

export default function FaqSection() {
  if (faqs.length === 0) return null;

  return (
    <section className="faq" aria-labelledby="faq-title">
      <style>{styles}</style>
      {faqSchemaJson && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqSchemaJson }} />}
      <div className="container faq__inner">
        <header className="faq__head">
          <h2 id="faq-title" className="faq__title">
            Frequently Asked <span className="faq__accent">Questions</span>
          </h2>
        </header>
        <Accordion items={faqs} />
      </div>
    </section>
  );
}
