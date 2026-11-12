import { Link } from 'react-router-dom';

// Replace placeholders with your real details.
const OFFICER = {
  name: '[OFFICER NAME]',
  designation: 'Grievance Officer',
  email: '[OFFICER EMAIL]',
  phone: '[OFFICER PHONE]',
  hours: '[HOURS]',
};
const SCORES_URL = 'https://scores.sebi.gov.in/';
const SMART_ODR_URL = 'https://smartodr.in/';

// Response timelines: [DETAILS]
const TIMELINES = [
  { stage: 'Acknowledgement of complaint', time: '[DETAILS]' },
  { stage: 'Resolution of complaint', time: '[DETAILS]' },
  { stage: 'Escalation to Grievance Officer', time: '[DETAILS]' },
];

const isPlaceholder = (text) => /\[[^\]]+\]/.test(text);

const styles = `
.grievance {
  --gr-navy: #0B1B2B;
  --gr-card: #12283D;
  --gr-emerald: #0B7A57;
  --gr-emerald-on-dark: #3DD39B;
  --gr-mint: #EEF5F2;
  --gr-border: #D9E5E0;
  --gr-muted: #4F5F6B;
  color: var(--gr-navy);
}
.grievance__hero { background: linear-gradient(#EAF8F1, #fff); padding: clamp(3rem, 7vw, 4.5rem) 0 clamp(1.5rem, 3vw, 2rem); text-align: center; }
.grievance__title { margin: 0 0 0.75rem; font-size: clamp(2.25rem, 5vw, 3.25rem); font-weight: 800; line-height: 1.1; letter-spacing: -0.02em; }
.grievance__accent { font-family: 'Playfair Display', Georgia, 'Times New Roman', serif; font-style: italic; font-weight: 700; letter-spacing: 0; color: var(--gr-emerald); }
.grievance__sub { margin: 0 auto; max-width: 38rem; color: var(--gr-muted); font-size: 1.0625rem; }
.grievance__body { display: grid; gap: clamp(2rem, 4vw, 3rem); padding-block: clamp(1.5rem, 4vw, 2.5rem) clamp(3.5rem, 7vw, 5.5rem); }
.grievance__h2 { margin: 0 0 1.25rem; font-size: clamp(1.375rem, 3vw, 1.75rem); font-weight: 800; letter-spacing: -0.01em; }
.officer {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 1.5rem;
  align-items: center;
  padding: clamp(1.5rem, 4vw, 2.25rem);
  border-radius: 24px;
  background: var(--gr-navy);
  color: #fff;
}
.officer__avatar { width: 72px; height: 72px; display: flex; align-items: center; justify-content: center; border-radius: 9999px; background: rgba(61, 211, 155, 0.12); color: var(--gr-emerald-on-dark); }
.officer__name { margin: 0; font-size: 1.375rem; font-weight: 800; }
.officer__role { margin: 0.125rem 0 1rem; color: var(--gr-emerald-on-dark); font-weight: 700; }
.officer__contacts { display: flex; flex-wrap: wrap; gap: 0.75rem 1.75rem; margin: 0; padding: 0; list-style: none; color: #C9D5DF; }
.officer__contacts a { color: #fff; font-weight: 600; text-decoration: underline; overflow-wrap: anywhere; }
.officer__contacts a:hover, .officer__contacts a:focus-visible { color: var(--gr-emerald-on-dark); }
.timelines__scroll { overflow-x: auto; border: 1px solid var(--gr-border); border-radius: 20px; }
.timelines__table { width: 100%; min-width: 420px; border-collapse: collapse; }
.timelines__table th, .timelines__table td { padding: 0.875rem 1.25rem; text-align: left; border-bottom: 1px solid var(--gr-border); }
.timelines__table thead th { background: var(--gr-mint); font-weight: 800; }
.timelines__table tbody tr:last-child th, .timelines__table tbody tr:last-child td { border-bottom: 0; }
.timelines__table tbody th { font-weight: 600; }
.grievance__links { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1rem; }
.grievance__link-card { display: flex; flex-direction: column; gap: 0.375rem; padding: 1.5rem; border: 1px solid var(--gr-border); border-radius: 20px; background: var(--gr-mint); color: var(--gr-navy); transition: transform 200ms ease, box-shadow 200ms ease; }
.grievance__link-card:hover, .grievance__link-card:focus-visible { transform: translateY(-3px); box-shadow: 0 12px 26px rgba(11, 27, 43, 0.08); color: var(--gr-navy); }
.grievance__link-card strong { font-size: 1.0625rem; }
.grievance__link-card span { color: var(--gr-muted); font-size: 0.9375rem; }
.grievance__link-card em { margin-top: auto; padding-top: 0.5rem; color: var(--gr-emerald); font-style: normal; font-weight: 700; }
@media (max-width: 900px) { .grievance__links { grid-template-columns: 1fr; } }
@media (max-width: 480px) { .officer { grid-template-columns: 1fr; } }
@media (prefers-reduced-motion: reduce) { .grievance__link-card { transition: none; } .grievance__link-card:hover { transform: none; } }
`;

const srOnly = { position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' };

export default function GrievanceRedressal() {
  return (
    <div className="grievance">
      <style>{styles}</style>

      <section className="grievance__hero" aria-labelledby="grievance-title">
        <div className="container">
          <h1 id="grievance-title" className="grievance__title">
            Grievance <span className="grievance__accent">Redressal</span>
          </h1>
          <p className="grievance__sub">[YOUR TEXT]</p>
        </div>
      </section>

      <div className="container grievance__body">
        <section aria-labelledby="officer-title">
          <h2 id="officer-title" className="grievance__h2">Grievance Officer</h2>
          <div className="officer">
            <div className="officer__avatar" aria-hidden="true">
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M12 12a4 4 0 1 0 0-8a4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0" />
              </svg>
            </div>
            <div>
              <p className="officer__name">{OFFICER.name}</p>
              <p className="officer__role">{OFFICER.designation}</p>
              <ul className="officer__contacts">
                <li>Email: {isPlaceholder(OFFICER.email) ? OFFICER.email : <a href={'mailto:' + OFFICER.email}>{OFFICER.email}</a>}</li>
                <li>Phone: {isPlaceholder(OFFICER.phone) ? OFFICER.phone : <a href={'tel:' + OFFICER.phone.replace(/[^\d+]/g, '')}>{OFFICER.phone}</a>}</li>
                <li>Hours: {OFFICER.hours}</li>
              </ul>
            </div>
          </div>
        </section>

        <section aria-labelledby="timelines-title">
          <h2 id="timelines-title" className="grievance__h2">Response timelines</h2>
          <div className="timelines__scroll" tabIndex={0} role="region" aria-labelledby="timelines-title">
            <table className="timelines__table">
              <thead>
                <tr>
                  <th scope="col">Stage</th>
                  <th scope="col">Timeline</th>
                </tr>
              </thead>
              <tbody>
                {TIMELINES.map((row) => (
                  <tr key={row.stage}>
                    <th scope="row">{row.stage}</th>
                    <td>{row.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section aria-labelledby="escalate-title">
          <h2 id="escalate-title" className="grievance__h2">Still not resolved?</h2>
          <div className="grievance__links">
            <Link to="/complaint-board" className="grievance__link-card">
              <strong>Complaint Board</strong>
              <span>Raise a complaint with us and track complaint data.</span>
              <em>Go to Complaint Board →</em>
            </Link>
            <a href={SCORES_URL} className="grievance__link-card" target="_blank" rel="noopener noreferrer">
              <strong>SEBI SCORES</strong>
              <span>Lodge your complaint with SEBI.</span>
              <em>Open SEBI SCORES →<span style={srOnly}> (opens in a new tab)</span></em>
            </a>
            <a href={SMART_ODR_URL} className="grievance__link-card" target="_blank" rel="noopener noreferrer">
              <strong>Smart ODR</strong>
              <span>Online dispute resolution for the securities market.</span>
              <em>Open Smart ODR →<span style={srOnly}> (opens in a new tab)</span></em>
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
