const PURPOSES = ['plan', 'course'];
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const PHONE_RE = /^[6-9]\d{9}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const str = (value) => (typeof value === 'string' ? value.trim() : '');

// POST /api/payments/order body: { purpose, refId (plan/course slug), name, email, phone }.
// The amount is never accepted from the client.
export default function paymentValidator(body) {
  const data = {
    purpose: str(body.purpose),
    refId: str(body.refId).toLowerCase(),
    name: str(body.name),
    email: str(body.email).toLowerCase(),
    phone: str(body.phone).replace(/\D/g, ''),
  };

  const errors = [];
  if (!PURPOSES.includes(data.purpose)) errors.push('purpose must be one of ' + PURPOSES.join(', '));
  if (!SLUG_RE.test(data.refId) || data.refId.length > 100) errors.push('refId must be a plan or course slug');
  if (data.name.length < 2 || data.name.length > 100) errors.push('name is required');
  if (!EMAIL_RE.test(data.email) || data.email.length > 200) errors.push('a valid email is required for the receipt');
  if (!PHONE_RE.test(data.phone)) errors.push('phone must be a valid 10-digit mobile number');

  return { errors, data };
}

// POST /api/payments/verify body: { orderId }.
export function verifyPaymentValidator(body) {
  const orderId = str(body.orderId);
  return { errors: /^ORD-[A-Z0-9-]{6,40}$/.test(orderId) ? [] : ['orderId is invalid'], data: { orderId } };
}
