const PURPOSES = ['plan', 'course'];

export default function paymentValidator(body) {
  const errors = [];
  if (!PURPOSES.includes(body.purpose)) errors.push('purpose must be one of ' + PURPOSES.join(', '));
  if (!body.refId) errors.push('refId is required');
  return errors;
}
