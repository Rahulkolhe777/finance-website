import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import TrialFormFields from '../components/forms/TrialFormFields.jsx';
import useForm from '../hooks/useForm.js';
import { createLead } from '../services/leadService.js';
import { services } from '../data/services.js';

const INDIAN_MOBILE = /^[6-9]\d{9}$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const INITIAL_VALUES = { name: '', phone: '', email: '', segment: '', consent: false };
const THANK_YOU = 'thank-you';

// Replace with your real trial benefits and next steps.
const BENEFITS = ['[TRIAL BENEFIT]', '[TRIAL BENEFIT]', '[TRIAL BENEFIT]'];
const NEXT_STEPS = [
  'Our team will call you on the number you shared. [EDIT]',
  'You will receive trial calls for your chosen segment. [EDIT]',
  'Read the Investor Charter and Terms before subscribing.',
];

const validate = (values) => {
  const errors = {};
  if (values.name.trim().length < 2) errors.name = 'Please enter your full name.';
  if (!INDIAN_MOBILE.test(values.phone)) errors.phone = 'Enter a valid 10-digit mobile number.';
  if (!EMAIL.test(values.email.trim())) errors.email = 'Enter a valid email address.';
  if (!services.some((s) => s.id === values.segment)) errors.segment = 'Please choose a segment.';
  if (!values.consent) errors.consent = 'Please accept the User Consent terms to continue.';
  return errors;
};

const styles = `
.trial-page {
  --tp-navy: #0B1B2B;
  --tp-emerald: #0B7A57;
  --tp-mint: #EEF5F2;
  --tp-border: #D9E5E0;
  --tp-muted: #4F5F6B;
  --tp-gradient: linear-gradient(90deg, #087F58, #0E6E8C);
  background: linear-gradient(#EAF8F1, #fff);
  padding: clamp(2.5rem, 6vw, 4.5rem) 0 clamp(3.5rem, 7vw, 5.5rem);
  color: var(--tp-navy);
}
.trial-page__grid {
  display: grid;
  grid-template-columns: 0.9fr 1.1fr;
  gap: clamp(2rem, 5vw, 4rem);
  align-items: start;
}
.trial-page__title {
  margin: 0 0 1rem;
  font-size: clamp(2.25rem, 5vw, 3.25rem);
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -0.02em;
}
.trial-page__accent {
  font-family: 'Playfair Display', Georgia, 'Times New Roman', serif;
  font-style: italic;
  font-weight: 700;
  letter-spacing: 0;
  color: var(--tp-emerald);
}
.trial-page__lead { margin: 0 0 1.5rem; font-size: 1.0625rem; color: var(--tp-muted); }
.trial-page__list { display: grid; gap: 0.75rem; margin: 0; padding: 0; list-style: none; }
.trial-page__list li { display: flex; gap: 0.625rem; align-items: flex-start; }
.trial-page__list svg { flex-shrink: 0; margin-top: 0.2em; color: var(--tp-emerald); }
.trial-page__risk { margin: 1.75rem 0 0; font-size: 0.8125rem; line-height: 1.6; color: var(--tp-muted); }
.trial-page__card {
  padding: clamp(1.5rem, 4vw, 2.25rem);
  border: 1px solid var(--tp-border);
  border-radius: 24px;
  background: #fff;
  box-shadow: 0 20px 44px rgba(11, 27, 43, 0.08);
}
.trial-page__card:focus { outline: none; }
.trial-page__card-title { margin: 0 0 1.25rem; font-size: 1.375rem; font-weight: 800; }
.trial-page__submit {
  width: 100%;
  min-height: 54px;
  margin-top: 1.5rem;
  border: 0;
  border-radius: 9999px;
  background: var(--tp-gradient);
  color: #fff;
  font: inherit;
  font-size: 1.0625rem;
  font-weight: 700;
  cursor: pointer;
}
.trial-page__submit:disabled { opacity: 0.7; cursor: wait; }
.trial-page__submit:focus-visible { outline: 2px solid var(--tp-navy); outline-offset: 2px; }
.trial-page__server-error { margin: 1rem 0 0; color: #B42318; font-size: 0.9375rem; }
.trial-page__done-icon {
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  border-radius: 9999px;
  background: var(--tp-mint);
  color: var(--tp-emerald);
}
.trial-page__steps { margin: 1rem 0 0; padding-left: 1.25rem; display: grid; gap: 0.625rem; line-height: 1.6; }
.trial-page__actions { display: flex; flex-wrap: wrap; gap: 0.75rem; margin-top: 1.75rem; }
.trial-page__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;
  padding: 0 1.5rem;
  border-radius: 9999px;
  font-weight: 700;
}
.trial-page__btn--primary { background: var(--tp-gradient); color: #fff; }
.trial-page__btn--primary:hover, .trial-page__btn--primary:focus-visible { color: #fff; }
.trial-page__btn--ghost { border: 1.5px solid var(--tp-navy); color: var(--tp-navy); }
.trial-page__btn--ghost:hover, .trial-page__btn--ghost:focus-visible { background: var(--tp-navy); color: #fff; }
@media (max-width: 900px) {
  .trial-page__grid { grid-template-columns: 1fr; }
}
`;

const tick = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12l5 5L20 7" />
  </svg>
);

export default function TrialForm() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const submitted = searchParams.get('status') === THANK_YOU;
  const [serverError, setServerError] = useState('');
  const doneRef = useRef(null);

  const { values, errors, submitting, handleChange, handleSubmit, setValues } = useForm(INITIAL_VALUES, validate);

  const onPhoneChange = useCallback(
    (e) => {
      let digits = e.target.value.replace(/\D/g, '');
      if (digits.length > 10 && digits.startsWith('91')) digits = digits.slice(2);
      if (digits.length > 10 && digits.startsWith('0')) digits = digits.slice(1);
      setValues((prev) => ({ ...prev, phone: digits.slice(0, 10) }));
    },
    [setValues]
  );

  // Move focus to the first invalid field after a failed submit.
  useEffect(() => {
    const first = ['name', 'phone', 'email', 'segment', 'consent'].find((key) => errors[key]);
    if (first) document.getElementById('trial-' + first)?.focus();
  }, [errors]);

  useEffect(() => {
    if (submitted) doneRef.current?.focus();
  }, [submitted]);

  const onSubmit = handleSubmit(async (formValues) => {
    setServerError('');
    try {
      await createLead({
        name: formValues.name.trim(),
        phone: formValues.phone,
        email: formValues.email.trim(),
        segment: formValues.segment,
        consent: true,
        source: 'trial',
      });
      navigate('/free-trial?status=' + THANK_YOU, { replace: true });
    } catch (err) {
      setServerError(err.message || 'Something went wrong. Please try again.');
    }
  });

  return (
    <section className="trial-page" aria-labelledby="trial-page-title">
      <style>{styles}</style>
      <div className="container trial-page__grid">
        <div>
          <h1 id="trial-page-title" className="trial-page__title">
            Instant <span className="trial-page__accent">Trial</span> Form
          </h1>
          <p className="trial-page__lead">[YOUR TEXT]</p>
          <ul className="trial-page__list">
            {BENEFITS.map((benefit, index) => (
              <li key={index}>{tick}{benefit}</li>
            ))}
          </ul>
          <p className="trial-page__risk">
            Investments in securities market are subject to market risks. Read all the related documents carefully
            before investing.
          </p>
        </div>

        {submitted ? (
          <div ref={doneRef} className="trial-page__card" tabIndex={-1} role="status" aria-live="polite">
            <div className="trial-page__done-icon" aria-hidden="true">{tick}</div>
            <h2 className="trial-page__card-title" style={{ marginBottom: '0.5rem' }}>Thank you! Your trial request is in.</h2>
            <p style={{ margin: 0, color: '#4F5F6B' }}>Here&apos;s what happens next:</p>
            <ol className="trial-page__steps">
              {NEXT_STEPS.map((step, index) => <li key={index}>{step}</li>)}
            </ol>
            <div className="trial-page__actions">
              <Link to="/services" className="trial-page__btn trial-page__btn--primary">Explore Services</Link>
              <Link to="/legal/investor-charter" className="trial-page__btn trial-page__btn--ghost">Investor Charter</Link>
            </div>
          </div>
        ) : (
          <form className="trial-page__card" onSubmit={onSubmit} noValidate aria-labelledby="trial-form-title">
            <h2 id="trial-form-title" className="trial-page__card-title">Get your free trial</h2>
            <TrialFormFields values={values} errors={errors} onChange={handleChange} onPhoneChange={onPhoneChange} />
            {serverError && <p className="trial-page__server-error" role="alert">{serverError}</p>}
            <button type="submit" className="trial-page__submit" disabled={submitting}>
              {submitting ? 'Submitting…' : 'Start Free Trial'}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
