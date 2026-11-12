import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ComplaintForm from '../components/forms/ComplaintForm.jsx';
import { getComplaintStats } from '../services/complaintService.js';

const SCORES_URL = 'https://scores.sebi.gov.in/';
const SMART_ODR_URL = 'https://smartodr.in/';

// Escalation steps: [TEXT] — replace with your approved wording.
const ESCALATION_STEPS = [
  { title: 'Raise a complaint with us', text: '[TEXT]' },
  { title: 'Escalate to our Grievance Officer', text: '[TEXT]' },
  { title: 'Lodge a complaint on SEBI SCORES', text: '[TEXT]', href: SCORES_URL, linkLabel: 'Open SEBI SCORES' },
  { title: 'Online dispute resolution (Smart ODR)', text: '[TEXT]', href: SMART_ODR_URL, linkLabel: 'Open Smart ODR' },
];

const COLUMNS = [
  { key: 'month', label: 'Month' },
  { key: 'carriedForward', label: 'Pending at start of month' },
  { key: 'received', label: 'Received' },
  { key: 'resolved', label: 'Resolved' },
  { key: 'pending', label: 'Pending at end of month' },
  { key: 'pendingOver3Months', label: 'Pending > 3 months' },
  { key: 'avgResolutionDays', label: 'Avg. resolution time (days)' },
];

const currentFinancialYear = () => {
  const now = new Date();
  return now.getMonth() >= 3 ? now.getFullYear() : now.getFullYear() - 1;
};
const fyLabel = (fy) => fy + '-' + String(fy + 1).slice(2);

const styles = `
.complaint-board {
  --cb-navy: #0B1B2B;
  --cb-emerald: #0B7A57;
  --cb-mint: #EEF5F2;
  --cb-border: #D9E5E0;
  --cb-muted: #4F5F6B;
  color: var(--cb-navy);
}
.complaint-board__hero { background: linear-gradient(#EAF8F1, #fff); padding: clamp(3rem, 7vw, 4.5rem) 0 clamp(1.5rem, 3vw, 2rem); text-align: center; }
.complaint-board__title { margin: 0 0 0.75rem; font-size: clamp(2.25rem, 5vw, 3.25rem); font-weight: 800; line-height: 1.1; letter-spacing: -0.02em; }
.complaint-board__accent { font-family: 'Playfair Display', Georgia, 'Times New Roman', serif; font-style: italic; font-weight: 700; letter-spacing: 0; color: var(--cb-emerald); }
.complaint-board__sub { margin: 0 auto; max-width: 38rem; color: var(--cb-muted); font-size: 1.0625rem; }
.complaint-board__grid {
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  gap: clamp(1.5rem, 4vw, 3rem);
  align-items: start;
  padding-block: clamp(1.5rem, 4vw, 2.5rem);
}
.complaint-board__card { padding: clamp(1.5rem, 4vw, 2.25rem); border: 1px solid var(--cb-border); border-radius: 24px; background: #fff; box-shadow: 0 20px 44px rgba(11, 27, 43, 0.08); }
.complaint-board__h2 { margin: 0 0 1.25rem; font-size: clamp(1.375rem, 3vw, 1.75rem); font-weight: 800; letter-spacing: -0.01em; }
.escalation { counter-reset: step; display: grid; gap: 0.875rem; margin: 0; padding: 0; list-style: none; }
.escalation__item { position: relative; padding: 1.125rem 1.25rem 1.125rem 3.75rem; border-radius: 18px; background: var(--cb-mint); }
.escalation__item::before {
  counter-increment: step;
  content: counter(step);
  position: absolute;
  left: 1.125rem;
  top: 1.125rem;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  background: var(--cb-navy);
  color: #fff;
  font-weight: 800;
  font-size: 0.875rem;
}
.escalation__title { margin: 0 0 0.25rem; font-weight: 800; }
.escalation__text { margin: 0; color: var(--cb-muted); line-height: 1.6; }
.escalation__link { display: inline-flex; align-items: center; min-height: 44px; color: var(--cb-emerald); font-weight: 700; text-decoration: underline; }
.complaint-board__note { margin: 1rem 0 0; font-size: 0.875rem; color: var(--cb-muted); }
.complaint-board__note a { color: var(--cb-emerald); text-decoration: underline; }
.complaint-data { padding-block: clamp(1rem, 3vw, 2rem) clamp(3.5rem, 7vw, 5.5rem); }
.complaint-data__head { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 1rem; margin-bottom: 1rem; }
.complaint-data__select { min-height: 44px; padding: 0 2.25rem 0 1rem; border: 1.5px solid var(--cb-border); border-radius: 9999px; background: #fff; font: inherit; font-weight: 600; color: var(--cb-navy); }
.complaint-data__select:focus-visible { outline: 2px solid var(--cb-emerald); outline-offset: 2px; }
.complaint-data__scroll { overflow-x: auto; border: 1px solid var(--cb-border); border-radius: 20px; }
.complaint-data__table { width: 100%; min-width: 760px; border-collapse: collapse; font-size: 0.9375rem; }
.complaint-data__table th,
.complaint-data__table td { padding: 0.75rem 1rem; border-bottom: 1px solid var(--cb-border); text-align: right; }
.complaint-data__table th:first-child,
.complaint-data__table td:first-child { text-align: left; }
.complaint-data__table thead th { background: var(--cb-mint); font-size: 0.8125rem; font-weight: 800; vertical-align: bottom; }
.complaint-data__table tbody tr:last-child td,
.complaint-data__table tbody tr:last-child th { border-bottom: 0; }
.complaint-data__table tfoot td,
.complaint-data__table tfoot th { background: #F7FAF9; font-weight: 800; border-top: 1px solid var(--cb-border); border-bottom: 0; }
.complaint-data__status { padding: 2rem 1rem; text-align: center; color: var(--cb-muted); }
.complaint-data__updated { margin: 0.75rem 0 0; font-size: 0.8125rem; color: var(--cb-muted); }
@media (max-width: 960px) { .complaint-board__grid { grid-template-columns: 1fr; } }
`;

export default function ComplaintBoard() {
  const latestFy = currentFinancialYear();
  const [fy, setFy] = useState(latestFy);
  const [stats, setStats] = useState(null);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    let active = true;
    setStatus('loading');
    getComplaintStats(fy)
      .then((data) => {
        if (!active) return;
        setStats(data);
        setStatus('ready');
      })
      .catch(() => active && setStatus('error'));
    return () => {
      active = false;
    };
  }, [fy]);

  const months = stats?.months || [];
  const totals = months.reduce(
    (acc, m) => ({ received: acc.received + m.received, resolved: acc.resolved + m.resolved }),
    { received: 0, resolved: 0 }
  );

  return (
    <div className="complaint-board">
      <style>{styles}</style>

      <section className="complaint-board__hero" aria-labelledby="complaint-board-title">
        <div className="container">
          <h1 id="complaint-board-title" className="complaint-board__title">
            Complaint <span className="complaint-board__accent">Board</span>
          </h1>
          <p className="complaint-board__sub">[YOUR TEXT]</p>
        </div>
      </section>

      <div className="container complaint-board__grid">
        <section className="complaint-board__card" aria-labelledby="complaint-form-title">
          <h2 id="complaint-form-title" className="complaint-board__h2">Raise a complaint</h2>
          <ComplaintForm />
        </section>

        <section aria-labelledby="escalation-title">
          <h2 id="escalation-title" className="complaint-board__h2">How to escalate</h2>
          <ol className="escalation">
            {ESCALATION_STEPS.map((step) => (
              <li key={step.title} className="escalation__item">
                <p className="escalation__title">{step.title}</p>
                <p className="escalation__text">{step.text}</p>
                {step.href && (
                  <a className="escalation__link" href={step.href} target="_blank" rel="noopener noreferrer">
                    {step.linkLabel}
                    <span style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}> (opens in a new tab)</span>
                  </a>
                )}
              </li>
            ))}
          </ol>
          <p className="complaint-board__note">
            Grievance Officer contact details and response timelines are on our{' '}
            <Link to="/grievance-redressal">Grievance Redressal</Link> page.
          </p>
        </section>
      </div>

      <section className="container complaint-data" aria-labelledby="complaint-data-title">
        <div className="complaint-data__head">
          <h2 id="complaint-data-title" className="complaint-board__h2" style={{ margin: 0 }}>Complaint data</h2>
          <label>
            <span style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>Financial year</span>
            <select className="complaint-data__select" value={fy} onChange={(e) => setFy(Number(e.target.value))}>
              {[0, 1, 2].map((offset) => (
                <option key={offset} value={latestFy - offset}>FY {fyLabel(latestFy - offset)}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="complaint-data__scroll" tabIndex={0} role="region" aria-labelledby="complaint-data-title" aria-busy={status === 'loading'}>
          {status === 'ready' && months.length > 0 ? (
            <table className="complaint-data__table">
              <caption style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>
                Month-wise complaint data for FY {fyLabel(fy)}
              </caption>
              <thead>
                <tr>
                  {COLUMNS.map((col) => <th key={col.key} scope="col">{col.label}</th>)}
                </tr>
              </thead>
              <tbody>
                {months.map((row) => (
                  <tr key={row.month}>
                    <th scope="row" style={{ fontWeight: 600 }}>{row.month}</th>
                    {COLUMNS.slice(1).map((col) => (
                      <td key={col.key}>{row[col.key] ?? '—'}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <th scope="row">Total</th>
                  <td>—</td>
                  <td>{totals.received}</td>
                  <td>{totals.resolved}</td>
                  <td>{months[months.length - 1].pending}</td>
                  <td>{months[months.length - 1].pendingOver3Months}</td>
                  <td>—</td>
                </tr>
              </tfoot>
            </table>
          ) : (
            <p className="complaint-data__status" role="status">
              {status === 'loading' && 'Loading complaint data…'}
              {status === 'error' && 'Complaint data could not be loaded right now. Please try again later.'}
              {status === 'ready' && 'No data for this financial year yet.'}
            </p>
          )}
        </div>
        <p className="complaint-data__updated">
          Data is updated as complaints are received and resolved. [ADD ANY SEBI-PRESCRIBED NOTES]
        </p>
      </section>
    </div>
  );
}
