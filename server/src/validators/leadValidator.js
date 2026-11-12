const PHONE_RE = /^[6-9]\d{9}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SOURCES = ['trial', 'callback', 'contact'];

export default function leadValidator(body) {
  const errors = [];
  if (!body.name || !String(body.name).trim()) errors.push('name is required');
  if (!PHONE_RE.test(String(body.phone || ''))) errors.push('phone must be a valid 10-digit mobile number');
  if (body.email && !EMAIL_RE.test(String(body.email))) errors.push('email is invalid');
  if (!SOURCES.includes(body.source)) errors.push('source must be one of ' + SOURCES.join(', '));
  return errors;
}
