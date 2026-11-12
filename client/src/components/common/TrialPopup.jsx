import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Modal from './Modal.jsx';
import useForm from '../../hooks/useForm.js';
import { createLead } from '../../services/leadService.js';

const STORAGE_KEY = 'trialPopupShown';
const OPEN_DELAY_MS = 8000;
const AUTO_CLOSE_MS = 60000;
const INDIAN_MOBILE = /^[6-9]\d{9}$/;
const INITIAL_VALUES = { name: '', phone: '', consent: false };

const readFlag = () => {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === '1';
  } catch {
    return false;
  }
};
const writeFlag = () => {
  try {
    window.localStorage.setItem(STORAGE_KEY, '1');
  } catch {
    // Storage unavailable (private mode etc.): popup may show again next visit.
  }
};

const validate = (values) => {
  const errors = {};
  if (values.name.trim().length < 2) errors.name = 'Please enter your name.';
  if (!INDIAN_MOBILE.test(values.phone)) errors.phone = 'Enter a valid 10-digit mobile number.';
  if (!values.consent) errors.consent = 'Please give your consent so we can contact you.';
  return errors;
};

const styles = `
.trial-popup__benefit {
  margin: 0 0 1.25rem;
  color: #4F5F6B;
  font-size: 0.9375rem;
}
.trial-popup__form { display: grid; gap: 0.875rem; }
.trial-popup__label {
  display: block;
  margin-bottom: 0.375rem;
  font-size: 0.875rem;
  font-weight: 700;
  color: #0B1B2B;
}
.trial-popup__input {
  width: 100%;
  min-height: 48px;
  padding: 0 1rem;
  border: 1.5px solid #D9E5E0;
  border-radius: 12px;
  background: #fff;
  color: #0B1B2B;
  font: inherit;
  font-size: 1rem;
  transition: border-color 200ms ease, box-shadow 200ms ease;
}
.trial-popup__input:focus {
  outline: none;
  border-color: #0B7A57;
  box-shadow: 0 0 0 4px rgba(11, 122, 87, 0.15);
}
.trial-popup__input[aria-invalid='true'] { border-color: #C2410C; }
.trial-popup__error {
  margin: 0.375rem 0 0;
  font-size: 0.8125rem;
  color: #B42318;
}
.trial-popup__consent {
  display: flex;
  gap: 0.625rem;
  align-items: flex-start;
  font-size: 0.8125rem;
  line-height: 1.6;
  color: #4F5F6B;
  cursor: pointer;
}
.trial-popup__consent input {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  margin: 0.1em 0 0;
  accent-color: #0B7A57;
}
.trial-popup__consent a { color: #0B7A57; text-decoration: underline; }
.trial-popup__submit {
  min-height: 52px;
  margin-top: 0.25rem;
  border: 0;
  border-radius: 9999px;
  background: linear-gradient(90deg, #087F58, #0E6E8C);
  color: #fff;
  font: inherit;
  font-weight: 700;
  cursor: pointer;
}
.trial-popup__submit:disabled { opacity: 0.7; cursor: wait; }
.trial-popup__submit:focus-visible { outline: 2px solid #0B1B2B; outline-offset: 2px; }
.trial-popup__done {
  margin: 0.5rem 0 0;
  color: #0B7A57;
  font-weight: 700;
}
`;

export default function TrialPopup() {
  const [open, setOpen] = useState(false);
  const [interacted, setInteracted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState('');
  const { pathname } = useLocation();
  const pathnameRef = useRef(pathname);
  pathnameRef.current = pathname;

  const { values, errors, submitting, handleChange, handleSubmit, setValues } = useForm(INITIAL_VALUES, validate);

  // Fire once, 8 s after the first page load, unless already shown in this browser.
  useEffect(() => {
    if (readFlag()) return undefined;
    const timer = window.setTimeout(() => {
      if (pathnameRef.current === '/free-trial') return; // already on the trial form
      writeFlag();
      setOpen(true);
    }, OPEN_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, []);

  // Auto-close after 60 s, unless the visitor has started filling the form.
  useEffect(() => {
    if (!open || interacted) return undefined;
    const timer = window.setTimeout(() => setOpen(false), AUTO_CLOSE_MS);
    return () => window.clearTimeout(timer);
  }, [open, interacted]);

  const close = useCallback(() => setOpen(false), []);
  const markInteracted = useCallback(() => setInteracted(true), []);

  const onPhoneChange = useCallback(
    (e) => {
      let digits = e.target.value.replace(/\D/g, '');
      if (digits.length > 10 && digits.startsWith('91')) digits = digits.slice(2);
      if (digits.length > 10 && digits.startsWith('0')) digits = digits.slice(1);
      setValues((prev) => ({ ...prev, phone: digits.slice(0, 10) }));
    },
    [setValues]
  );

  const onSubmit = handleSubmit(async (formValues) => {
    setServerError('');
    try {
      await createLead({ name: formValues.name.trim(), phone: formValues.phone, consent: true, source: 'trial' });
      setSubmitted(true);
    } catch (err) {
      setServerError(err.message || 'Something went wrong. Please try again.');
    }
  });

  return (
    <Modal open={open} onClose={close} title="Trial Pack">
      <style>{styles}</style>
      <p className="trial-popup__benefit">[YOUR BENEFIT LINE]</p>

      {submitted ? (
        <p className="trial-popup__done" role="status">Thank you! Our team will contact you shortly.</p>
      ) : (
        <form className="trial-popup__form" onSubmit={onSubmit} onInput={markInteracted} noValidate>
          <div>
            <label className="trial-popup__label" htmlFor="trial-popup-name">Name</label>
            <input
              id="trial-popup-name"
              name="name"
              type="text"
              autoComplete="name"
              className="trial-popup__input"
              value={values.name}
              onChange={handleChange}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? 'trial-popup-name-error' : undefined}
              required
            />
            {errors.name && <p id="trial-popup-name-error" className="trial-popup__error" role="alert">{errors.name}</p>}
          </div>

          <div>
            <label className="trial-popup__label" htmlFor="trial-popup-phone">Mobile number</label>
            <input
              id="trial-popup-phone"
              name="phone"
              type="tel"
              inputMode="numeric"
              autoComplete="tel-national"
              placeholder="10-digit mobile number"
              className="trial-popup__input"
              value={values.phone}
              onChange={onPhoneChange}
              maxLength={14}
              aria-invalid={Boolean(errors.phone)}
              aria-describedby={errors.phone ? 'trial-popup-phone-error' : undefined}
              required
            />
            {errors.phone && <p id="trial-popup-phone-error" className="trial-popup__error" role="alert">{errors.phone}</p>}
          </div>

          <div>
            <label className="trial-popup__consent" htmlFor="trial-popup-consent">
              <input
                id="trial-popup-consent"
                name="consent"
                type="checkbox"
                checked={values.consent}
                onChange={handleChange}
                aria-invalid={Boolean(errors.consent)}
                aria-describedby={errors.consent ? 'trial-popup-consent-error' : undefined}
                required
              />
              <span>
                I agree to be contacted about the trial and accept the{' '}
                <Link to="/legal/privacy-policy" onClick={close}>Privacy Policy</Link> and{' '}
                <Link to="/legal/terms" onClick={close}>Terms</Link>.
              </span>
            </label>
            {errors.consent && <p id="trial-popup-consent-error" className="trial-popup__error" role="alert">{errors.consent}</p>}
          </div>

          {serverError && <p className="trial-popup__error" role="alert">{serverError}</p>}

          <button type="submit" className="trial-popup__submit" disabled={submitting}>
            {submitting ? 'Sending…' : 'Get Trial Pack'}
          </button>
        </form>
      )}
    </Modal>
  );
}
