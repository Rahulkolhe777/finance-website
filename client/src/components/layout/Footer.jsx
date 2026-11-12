import { Link } from 'react-router-dom';
import RiskDisclaimer from '../common/RiskDisclaimer.jsx';

// Replace placeholders with real details.
const SEBI_RA_NO = 'INH000031611';
const BSE_NO = '[NO]';
const ADDRESS = '[YOUR ADDRESS]';
const EMAIL = 'support@[YOUR-DOMAIN].com';
const PHONE = '[YOUR PHONE]';
const SMART_ODR_URL = 'https://smartodr.in/';

// Set `url` for each profile you use; entries without a url are not shown.
const SOCIAL_LINKS = [
  { label: 'YouTube', url: '', icon: 'M22 8.2a3 3 0 0 0-2.1-2.1C18 5.6 12 5.6 12 5.6s-6 0-7.9.5A3 3 0 0 0 2 8.2 31 31 0 0 0 1.6 12 31 31 0 0 0 2 15.8a3 3 0 0 0 2.1 2.1c1.9.5 7.9.5 7.9.5s6 0 7.9-.5a3 3 0 0 0 2.1-2.1 31 31 0 0 0 .4-3.8 31 31 0 0 0-.4-3.8zM10 15V9l5.2 3L10 15z' },
  { label: 'Instagram', url: '', icon: 'M7 2.5h10A4.5 4.5 0 0 1 21.5 7v10a4.5 4.5 0 0 1-4.5 4.5H7A4.5 4.5 0 0 1 2.5 17V7A4.5 4.5 0 0 1 7 2.5zM12 8a4 4 0 1 0 0 8a4 4 0 1 0 0-8zM17.5 6.5h.01' },
  { label: 'LinkedIn', url: '', icon: 'M4 9h4v11H4zM6 3.5a2 2 0 1 1 0 4a2 2 0 0 1 0-4zM10 9h3.8v1.6c.6-1 1.9-1.9 3.7-1.9 3.4 0 4 2.2 4 5.1V20h-4v-5.4c0-1.3 0-2.9-1.8-2.9s-2 1.4-2 2.8V20h-3.7z' },
  { label: 'X (Twitter)', url: '', icon: 'M4 4l7 9.3L4.3 20H6l5.8-5.9L16.4 20H20l-7.3-9.8L19 4h-1.7l-5.3 5.4L8 4z' },
  { label: 'Telegram', url: '', icon: 'M21.5 4.5L2.8 11.7c-1 .4-1 1.6.1 1.9l4.6 1.4 1.8 5.5c.2.7 1.1.9 1.6.4l2.6-2.4 4.7 3.5c.6.4 1.4.1 1.6-.6l3.2-15.2c.2-.9-.6-1.6-1.5-1.2zM9.5 14.6l8.5-7.6' },
];

const COMPANY_LINKS = [
  { to: '/about', label: 'About' },
  { to: '/services', label: 'Services' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/free-trial', label: 'Trial Form' },
  { to: '/complaint-board', label: 'Complaint Board' },
];

const IMPORTANT_LINKS = [
  { to: '/legal/privacy-policy', label: 'Privacy Policy' },
  { to: '/legal/user-consent', label: 'User Consent' },
  { to: '/legal/investor-charter', label: 'Investor Charter' },
  { to: '/legal/disclosure', label: 'Disclosure' },
  { to: '/legal/terms', label: 'Terms & Conditions' },
  { to: '/grievance-redressal', label: 'Grievance Redressal' },
  { href: SMART_ODR_URL, label: 'Smart ODR' },
  { to: '/legal/accessibility', label: 'Accessibility' },
];

const styles = `
.footer {
  --ft-bg: #06111C;
  --ft-text: #E5ECF2;
  --ft-muted: #9FB0C0;
  --ft-line: rgba(217, 229, 224, 0.12);
  --ft-emerald: #3DD39B;

  background: var(--ft-bg);
  color: var(--ft-text);
  padding: clamp(3rem, 6vw, 4.5rem) 0 calc(1.5rem + env(safe-area-inset-bottom, 0px));
  font-size: 0.9375rem;
}
.footer__grid {
  display: grid;
  grid-template-columns: 1.4fr 1fr 1fr 1.2fr;
  gap: clamp(2rem, 4vw, 3rem);
}
.footer__logo {
  display: inline-block;
  margin-bottom: 0.875rem;
  font-size: 1.375rem;
  font-weight: 800;
  color: #fff;
}
.footer__brand-line {
  margin: 0 0 0.75rem;
  font-weight: 700;
  color: var(--ft-text);
}
.footer__reg {
  margin: 0;
  color: var(--ft-muted);
  line-height: 1.8;
}
.footer__heading {
  margin: 0 0 1rem;
  font-size: 0.8125rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #fff;
}
.footer__list {
  display: grid;
  gap: 0.125rem;
  margin: 0;
  padding: 0;
  list-style: none;
}
.footer__link {
  display: inline-flex;
  align-items: center;
  min-height: 36px;
  color: var(--ft-muted);
  transition: color 200ms ease;
}
.footer__link:hover,
.footer__link:focus-visible { color: var(--ft-emerald); }
.footer__contact {
  display: grid;
  gap: 0.75rem;
  margin: 0;
  padding: 0;
  list-style: none;
  color: var(--ft-muted);
  font-style: normal;
}
.footer__contact li {
  display: flex;
  gap: 0.625rem;
  align-items: flex-start;
}
.footer__contact svg {
  flex-shrink: 0;
  margin-top: 0.2em;
  color: var(--ft-emerald);
}
.footer__contact a { color: var(--ft-muted); overflow-wrap: anywhere; }
.footer__contact a:hover,
.footer__contact a:focus-visible { color: var(--ft-emerald); }
.footer__social {
  display: flex;
  flex-wrap: wrap;
  gap: 0.625rem;
  margin: 2.5rem 0 0;
  padding: 0;
  list-style: none;
}
.footer__social a {
  width: 44px;
  height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--ft-line);
  border-radius: 9999px;
  color: var(--ft-text);
  transition: background-color 200ms ease, border-color 200ms ease, color 200ms ease;
}
.footer__social a:hover,
.footer__social a:focus-visible {
  background: linear-gradient(90deg, #087F58, #0E6E8C);
  border-color: transparent;
  color: #fff;
}
.footer__divider {
  height: 1px;
  margin: 2rem 0 1.5rem;
  border: 0;
  background: var(--ft-line);
}
.footer__sr {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}
.footer__copy {
  margin: 1.5rem 0 0;
  font-size: 0.8125rem;
  color: var(--ft-muted);
}
@media (max-width: 1024px) {
  .footer__grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (max-width: 560px) {
  .footer__grid { grid-template-columns: 1fr; }
  .footer__link { min-height: 44px; }
}
`;

// Render helper (not a component) for the small contact icons.
const contactIcon = (d) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={d} />
  </svg>
);

export default function Footer() {
  const socials = SOCIAL_LINKS.filter((s) => s.url);

  return (
    <footer className="footer">
      <style>{styles}</style>
      <div className="container">
        <div className="footer__grid">
          <div>
            <Link to="/" className="footer__logo">Priya Kolhe</Link>
            <p className="footer__brand-line">SEBI Registered Research Analyst</p>
            <p className="footer__reg">
              SEBI RA No: {SEBI_RA_NO}
              <br />
              BSE Enlistment No: {BSE_NO}
            </p>
          </div>

          <nav aria-labelledby="footer-company">
            <h2 id="footer-company" className="footer__heading">Company</h2>
            <ul className="footer__list">
              {COMPANY_LINKS.map((link) => (
                <li key={link.to}><Link to={link.to} className="footer__link">{link.label}</Link></li>
              ))}
            </ul>
          </nav>

          <nav aria-labelledby="footer-important">
            <h2 id="footer-important" className="footer__heading">Important</h2>
            <ul className="footer__list">
              {IMPORTANT_LINKS.map((link) => (
                <li key={link.label}>
                  {link.href ? (
                    <a href={link.href} className="footer__link" target="_blank" rel="noopener noreferrer">
                      {link.label}
                      <span className="footer__sr"> (opens in a new tab)</span>
                    </a>
                  ) : (
                    <Link to={link.to} className="footer__link">{link.label}</Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="footer__heading">Get in Touch</h2>
            <address>
              <ul className="footer__contact">
                <li>
                  {contactIcon('M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21zM12 7a2.5 2.5 0 1 0 0 5a2.5 2.5 0 1 0 0-5z')}
                  <span>{ADDRESS}</span>
                </li>
                <li>
                  {contactIcon('M3 6h18v12H3zM3 7l9 6 9-6')}
                  <a href={'mailto:' + EMAIL}>{EMAIL}</a>
                </li>
                <li>
                  {contactIcon('M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A17 17 0 0 1 3 5a2 2 0 0 1 2-2z')}
                  <a href={'tel:' + PHONE.replace(/[^\d+]/g, '')}>{PHONE}</a>
                </li>
              </ul>
            </address>
          </div>
        </div>

        {socials.length > 0 && (
          <ul className="footer__social" aria-label="Social media">
            {socials.map((social) => (
              <li key={social.label}>
                <a href={social.url} target="_blank" rel="noopener noreferrer" aria-label={social.label + ' (opens in a new tab)'}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d={social.icon} />
                  </svg>
                </a>
              </li>
            ))}
          </ul>
        )}

        <hr className="footer__divider" />
        <RiskDisclaimer variant="dark" />
        <p className="footer__copy">&copy; {new Date().getFullYear()} Priya Kolhe. All rights reserved.</p>
      </div>
    </footer>
  );
}
