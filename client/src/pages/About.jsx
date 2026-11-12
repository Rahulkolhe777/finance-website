import { useState } from 'react';
import { Link } from 'react-router-dom';

// Replace every [PLACEHOLDER] with your real details.
const ANALYST_NAME = 'Priya Kolhe';
const ANALYST_PHOTO = '/images/analyst.webp';
const STORY = ['[TEXT]'];
const CREDENTIALS = [
  { title: 'SEBI Registered Research Analyst', detail: 'Registration No. INH000031611' },
  { title: 'NISM Certified', detail: 'NISM Series XV – Research Analyst Certification' },
  { title: 'Qualifications', detail: '[LIST]' },
];
const VISION = '[TEXT]';
const MISSION = '[TEXT]';
const TEAM = [
  { name: '[NAME]', role: '[ROLE]', photo: '' },
  { name: '[NAME]', role: '[ROLE]', photo: '' },
  { name: '[NAME]', role: '[ROLE]', photo: '' },
];
const OFFICE_ADDRESS = 'HP Gas Office, Jalalkheda Road, Panchawati, Katol, Maharashtra 441302';

const isPlaceholder = (text) => /^\[[^\]]+\]$/.test(text.trim());
const initials = (name) =>
  isPlaceholder(name) ? '' : name.split(/\s+/).map((part) => part[0]).slice(0, 2).join('').toUpperCase();

const styles = `
.about {
  --ab-navy: #0B1B2B;
  --ab-card: #12283D;
  --ab-emerald: #0B7A57;
  --ab-emerald-on-dark: #3DD39B;
  --ab-mint: #EEF5F2;
  --ab-border: #D9E5E0;
  --ab-muted: #4F5F6B;
  --ab-gradient: linear-gradient(90deg, #087F58, #0E6E8C);
  color: var(--ab-navy);
}
.about__section { padding: clamp(3.5rem, 7vw, 5.5rem) 0; }
.about__eyebrow {
  display: inline-block;
  margin-bottom: 0.75rem;
  padding: 0.375rem 0.875rem;
  border: 1px solid rgba(11, 122, 87, 0.25);
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.8);
  color: var(--ab-emerald);
  font-size: 0.8125rem;
  font-weight: 700;
}
.about__h2 {
  margin: 0 0 1rem;
  font-size: clamp(1.875rem, 4vw, 2.5rem);
  font-weight: 800;
  line-height: 1.15;
  letter-spacing: -0.02em;
}
.about__accent {
  font-family: 'Playfair Display', Georgia, 'Times New Roman', serif;
  font-style: italic;
  font-weight: 700;
  letter-spacing: 0;
  color: var(--ab-emerald);
}
.about__text {
  margin: 0 0 1rem;
  font-size: 1.0625rem;
  line-height: 1.75;
  color: var(--ab-muted);
}

/* hero */
.about-hero {
  background: linear-gradient(#EAF8F1, #fff);
  padding: clamp(3rem, 7vw, 5rem) 0;
}
.about-hero__grid {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: clamp(2rem, 5vw, 4rem);
  align-items: center;
}
.about-hero__title {
  margin: 0 0 1rem;
  font-size: clamp(2.25rem, 5vw, 3.5rem);
  font-weight: 800;
  line-height: 1.08;
  letter-spacing: -0.02em;
}
.about-hero__actions { display: flex; flex-wrap: wrap; gap: 0.75rem; margin-top: 1.75rem; }
.about__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;
  padding: 0 1.75rem;
  border-radius: 9999px;
  font-weight: 700;
}
.about__btn--primary { background: var(--ab-gradient); color: #fff; }
.about__btn--primary:hover, .about__btn--primary:focus-visible { color: #fff; box-shadow: 0 10px 22px rgba(8, 127, 88, 0.3); }
.about__btn--ghost { border: 1.5px solid var(--ab-navy); color: var(--ab-navy); background: #fff; }
.about__btn--ghost:hover, .about__btn--ghost:focus-visible { background: var(--ab-navy); color: #fff; }
.about-hero__photo-wrap {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  min-height: 380px;
}
.about-hero__photo-wrap::before {
  content: '';
  position: absolute;
  inset: 10% 6% 0;
  border-radius: 24px;
  background: linear-gradient(150deg, #BFE8DA, #0E6E8C);
  transform: rotate(-4deg);
}
.about-hero__photo {
  position: relative;
  width: min(100%, 380px);
  max-height: 460px;
  object-fit: contain;
  object-position: bottom;
}
.about-hero__photo-fallback {
  position: relative;
  width: min(80%, 300px);
  aspect-ratio: 3 / 4;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 24px 24px 0 0;
  background: rgba(255, 255, 255, 0.4);
  font-weight: 700;
}

/* credentials */
.about-creds { background: var(--ab-navy); color: #fff; border-radius: clamp(24px, 4vw, 40px); }
.about-creds .about__accent { color: var(--ab-emerald-on-dark); }
.about-creds__list {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: clamp(1rem, 2vw, 1.5rem);
  margin: 2rem 0 0;
  padding: 0;
  list-style: none;
}
.about-creds__card {
  height: 100%;
  padding: 1.75rem;
  border: 1px solid rgba(217, 229, 224, 0.12);
  border-radius: 20px;
  background: var(--ab-card);
}
.about-creds__icon {
  width: 44px;
  height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  border-radius: 12px;
  background: rgba(61, 211, 155, 0.12);
  color: var(--ab-emerald-on-dark);
}
.about-creds__title { margin: 0 0 0.375rem; font-size: 1.125rem; font-weight: 700; }
.about-creds__detail { margin: 0; color: #A9BAC9; }

/* vision & mission */
.about-vm__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: clamp(1rem, 2vw, 1.5rem);
}
.about-vm__card {
  padding: clamp(1.75rem, 3vw, 2.25rem);
  border: 1px solid var(--ab-border);
  border-radius: 24px;
  background: var(--ab-mint);
}
.about-vm__label {
  margin: 0 0 0.75rem;
  font-size: 1.5rem;
  font-weight: 800;
}

/* team */
.about-team__list {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: clamp(1rem, 2vw, 1.5rem);
  margin: 2rem 0 0;
  padding: 0;
  list-style: none;
}
.about-team__card {
  height: 100%;
  padding: 1.75rem;
  border: 1px solid var(--ab-border);
  border-radius: 20px;
  background: #fff;
  text-align: center;
  transition: transform 200ms ease, box-shadow 200ms ease;
}
.about-team__card:hover { transform: translateY(-4px); box-shadow: 0 14px 30px rgba(11, 27, 43, 0.08); }
.about-team__avatar {
  width: 96px;
  height: 96px;
  margin: 0 auto 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 9999px;
  background: var(--ab-mint);
  color: var(--ab-emerald);
  font-size: 1.5rem;
  font-weight: 800;
}
.about-team__avatar img { width: 100%; height: 100%; object-fit: cover; }
.about-team__name { margin: 0; font-size: 1.125rem; font-weight: 800; }
.about-team__role { margin: 0.25rem 0 0; color: var(--ab-muted); }

/* office */
.about-office__grid {
  display: grid;
  grid-template-columns: 0.8fr 1.2fr;
  gap: clamp(1.5rem, 3vw, 2.5rem);
  align-items: stretch;
}
.about-office__address {
  margin: 0;
  font-style: normal;
  font-size: 1.0625rem;
  line-height: 1.75;
  color: var(--ab-muted);
}
.about-office__map {
  width: 100%;
  min-height: 320px;
  height: 100%;
  border: 1px solid var(--ab-border);
  border-radius: 24px;
  overflow: hidden;
  background: var(--ab-mint);
}
.about-office__map iframe { display: block; width: 100%; height: 100%; min-height: 320px; border: 0; }
.about-office__map-placeholder {
  height: 100%;
  min-height: 320px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--ab-muted);
  font-weight: 600;
}

@media (max-width: 900px) {
  .about-hero__grid,
  .about-office__grid { grid-template-columns: 1fr; }
  .about-hero__photo-wrap { min-height: 320px; max-width: 420px; width: 100%; margin: 0 auto; }
}
@media (max-width: 1024px) {
  .about-creds__list,
  .about-team__list { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (max-width: 640px) {
  .about-creds__list,
  .about-team__list,
  .about-vm__grid { grid-template-columns: 1fr; }
}
@media (prefers-reduced-motion: reduce) {
  .about-team__card { transition: none; }
  .about-team__card:hover { transform: none; }
}
`;

export default function About() {
  const [photoFailed, setPhotoFailed] = useState(false);
  const mapSrc = isPlaceholder(OFFICE_ADDRESS)
    ? null
    : 'https://www.google.com/maps?q=' + encodeURIComponent(OFFICE_ADDRESS) + '&output=embed';

  return (
    <div className="about">
      <style>{styles}</style>

      <section className="about-hero" aria-labelledby="about-title">
        <div className="container about-hero__grid">
          <div>
            <span className="about__eyebrow">About Us</span>
            <h1 id="about-title" className="about-hero__title">
              Meet <span className="about__accent">{ANALYST_NAME}</span>
            </h1>
            <p className="about__text">SEBI Registered Research Analyst</p>
            <div className="about-hero__actions">
              <Link to="/free-trial" className="about__btn about__btn--primary">Start Free Trial</Link>
              <Link to="/contact" className="about__btn about__btn--ghost">Contact Us</Link>
            </div>
          </div>
          <div className="about-hero__photo-wrap">
            {photoFailed ? (
              <div className="about-hero__photo-fallback">[ANALYST PHOTO]</div>
            ) : (
              <img
                className="about-hero__photo"
                src={ANALYST_PHOTO}
                alt={ANALYST_NAME + ', SEBI Registered Research Analyst'}
                width="380"
                height="460"
                onError={() => setPhotoFailed(true)}
              />
            )}
          </div>
        </div>
      </section>

      <section className="about__section" aria-labelledby="about-story">
        <div className="container" style={{ maxWidth: 820 }}>
          <h2 id="about-story" className="about__h2">
            Our <span className="about__accent">Story</span>
          </h2>
          {STORY.map((paragraph, index) => (
            <p key={index} className="about__text">{paragraph}</p>
          ))}
        </div>
      </section>

      <div className="container">
        <section className="about__section about-creds" aria-labelledby="about-creds">
          <div style={{ paddingInline: 'clamp(1.25rem, 4vw, 3rem)' }}>
            <h2 id="about-creds" className="about__h2">
              Our <span className="about__accent">Credentials</span>
            </h2>
            <ul className="about-creds__list">
              {CREDENTIALS.map((cred) => (
                <li key={cred.title}>
                  <div className="about-creds__card">
                    <span className="about-creds__icon" aria-hidden="true">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 3l7 3v5c0 4.5-3 8.3-7 10-4-1.7-7-5.5-7-10V6l7-3zM9 12l2 2 4-4" />
                      </svg>
                    </span>
                    <h3 className="about-creds__title">{cred.title}</h3>
                    <p className="about-creds__detail">{cred.detail}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>

      <section className="about__section" aria-labelledby="about-vm">
        <div className="container">
          <h2 id="about-vm" className="about__h2" style={{ textAlign: 'center', marginBottom: '2rem' }}>
            Vision &amp; <span className="about__accent">Mission</span>
          </h2>
          <div className="about-vm__grid">
            <article className="about-vm__card">
              <h3 className="about-vm__label">Vision</h3>
              <p className="about__text" style={{ marginBottom: 0 }}>{VISION}</p>
            </article>
            <article className="about-vm__card">
              <h3 className="about-vm__label">Mission</h3>
              <p className="about__text" style={{ marginBottom: 0 }}>{MISSION}</p>
            </article>
          </div>
        </div>
      </section>

      <section className="about__section" style={{ paddingTop: 0 }} aria-labelledby="about-team">
        <div className="container">
          <h2 id="about-team" className="about__h2" style={{ textAlign: 'center' }}>
            Our <span className="about__accent">Team</span>
          </h2>
          <ul className="about-team__list">
            {TEAM.map((member, index) => (
              <li key={member.name + index}>
                <article className="about-team__card">
                  <div className="about-team__avatar" aria-hidden={!member.photo}>
                    {member.photo ? (
                      <img src={member.photo} alt={member.name + ', ' + member.role} loading="lazy" decoding="async" width="96" height="96" />
                    ) : (
                      initials(member.name) || (
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                          <path d="M12 12a4 4 0 1 0 0-8a4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0" />
                        </svg>
                      )
                    )}
                  </div>
                  <h3 className="about-team__name">{member.name}</h3>
                  <p className="about-team__role">{member.role}</p>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="about__section" style={{ paddingTop: 0 }} aria-labelledby="about-office">
        <div className="container about-office__grid">
          <div>
            <h2 id="about-office" className="about__h2">
              Registered <span className="about__accent">Office</span>
            </h2>
            <address className="about-office__address">{OFFICE_ADDRESS}</address>
          </div>
          <div className="about-office__map">
            {mapSrc ? (
              <iframe
                src={mapSrc}
                title={'Map showing our registered office: ' + OFFICE_ADDRESS}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            ) : (
              <div className="about-office__map-placeholder">[GOOGLE MAP: add your office address]</div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
