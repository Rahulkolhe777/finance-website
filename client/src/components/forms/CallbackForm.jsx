import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import useForm from '../../hooks/useForm.js';
import { requestCallback } from '../../services/leadService.js';

// 10-digit Indian mobile number starting with 6, 7, 8 or 9.
const INDIAN_MOBILE = /^[6-9]\d{9}$/;
const INITIAL_VALUES = { phone: '', consent: false };

const validate = (values) => {
  const errors = {};
  if (!INDIAN_MOBILE.test(values.phone)) errors.phone = 'Enter a valid 10-digit mobile number.';
  if (!values.consent) errors.consent = 'Please give your consent so we can call you.';
  return errors;
};

const styles = `
.callback-form {
  --cf-emerald-on-dark: #3DD39B;
  --cf-error: #FFB4A8;
  --cf-gradient: linear-gradient(90deg, #087F58, #0E6E8C);

  width: 100%;
  max-width: 34rem;
  margin: 0 auto;
  text-align: left;
}
.callback-form__row {
  display: flex;
  gap: 0.75rem;
}
.callback-form__field {
  flex: 1;
  min-width: 0;
}
.callback-form__sr {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}
.callback-form__input-wrap {
  display: flex;
  align-items: center;
  min-height: 52px;
  border: 1.5px solid transparent;
  border-radius: 9999px;
  background: #fff;
  transition: border-color 200ms ease, box-shadow 200ms ease;
}
.callback-form__input-wrap:focus-within {
  border-color: var(--cf-emerald-on-dark);
  box-shadow: 0 0 0 4px rgba(61, 211, 155, 0.25);
}
.callback-form__input-wrap.has-error { border-color: var(--cf-error); }
.callback-form__prefix {
  padding-left: 1.25rem;
  color: #0B1B2B;
  font-weight: 700;
}
.callback-form__input {
  flex: 1;
  min-width: 0;
  height: 48px;
  padding: 0 1.25rem 0 0.5rem;
  border: 0;
  background: transparent;
  color: #0B1B2B;
  font: inherit;
  font-size: 1rem;
  letter-spacing: 0.04em;
}
.callback-form__input:focus { outline: none; }
.callback-form__input::placeholder { color: #6B7A86; letter-spacing: 0; }
.callback-form__submit {
  flex-shrink: 0;
  min-height: 52px;
  padding: 0 1.75rem;
  border: 0;
  border-radius: 9999px;
  background: var(--cf-gradient);
  color: #fff;
  font: inherit;
  font-weight: 700;
  cursor: pointer;
  transition: box-shadow 200ms ease, opacity 200ms ease;
}
.callback-form__submit:hover:not(:disabled),
.callback-form__submit:focus-visible {
  box-shadow: 0 10px 24px rgba(8, 127, 88, 0.45);
}
.callback-form__submit:focus-visible {
  outline: 2px solid #fff;
  outline-offset: 2px;
}
.callback-form__submit:disabled { opacity: 0.7; cursor: wait; }
.callback-form__consent {
  display: flex;
  align-items: flex-start;
  gap: 0.625rem;
  margin-top: 1rem;
  font-size: 0.8125rem;
  line-height: 1.6;
  color: #C9D5DF;
  cursor: pointer;
}
.callback-form__consent input {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  margin: 0.1em 0 0;
  accent-color: #0B7A57;
  cursor: pointer;
}
.callback-form__consent a {
  color: var(--cf-emerald-on-dark);
  text-decoration: underline;
}
.callback-form__error {
  margin: 0.5rem 0 0 1.25rem;
  font-size: 0.8125rem;
  color: var(--cf-error);
}
.callback-form__error--consent { margin-left: 1.875rem; }
.callback-form__status {
  padding: 1.25rem 1.5rem;
  border: 1px solid rgba(61, 211, 155, 0.4);
  border-radius: 20px;
  background: rgba(61, 211, 155, 0.1);
  color: #fff;
  text-align: center;
}
.callback-form__status strong {
  display: block;
  margin-bottom: 0.25rem;
  color: var(--cf-emerald-on-dark);
  font-size: 1.0625rem;
}
@media (max-width: 560px) {
  .callback-form__row { flex-direction: column; }
  .callback-form__submit { width: 100%; }
}
`;

export default function CallbackForm() {
  const { values, errors, submitting, handleChange, handleSubmit, setValues } = useForm(INITIAL_VALUES, validate);
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState('');

  // Keep only digits, max 10 (drops spaces, dashes, a leading +91 or 0).
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
      await requestCallback(formValues);
      setSubmitted(true);
    } catch (err) {
      setServerError(err.message || 'Something went wrong. Please try again.');
    }
  });

  if (submitted) {
    return (
      <div className="callback-form callback-form__status" role="status">
        <style>{styles}</style>
        <strong>Thank you!</strong>
        Our team will call you shortly.
      </div>
    );
  }

  return (
    <form className="callback-form" onSubmit={onSubmit} noValidate>
      <style>{styles}</style>
      <div className="callback-form__row">
        <div className="callback-form__field">
          <label htmlFor="callback-phone" className="callback-form__sr">Mobile number</label>
          <div className={'callback-form__input-wrap' + (errors.phone ? ' has-error' : '')}>
            <span className="callback-form__prefix" aria-hidden="true">+91</span>
            <input
              id="callback-phone"
              name="phone"
              type="tel"
              inputMode="numeric"
              autoComplete="tel-national"
              placeholder="Mobile number"
              className="callback-form__input"
              value={values.phone}
              onChange={onPhoneChange}
              maxLength={14}
              aria-invalid={Boolean(errors.phone)}
              aria-describedby={errors.phone ? 'callback-phone-error' : undefined}
              required
            />
          </div>
          {errors.phone && (
            <p id="callback-phone-error" className="callback-form__error" role="alert">{errors.phone}</p>
          )}
        </div>
        <button type="submit" className="callback-form__submit" disabled={submitting}>
          {submitting ? 'Sending…' : 'Request Call Back'}
        </button>
      </div>

      <label className="callback-form__consent" htmlFor="callback-consent">
        <input
          id="callback-consent"
          name="consent"
          type="checkbox"
          checked={values.consent}
          onChange={handleChange}
          aria-invalid={Boolean(errors.consent)}
          aria-describedby={errors.consent ? 'callback-consent-error' : undefined}
          required
        />
        <span>
          I agree to be contacted by phone about my request and accept the{' '}
          <Link to="/legal/privacy-policy">Privacy Policy</Link> and <Link to="/legal/terms">Terms</Link>.
        </span>
      </label>
      {errors.consent && (
        <p id="callback-consent-error" className="callback-form__error callback-form__error--consent" role="alert">
          {errors.consent}
        </p>
      )}

      {serverError && <p className="callback-form__error" role="alert">{serverError}</p>}
    </form>
  );
}
