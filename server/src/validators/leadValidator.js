import { LEAD_SEGMENTS, LEAD_SOURCES } from '../models/Lead.js';

const PHONE_RE = /^[6-9]\d{9}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const CONSENT_REQUIRED = ['trial', 'callback', 'popup'];

const str = (value) => (typeof value === 'string' ? value.trim() : '');

// Only keep the page path from a URL or path (no query string / hash).
const toPath = (value) => {
  const raw = str(value);
  if (!raw) return '';
  try {
    return new URL(raw, 'http://local').pathname.slice(0, 300);
  } catch {
    return '';
  }
};

// Returns { errors, data } — `data` is the whitelisted, normalised lead.
export default function leadValidator(body) {
  const source = str(body.source);
  const data = {
    name: str(body.name),
    phone: str(body.phone).replace(/\D/g, ''),
    email: str(body.email).toLowerCase(),
    source,
    sourcePage: toPath(body.sourcePage),
    segment: str(body.segment),
    message: str(body.message),
    consent: body.consent === true,
    website: str(body.website), // honeypot, never stored
  };

  const errors = [];
  if (!LEAD_SOURCES.includes(source)) errors.push('source must be one of ' + LEAD_SOURCES.join(', '));
  if (!PHONE_RE.test(data.phone)) errors.push('phone must be a valid 10-digit mobile number');
  if (source !== 'callback' && (data.name.length < 2 || data.name.length > 100)) errors.push('name is required');
  if (data.email && (!EMAIL_RE.test(data.email) || data.email.length > 200)) errors.push('email is invalid');
  if (source === 'contact') {
    if (!data.email) errors.push('email is required');
    if (data.message.length < 10) errors.push('message must be at least 10 characters');
  }
  if (data.message.length > 1000) errors.push('message must be at most 1000 characters');
  if (data.segment && !LEAD_SEGMENTS.includes(data.segment)) errors.push('segment is invalid');
  if (CONSENT_REQUIRED.includes(source) && !data.consent) errors.push('consent is required');

  return { errors, data };
}
