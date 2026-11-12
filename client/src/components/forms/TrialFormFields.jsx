import { Link } from 'react-router-dom';
import { services } from '../../data/services.js';

const styles = `
.trial-fields { display: grid; gap: 1.125rem; }
.trial-fields__label {
  display: block;
  margin-bottom: 0.375rem;
  font-size: 0.875rem;
  font-weight: 700;
  color: #0B1B2B;
}
.trial-fields__required { color: #B42318; }
.trial-fields__control {
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
select.trial-fields__control { appearance: none; background-image: linear-gradient(45deg, transparent 50%, #0B1B2B 50%), linear-gradient(135deg, #0B1B2B 50%, transparent 50%); background-position: calc(100% - 22px) 50%, calc(100% - 16px) 50%; background-size: 6px 6px; background-repeat: no-repeat; padding-right: 2.5rem; }
.trial-fields__control:focus {
  outline: none;
  border-color: #0B7A57;
  box-shadow: 0 0 0 4px rgba(11, 122, 87, 0.15);
}
.trial-fields__control[aria-invalid='true'] { border-color: #C2410C; }
.trial-fields__phone { display: flex; align-items: stretch; }
.trial-fields__prefix {
  display: inline-flex;
  align-items: center;
  padding: 0 0.875rem;
  border: 1.5px solid #D9E5E0;
  border-right: 0;
  border-radius: 12px 0 0 12px;
  background: #EEF5F2;
  font-weight: 700;
}
.trial-fields__phone .trial-fields__control { border-radius: 0 12px 12px 0; }
.trial-fields__error { margin: 0.375rem 0 0; font-size: 0.8125rem; color: #B42318; }
.trial-fields__consent {
  display: flex;
  gap: 0.625rem;
  align-items: flex-start;
  font-size: 0.875rem;
  line-height: 1.6;
  color: #4F5F6B;
  cursor: pointer;
}
.trial-fields__consent input { flex-shrink: 0; width: 20px; height: 20px; margin: 0.1em 0 0; accent-color: #0B7A57; }
.trial-fields__consent a { color: #0B7A57; text-decoration: underline; }
.trial-fields__row { display: grid; gap: 1.125rem; }
@media (min-width: 640px) {
  .trial-fields__row { grid-template-columns: 1fr 1fr; }
}
`;

const errorId = (name) => 'trial-' + name + '-error';
const describedBy = (errors, name) => (errors[name] ? errorId(name) : undefined);

// Presentational fields for the trial form. State and validation live in the page.
export default function TrialFormFields({ values, errors, onChange, onPhoneChange }) {
  const errorText = (name) =>
    errors[name] ? <p id={errorId(name)} className="trial-fields__error" role="alert">{errors[name]}</p> : null;

  return (
    <div className="trial-fields">
      <style>{styles}</style>

      <div>
        <label className="trial-fields__label" htmlFor="trial-name">
          Full name <span className="trial-fields__required" aria-hidden="true">*</span>
        </label>
        <input
          id="trial-name"
          name="name"
          type="text"
          autoComplete="name"
          className="trial-fields__control"
          value={values.name}
          onChange={onChange}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={describedBy(errors, 'name')}
          required
        />
        {errorText('name')}
      </div>

      <div className="trial-fields__row">
        <div>
          <label className="trial-fields__label" htmlFor="trial-phone">
            Mobile number <span className="trial-fields__required" aria-hidden="true">*</span>
          </label>
          <div className="trial-fields__phone">
            <span className="trial-fields__prefix" aria-hidden="true">+91</span>
            <input
              id="trial-phone"
              name="phone"
              type="tel"
              inputMode="numeric"
              autoComplete="tel-national"
              placeholder="10-digit mobile"
              className="trial-fields__control"
              value={values.phone}
              onChange={onPhoneChange}
              maxLength={14}
              aria-invalid={Boolean(errors.phone)}
              aria-describedby={describedBy(errors, 'phone')}
              required
            />
          </div>
          {errorText('phone')}
        </div>

        <div>
          <label className="trial-fields__label" htmlFor="trial-email">
            Email <span className="trial-fields__required" aria-hidden="true">*</span>
          </label>
          <input
            id="trial-email"
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            className="trial-fields__control"
            value={values.email}
            onChange={onChange}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={describedBy(errors, 'email')}
            required
          />
          {errorText('email')}
        </div>
      </div>

      <div>
        <label className="trial-fields__label" htmlFor="trial-segment">
          Segment of interest <span className="trial-fields__required" aria-hidden="true">*</span>
        </label>
        <select
          id="trial-segment"
          name="segment"
          className="trial-fields__control"
          value={values.segment}
          onChange={onChange}
          aria-invalid={Boolean(errors.segment)}
          aria-describedby={describedBy(errors, 'segment')}
          required
        >
          <option value="">Select a segment</option>
          {services.map((service) => (
            <option key={service.id} value={service.id}>{service.title}</option>
          ))}
        </select>
        {errorText('segment')}
      </div>

      <div>
        <label className="trial-fields__consent" htmlFor="trial-consent">
          <input
            id="trial-consent"
            name="consent"
            type="checkbox"
            checked={values.consent}
            onChange={onChange}
            aria-invalid={Boolean(errors.consent)}
            aria-describedby={describedBy(errors, 'consent')}
            required
          />
          <span>
            I have read and agree to the <Link to="/legal/user-consent">User Consent</Link> terms and agree to be
            contacted by phone, SMS, WhatsApp and email about my trial.
          </span>
        </label>
        {errorText('consent')}
      </div>
    </div>
  );
}
