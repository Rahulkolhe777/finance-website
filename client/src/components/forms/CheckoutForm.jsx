import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import useForm from '../../hooks/useForm.js';
import { startCheckout } from '../../services/paymentService.js';

const INDIAN_MOBILE = /^[6-9]\d{9}$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const INITIAL_VALUES = { name: '', email: '', phone: '', terms: false };

const validate = (values) => {
  const errors = {};
  if (values.name.trim().length < 2) errors.name = 'Please enter your full name.';
  if (!EMAIL.test(values.email.trim())) errors.email = 'Enter a valid email (your payment receipt goes here).';
  if (!INDIAN_MOBILE.test(values.phone)) errors.phone = 'Enter a valid 10-digit mobile number.';
  if (!values.terms) errors.terms = 'Please accept the Terms and refund policy to continue.';
  return errors;
};

const styles = `
.checkout-form { display: grid; gap: 0.875rem; text-align: left; }
.checkout-form__row { display: grid; gap: 0.875rem; }
@media (min-width: 640px) { .checkout-form__row--3 { grid-template-columns: 1.2fr 1.2fr 1fr; } }
.checkout-form__label { display: block; margin-bottom: 0.375rem; font-size: 0.8125rem; font-weight: 700; }
.checkout-form__control {
  width: 100%;
  min-height: 48px;
  padding: 0 0.875rem;
  border: 1.5px solid #D9E5E0;
  border-radius: 12px;
  background: #fff;
  color: #0B1B2B;
  font: inherit;
  font-size: 1rem;
}
.checkout-form__control:focus { outline: none; border-color: #0B7A57; box-shadow: 0 0 0 4px rgba(11, 122, 87, 0.2); }
.checkout-form__control[aria-invalid='true'] { border-color: #E4572E; }
.checkout-form__error { margin: 0.375rem 0 0; font-size: 0.8125rem; color: var(--checkout-error, #B42318); }
.checkout-form__terms { display: flex; gap: 0.625rem; align-items: flex-start; font-size: 0.875rem; line-height: 1.6; cursor: pointer; }
.checkout-form__terms input { flex-shrink: 0; width: 20px; height: 20px; margin: 0.1em 0 0; accent-color: #0B7A57; }
.checkout-form__terms a { color: inherit; text-decoration: underline; }
.checkout-form__submit {
  min-height: 52px;
  border: 0;
  border-radius: 9999px;
  background: linear-gradient(90deg, #087F58, #0E6E8C);
  color: #fff;
  font: inherit;
  font-weight: 700;
  cursor: pointer;
}
.checkout-form__submit:disabled { opacity: 0.7; cursor: wait; }
.checkout-form__submit:focus-visible { outline: 2px solid currentColor; outline-offset: 2px; }
.checkout-form__secure { margin: 0; font-size: 0.8125rem; opacity: 0.85; }
`;

// Collects buyer details and sends the visitor to the gateway's hosted checkout.
// purpose: 'plan' | 'course'; refId: plan or course slug; payLabel: button text.
export default function CheckoutForm({ purpose, refId, payLabel = 'Proceed to Pay', idPrefix = 'checkout' }) {
  const { values, errors, submitting, handleChange, handleSubmit, setValues } = useForm(INITIAL_VALUES, validate);
  const [serverError, setServerError] = useState('');

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
      await startCheckout({
        purpose,
        refId,
        name: formValues.name.trim(),
        email: formValues.email.trim(),
        phone: formValues.phone,
      });
    } catch (err) {
      setServerError(err.message || 'Could not start payment. Please try again.');
    }
  });

  const id = (name) => idPrefix + '-' + name;
  const field = (name) => ({
    id: id(name),
    name,
    className: 'checkout-form__control',
    value: values[name],
    'aria-invalid': Boolean(errors[name]),
    'aria-describedby': errors[name] ? id(name) + '-error' : undefined,
    required: true,
  });
  const errorText = (name) =>
    errors[name] ? <p id={id(name) + '-error'} className="checkout-form__error" role="alert">{errors[name]}</p> : null;

  return (
    <form className="checkout-form" onSubmit={onSubmit} noValidate aria-label="Payment details">
      <style>{styles}</style>
      <div className="checkout-form__row checkout-form__row--3">
        <div>
          <label className="checkout-form__label" htmlFor={id('name')}>Full name</label>
          <input {...field('name')} type="text" autoComplete="name" onChange={handleChange} />
          {errorText('name')}
        </div>
        <div>
          <label className="checkout-form__label" htmlFor={id('email')}>Email</label>
          <input {...field('email')} type="email" inputMode="email" autoComplete="email" onChange={handleChange} />
          {errorText('email')}
        </div>
        <div>
          <label className="checkout-form__label" htmlFor={id('phone')}>Mobile</label>
          <input {...field('phone')} type="tel" inputMode="numeric" autoComplete="tel-national" maxLength={14} onChange={onPhoneChange} />
          {errorText('phone')}
        </div>
      </div>

      <div>
        <label className="checkout-form__terms" htmlFor={id('terms')}>
          <input
            id={id('terms')}
            name="terms"
            type="checkbox"
            checked={values.terms}
            onChange={handleChange}
            aria-invalid={Boolean(errors.terms)}
            aria-describedby={errors.terms ? id('terms') + '-error' : undefined}
          />
          <span>
            I accept the <Link to="/legal/terms">Terms &amp; Conditions</Link> and refund policy, and understand that
            investments in securities market are subject to market risks.
          </span>
        </label>
        {errorText('terms')}
      </div>

      {serverError && <p className="checkout-form__error" role="alert">{serverError}</p>}

      <button type="submit" className="checkout-form__submit" disabled={submitting}>
        {submitting ? 'Redirecting to secure checkout…' : payLabel}
      </button>
      <p className="checkout-form__secure">You will be redirected to our payment partner&apos;s secure page.</p>
    </form>
  );
}
