// Payment gateway adapter: Razorpay or Cashfree, chosen by PAYMENT_GATEWAY.
// Both use hosted *payment links*, so the browser is simply redirected to the
// gateway's checkout page and back to our /api/payments/return endpoint.
//
// Env (secrets only in .env, never in code):
//   PAYMENT_GATEWAY      razorpay | cashfree
//   PAYMENT_KEY_ID       Razorpay key id / Cashfree app id
//   PAYMENT_KEY_SECRET   Razorpay key secret / Cashfree secret key
//   PAYMENT_ENV          sandbox | production   (Cashfree base URL; Razorpay uses test/live keys)
//
// NOTE: written against the public Razorpay Payment Links and Cashfree PG
// Links APIs; verify field names against the gateway's current docs and test
// end-to-end in sandbox before going live.

const SUPPORTED = ['razorpay', 'cashfree'];
const CASHFREE_API_VERSION = '2023-08-01';
const LINK_TTL_MS = 30 * 60 * 1000;

const httpError = (message, statusCode) => Object.assign(new Error(message), { statusCode });

export const getGatewayName = () => {
  const name = (process.env.PAYMENT_GATEWAY || '').toLowerCase();
  return SUPPORTED.includes(name) ? name : null;
};

const credentials = () => {
  const gateway = getGatewayName();
  const keyId = process.env.PAYMENT_KEY_ID;
  const keySecret = process.env.PAYMENT_KEY_SECRET;
  if (!gateway || !keyId || !keySecret) throw httpError('Online payments are not configured yet', 503);
  return { gateway, keyId, keySecret };
};

const requestJson = async (url, options, label) => {
  const res = await fetch(url, options);
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    // Never forward gateway error bodies to the client; keep them generic.
    throw httpError(label + ' failed (' + res.status + ')', 502);
  }
  return body;
};

/* ---------------- Razorpay ---------------- */
const razorpayHeaders = ({ keyId, keySecret }) => ({
  Authorization: 'Basic ' + Buffer.from(keyId + ':' + keySecret).toString('base64'),
  'Content-Type': 'application/json',
});

const RAZORPAY_STATUS = { paid: 'paid', created: 'pending', partially_paid: 'pending', expired: 'expired', cancelled: 'cancelled' };

const razorpay = {
  async createLink(creds, { orderId, amountPaise, description, customer, returnUrl }) {
    const body = await requestJson(
      'https://api.razorpay.com/v1/payment_links',
      {
        method: 'POST',
        headers: razorpayHeaders(creds),
        body: JSON.stringify({
          amount: amountPaise,
          currency: 'INR',
          reference_id: orderId,
          description: description.slice(0, 2048),
          customer: { name: customer.name, email: customer.email, contact: '+91' + customer.phone },
          notify: { sms: false, email: false },
          reminder_enable: false,
          callback_url: returnUrl,
          callback_method: 'get',
          expire_by: Math.floor((Date.now() + LINK_TTL_MS) / 1000),
        }),
      },
      'Razorpay payment link'
    );
    return { linkId: body.id, url: body.short_url };
  },

  async fetchStatus(creds, linkId) {
    const body = await requestJson(
      'https://api.razorpay.com/v1/payment_links/' + encodeURIComponent(linkId),
      { headers: razorpayHeaders(creds) },
      'Razorpay status check'
    );
    const captured = (body.payments || []).find((p) => p.status === 'captured');
    return {
      status: RAZORPAY_STATUS[body.status] || 'pending',
      amountPaidPaise: Number(body.amount_paid) || 0,
      paymentId: captured?.payment_id || null,
    };
  },
};

/* ---------------- Cashfree ---------------- */
const cashfreeBase = () =>
  (process.env.PAYMENT_ENV || 'sandbox') === 'production' ? 'https://api.cashfree.com/pg' : 'https://sandbox.cashfree.com/pg';

const cashfreeHeaders = ({ keyId, keySecret }) => ({
  'x-client-id': keyId,
  'x-client-secret': keySecret,
  'x-api-version': CASHFREE_API_VERSION,
  'Content-Type': 'application/json',
});

const CASHFREE_STATUS = { PAID: 'paid', ACTIVE: 'pending', PARTIALLY_PAID: 'pending', EXPIRED: 'expired', CANCELLED: 'cancelled' };

const cashfree = {
  async createLink(creds, { orderId, amountPaise, description, customer, returnUrl }) {
    const body = await requestJson(
      cashfreeBase() + '/links',
      {
        method: 'POST',
        headers: cashfreeHeaders(creds),
        body: JSON.stringify({
          link_id: orderId,
          link_amount: amountPaise / 100,
          link_currency: 'INR',
          link_purpose: description.slice(0, 500),
          customer_details: { customer_name: customer.name, customer_email: customer.email, customer_phone: customer.phone },
          link_meta: { return_url: returnUrl },
          link_notify: { send_sms: false, send_email: false },
          link_expiry_time: new Date(Date.now() + LINK_TTL_MS).toISOString(),
        }),
      },
      'Cashfree payment link'
    );
    return { linkId: body.link_id, url: body.link_url };
  },

  async fetchStatus(creds, linkId) {
    const body = await requestJson(
      cashfreeBase() + '/links/' + encodeURIComponent(linkId),
      { headers: cashfreeHeaders(creds) },
      'Cashfree status check'
    );
    return {
      status: CASHFREE_STATUS[body.link_status] || 'pending',
      amountPaidPaise: Math.round((Number(body.link_amount_paid) || 0) * 100),
      paymentId: null,
    };
  },
};

const ADAPTERS = { razorpay, cashfree };

// Creates a hosted checkout link. Returns { gateway, linkId, url }.
export async function createPaymentLink(order) {
  const creds = credentials();
  const link = await ADAPTERS[creds.gateway].createLink(creds, order);
  if (!link.linkId || !link.url) throw httpError('Payment gateway returned an invalid response', 502);
  return { gateway: creds.gateway, ...link };
}

// Asks the gateway (server-to-server) whether a link was paid.
// Returns { status: 'paid'|'pending'|'expired'|'cancelled', amountPaidPaise, paymentId }.
export async function fetchPaymentStatus(gateway, linkId) {
  const creds = credentials();
  if (creds.gateway !== gateway) throw httpError('Payment was created with a different gateway', 409);
  return ADAPTERS[gateway].fetchStatus(creds, linkId);
}
