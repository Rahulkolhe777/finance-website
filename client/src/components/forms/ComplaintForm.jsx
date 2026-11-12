import { useCallback, useState } from 'react';
import useForm from '../../hooks/useForm.js';
import { submitComplaint } from '../../services/complaintService.js';

const INDIAN_MOBILE = /^[6-9]\d{9}$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const DESCRIPTION_MAX = 3000;
const INITIAL_VALUES = { name: '', email: '', phone: '', subject: '', description: '', website: '' };

const validate = (values) => {
  const errors = {};
  if (values.name.trim().length < 2) errors.name = 'Please enter your name.';
  if (!EMAIL.test(values.email.trim())) errors.email = 'Enter a valid email address.';
  if (values.phone && !INDIAN_MOBILE.test(values.phone)) errors.phone = 'Enter a valid 10-digit mobile number.';
  if (values.subject.trim().length < 3) errors.subject = 'Please add a short subject.';
  if (values.description.trim().length < 10) errors.description = 'Please describe your complaint (at least 10 characters).';
  return errors;
};

const styles = `
.complaint-form { display: grid; gap: 1.125rem; }
.complaint-form__row { display: grid; gap: 1.125rem; }
@media (min-width: 640px) { .complaint-form__row { grid-template-columns: 1fr 1fr; } }
.complaint-form__label { display: block; margin-bottom: 0.375rem; font-size: 0.875rem; font-weight: 700; color: #0B1B2B; }
.complaint-form__optional { font-weight: 500; color: #4F5F6B; }
.complaint-form__control {
  width: 100%;
  min-height: 50px;
  padding: 0 1rem;
  border: 1.5px solid #D9E5E0;
  border-radius: 12px;
  background: #fff;
  color: #0B1B2B;
  font: inherit;
  font-size: 1rem;
}
textarea.complaint-form__control { min-height: 160px; padding: 0.875rem 1rem; resize: vertical; line-height: 1.6; }
.complaint-form__control:focus { outline: none; border-color: #0B7A57; box-shadow: 0 0 0 4px rgba(11, 122, 87, 0.15); }
.complaint-form__control[aria-invalid='true'] { border-color: #C2410C; }
.complaint-form__error { margin: 0.375rem 0 0; font-size: 0.8125rem; color: #B42318; }
.complaint-form__count { margin: 0.375rem 0 0; text-align: right; font-size: 0.8125rem; color: #4F5F6B; }
.complaint-form__hp { position: absolute; left: -10000px; width: 1px; height: 1px; overflow: hidden; }
.complaint-form__submit {
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
.complaint-form__submit:disabled { opacity: 0.7; cursor: wait; }
.complaint-form__submit:focus-visible { outline: 2px solid #0B1B2B; outline-offset: 2px; }
.complaint-form__done { padding: 1.5rem; border-radius: 16px; background: #EEF5F2; color: #0B1B2B; line-height: 1.7; }
.complaint-form__done strong { display: block; margin-bottom: 0.25rem; color: #0B7A57; font-size: 1.125rem; }
.complaint-form__number { font-size: 1.25rem; font-weight: 800; letter-spacing: 0.02em; }
`;

export default function ComplaintForm() {
  const { values, errors, submitting, handleChange, handleSubmit, setValues } = useForm(INITIAL_VALUES, validate);
  const [result, setResult] = useState(null);
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
      const response = await submitComplaint({
        name: formValues.name.trim(),
        email: formValues.email.trim(),
        phone: formValues.phone,
        subject: formValues.subject.trim(),
        description: formValues.description.trim(),
        website: formValues.website,
      });
      setResult(response || {});
    } catch (err) {
      setServerError(err.message || 'Something went wrong. Please try again.');
    }
  });

  if (result) {
    return (
      <div className="complaint-form__done" role="status">
        <style>{styles}</style>
        <strong>Your complaint has been registered.</strong>
        {result.complaintNumber && (
          <p style={{ margin: '0.25rem 0' }}>
            Complaint number: <span className="complaint-form__number">{result.complaintNumber}</span>
            <br />
            Please keep this number for future reference.
          </p>
        )}
        We will respond within the timelines listed on our Grievance Redressal page.
      </div>
    );
  }

  const field = (name) => ({
    id: 'complaint-' + name,
    name,
    className: 'complaint-form__control',
    value: values[name],
    'aria-invalid': Boolean(errors[name]),
    'aria-describedby': errors[name] ? 'complaint-' + name + '-error' : undefined,
  });
  const errorText = (name) =>
    errors[name] ? <p id={'complaint-' + name + '-error'} className="complaint-form__error" role="alert">{errors[name]}</p> : null;

  return (
    <form className="complaint-form" onSubmit={onSubmit} noValidate aria-label="Complaint form">
      <style>{styles}</style>

      <div className="complaint-form__row">
        <div>
          <label className="complaint-form__label" htmlFor="complaint-name">Name</label>
          <input {...field('name')} type="text" autoComplete="name" required onChange={handleChange} />
          {errorText('name')}
        </div>
        <div>
          <label className="complaint-form__label" htmlFor="complaint-email">Email</label>
          <input {...field('email')} type="email" inputMode="email" autoComplete="email" required onChange={handleChange} />
          {errorText('email')}
        </div>
      </div>

      <div className="complaint-form__row">
        <div>
          <label className="complaint-form__label" htmlFor="complaint-phone">
            Mobile number <span className="complaint-form__optional">(optional)</span>
          </label>
          <input {...field('phone')} type="tel" inputMode="numeric" autoComplete="tel-national" maxLength={14} onChange={onPhoneChange} />
          {errorText('phone')}
        </div>
        <div>
          <label className="complaint-form__label" htmlFor="complaint-subject">Subject</label>
          <input {...field('subject')} type="text" maxLength={150} required onChange={handleChange} />
          {errorText('subject')}
        </div>
      </div>

      <div>
        <label className="complaint-form__label" htmlFor="complaint-description">Complaint details</label>
        <textarea {...field('description')} rows={6} maxLength={DESCRIPTION_MAX} required onChange={handleChange} />
        {errorText('description')}
        <p className="complaint-form__count" aria-live="polite">{values.description.length}/{DESCRIPTION_MAX}</p>
      </div>

      <div className="complaint-form__hp" aria-hidden="true">
        <label htmlFor="complaint-website">Leave this field empty</label>
        <input id="complaint-website" name="website" type="text" tabIndex={-1} autoComplete="off" value={values.website} onChange={handleChange} />
      </div>

      {serverError && <p className="complaint-form__error" role="alert">{serverError}</p>}

      <button type="submit" className="complaint-form__submit" disabled={submitting}>
        {submitting ? 'Submitting…' : 'Submit Complaint'}
      </button>
    </form>
  );
}
