import { useCallback, useState } from 'react';
import useForm from '../../hooks/useForm.js';
import { createLead } from '../../services/leadService.js';

const INDIAN_MOBILE = /^[6-9]\d{9}$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MESSAGE_MAX = 1000;

const validate = (values) => {
  const errors = {};
  if (values.name.trim().length < 2) errors.name = 'Please enter your name.';
  if (!INDIAN_MOBILE.test(values.phone)) errors.phone = 'Enter a valid 10-digit mobile number.';
  if (!EMAIL.test(values.email.trim())) errors.email = 'Enter a valid email address.';
  if (values.message.trim().length < 10) errors.message = 'Please write a message (at least 10 characters).';
  return errors;
};

const styles = `
.contact-form { display: grid; gap: 1.125rem; }
.contact-form__row { display: grid; gap: 1.125rem; }
@media (min-width: 640px) { .contact-form__row { grid-template-columns: 1fr 1fr; } }
.contact-form__label { display: block; margin-bottom: 0.375rem; font-size: 0.875rem; font-weight: 700; color: #0B1B2B; }
.contact-form__control {
  width: 100%;
  min-height: 50px;
  padding: 0 1rem;
  border: 1.5px solid #D9E5E0;
  border-radius: 12px;
  background: #fff;
  color: #0B1B2B;
  font: inherit;
  font-size: 1rem;
  transition: border-color 200ms ease, box-shadow 200ms ease;
}
textarea.contact-form__control { min-height: 140px; padding: 0.875rem 1rem; resize: vertical; line-height: 1.6; }
.contact-form__control:focus { outline: none; border-color: #0B7A57; box-shadow: 0 0 0 4px rgba(11, 122, 87, 0.15); }
.contact-form__control[aria-invalid='true'] { border-color: #C2410C; }
.contact-form__meta { display: flex; justify-content: space-between; gap: 1rem; }
.contact-form__count { margin: 0.375rem 0 0 auto; font-size: 0.8125rem; color: #4F5F6B; }
.contact-form__error { margin: 0.375rem 0 0; font-size: 0.8125rem; color: #B42318; }
/* Honeypot: hidden from people and assistive tech, visible to naive bots. */
.contact-form__hp { position: absolute; left: -10000px; width: 1px; height: 1px; overflow: hidden; }
.contact-form__submit {
  min-height: 54px;
  border: 0;
  border-radius: 9999px;
  background: linear-gradient(90deg, #087F58, #0E6E8C);
  color: #fff;
  font: inherit;
  font-size: 1.0625rem;
  font-weight: 700;
  cursor: pointer;
}
.contact-form__submit:disabled { opacity: 0.7; cursor: wait; }
.contact-form__submit:focus-visible { outline: 2px solid #0B1B2B; outline-offset: 2px; }
.contact-form__done { padding: 1.5rem; border-radius: 16px; background: #EEF5F2; color: #0B1B2B; }
.contact-form__done strong { display: block; margin-bottom: 0.25rem; color: #0B7A57; font-size: 1.125rem; }
`;

// initialMessage: optional prefill (e.g. a course enquiry from the course page).
export default function ContactForm({ initialMessage = '' }) {
  const [initialValues] = useState(() => ({ name: '', phone: '', email: '', message: initialMessage, website: '' }));
  const { values, errors, submitting, handleChange, handleSubmit, setValues } = useForm(initialValues, validate);
  const [submitted, setSubmitted] = useState(false);
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
    // Honeypot filled: almost certainly a bot. Pretend success, send nothing.
    if (formValues.website) {
      setSubmitted(true);
      return;
    }
    try {
      await createLead({
        name: formValues.name.trim(),
        phone: formValues.phone,
        email: formValues.email.trim(),
        message: formValues.message.trim(),
        source: 'contact',
      });
      setSubmitted(true);
    } catch (err) {
      setServerError(err.message || 'Something went wrong. Please try again.');
    }
  });

  if (submitted) {
    return (
      <div className="contact-form__done" role="status">
        <style>{styles}</style>
        <strong>Thank you for reaching out!</strong>
        We have received your message and will get back to you during office hours.
      </div>
    );
  }

  const field = (name) => ({
    id: 'contact-' + name,
    name,
    className: 'contact-form__control',
    value: values[name],
    'aria-invalid': Boolean(errors[name]),
    'aria-describedby': errors[name] ? 'contact-' + name + '-error' : undefined,
    required: true,
  });
  const errorText = (name) =>
    errors[name] ? <p id={'contact-' + name + '-error'} className="contact-form__error" role="alert">{errors[name]}</p> : null;

  return (
    <form className="contact-form" onSubmit={onSubmit} noValidate aria-label="Contact form">
      <style>{styles}</style>

      <div>
        <label className="contact-form__label" htmlFor="contact-name">Name</label>
        <input {...field('name')} type="text" autoComplete="name" onChange={handleChange} />
        {errorText('name')}
      </div>

      <div className="contact-form__row">
        <div>
          <label className="contact-form__label" htmlFor="contact-phone">Mobile number</label>
          <input
            {...field('phone')}
            type="tel"
            inputMode="numeric"
            autoComplete="tel-national"
            placeholder="10-digit mobile"
            maxLength={14}
            onChange={onPhoneChange}
          />
          {errorText('phone')}
        </div>
        <div>
          <label className="contact-form__label" htmlFor="contact-email">Email</label>
          <input {...field('email')} type="email" inputMode="email" autoComplete="email" onChange={handleChange} />
          {errorText('email')}
        </div>
      </div>

      <div>
        <label className="contact-form__label" htmlFor="contact-message">Message</label>
        <textarea {...field('message')} rows={5} maxLength={MESSAGE_MAX} onChange={handleChange} />
        <div className="contact-form__meta">
          {errorText('message')}
          <p className="contact-form__count" aria-live="polite">{values.message.length}/{MESSAGE_MAX}</p>
        </div>
      </div>

      <div className="contact-form__hp" aria-hidden="true">
        <label htmlFor="contact-website">Leave this field empty</label>
        <input id="contact-website" name="website" type="text" tabIndex={-1} autoComplete="off" value={values.website} onChange={handleChange} />
      </div>

      {serverError && <p className="contact-form__error" role="alert">{serverError}</p>}

      <button type="submit" className="contact-form__submit" disabled={submitting}>
        {submitting ? 'Sending…' : 'Send Message'}
      </button>
    </form>
  );
}
