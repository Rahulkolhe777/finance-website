import { useSearchParams } from 'react-router-dom';
import ContactForm from '../components/forms/ContactForm.jsx';

// Replace placeholders with your real details.
const PHONE = '+91 70389 09149';
const EMAIL = 'kolhepriya57@gmail.com';
const ADDRESS = 'HP Gas Office, Jalalkheda Road, Panchawati, Katol, Maharashtra 441302';
const OFFICE_HOURS = 'Monday to Sunday, 9:00 AM – 9:00 PM';

const isPlaceholder = (text) => /\[[^\]]+\]/.test(text);

// "/contact?course=stock-market-basics" pre-fills an enrollment enquiry.
const courseMessage = (slug) => {
  const clean = (slug || '').replace(/[^a-z0-9-]/gi, '').slice(0, 80);
  if (!clean) return '';
  const name = clean.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  return 'I would like to enroll in the ' + name + ' course.';
};

const icon = (d) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={d} />
  </svg>
);

const styles = `
.contact-page {
  --ct-navy: #0B1B2B;
  --ct-emerald: #0B7A57;
  --ct-mint: #EEF5F2;
  --ct-border: #D9E5E0;
  --ct-muted: #4F5F6B;
  color: var(--ct-navy);
}
.contact-page__hero {
  background: linear-gradient(#EAF8F1, #fff);
  padding: clamp(3rem, 7vw, 4.5rem) 0 clamp(1.5rem, 3vw, 2rem);
  text-align: center;
}
.contact-page__title { margin: 0 0 0.75rem; font-size: clamp(2.25rem, 5vw, 3.25rem); font-weight: 800; line-height: 1.1; letter-spacing: -0.02em; }
.contact-page__accent { font-family: 'Playfair Display', Georgia, 'Times New Roman', serif; font-style: italic; font-weight: 700; letter-spacing: 0; color: var(--ct-emerald); }
.contact-page__sub { margin: 0 auto; max-width: 36rem; color: var(--ct-muted); font-size: 1.0625rem; }
.contact-page__grid {
  display: grid;
  grid-template-columns: 0.85fr 1.15fr;
  gap: clamp(1.5rem, 4vw, 3rem);
  align-items: start;
  padding-block: clamp(1.5rem, 4vw, 2.5rem);
}
.contact-info { display: grid; gap: 1rem; margin: 0; padding: 0; list-style: none; }
.contact-info__item {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  padding: 1.25rem;
  border: 1px solid var(--ct-border);
  border-radius: 20px;
  background: var(--ct-mint);
}
.contact-info__icon {
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: #fff;
  color: var(--ct-emerald);
}
.contact-info__label { margin: 0 0 0.125rem; font-size: 0.8125rem; font-weight: 800; letter-spacing: 0.06em; text-transform: uppercase; color: var(--ct-emerald); }
.contact-info__value { margin: 0; font-style: normal; line-height: 1.6; overflow-wrap: anywhere; }
.contact-info__value a { color: var(--ct-navy); font-weight: 600; }
.contact-info__value a:hover, .contact-info__value a:focus-visible { color: var(--ct-emerald); }
.contact-page__card {
  padding: clamp(1.5rem, 4vw, 2.25rem);
  border: 1px solid var(--ct-border);
  border-radius: 24px;
  background: #fff;
  box-shadow: 0 20px 44px rgba(11, 27, 43, 0.08);
}
.contact-page__card-title { margin: 0 0 1.25rem; font-size: 1.375rem; font-weight: 800; }
.contact-page__map {
  margin-bottom: clamp(3.5rem, 7vw, 5.5rem);
  min-height: 340px;
  border: 1px solid var(--ct-border);
  border-radius: 24px;
  overflow: hidden;
  background: var(--ct-mint);
}
.contact-page__map iframe { display: block; width: 100%; height: 400px; border: 0; }
.contact-page__map-placeholder { min-height: 340px; display: flex; align-items: center; justify-content: center; color: var(--ct-muted); font-weight: 600; text-align: center; padding: 1rem; }
@media (max-width: 900px) {
  .contact-page__grid { grid-template-columns: 1fr; }
  .contact-page__map iframe { height: 320px; }
}
`;

export default function Contact() {
  const [searchParams] = useSearchParams();
  const initialMessage = courseMessage(searchParams.get('course'));
  const mapSrc = isPlaceholder(ADDRESS) ? null : 'https://www.google.com/maps?q=' + encodeURIComponent(ADDRESS) + '&output=embed';

  return (
    <div className="contact-page">
      <style>{styles}</style>

      <section className="contact-page__hero" aria-labelledby="contact-title">
        <div className="container">
          <h1 id="contact-title" className="contact-page__title">
            Contact <span className="contact-page__accent">Us</span>
          </h1>
          <p className="contact-page__sub">[YOUR TEXT]</p>
        </div>
      </section>

      <div className="container">
        <div className="contact-page__grid">
          <address style={{ fontStyle: 'normal' }}>
            <ul className="contact-info">
              <li className="contact-info__item">
                <span className="contact-info__icon">{icon('M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A17 17 0 0 1 3 5a2 2 0 0 1 2-2z')}</span>
                <div>
                  <p className="contact-info__label">Phone</p>
                  <p className="contact-info__value"><a href={'tel:' + PHONE.replace(/[^\d+]/g, '')}>{PHONE}</a></p>
                </div>
              </li>
              <li className="contact-info__item">
                <span className="contact-info__icon">{icon('M3 6h18v12H3zM3 7l9 6 9-6')}</span>
                <div>
                  <p className="contact-info__label">Email</p>
                  <p className="contact-info__value"><a href={'mailto:' + EMAIL}>{EMAIL}</a></p>
                </div>
              </li>
              <li className="contact-info__item">
                <span className="contact-info__icon">{icon('M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21zM12 7a2.5 2.5 0 1 0 0 5a2.5 2.5 0 1 0 0-5z')}</span>
                <div>
                  <p className="contact-info__label">Address</p>
                  <p className="contact-info__value">{ADDRESS}</p>
                </div>
              </li>
              <li className="contact-info__item">
                <span className="contact-info__icon">{icon('M12 3a9 9 0 1 0 0 18a9 9 0 0 0 0-18zM12 7v5l3 2')}</span>
                <div>
                  <p className="contact-info__label">Office hours</p>
                  <p className="contact-info__value">{OFFICE_HOURS}</p>
                </div>
              </li>
            </ul>
          </address>

          <section className="contact-page__card" aria-labelledby="contact-form-title">
            <h2 id="contact-form-title" className="contact-page__card-title">Send us a message</h2>
            <ContactForm initialMessage={initialMessage} />
          </section>
        </div>

        <div className="contact-page__map">
          {mapSrc ? (
            <iframe
              src={mapSrc}
              title={'Map showing our office: ' + ADDRESS}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          ) : (
            <div className="contact-page__map-placeholder">[GOOGLE MAP: add your office address]</div>
          )}
        </div>
      </div>
    </div>
  );
}
