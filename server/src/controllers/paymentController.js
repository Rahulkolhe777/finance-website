import crypto from 'node:crypto';
import Payment from '../models/Payment.js';
import Plan from '../models/Plan.js';
import Course from '../models/Course.js';
import Subscription from '../models/Subscription.js';
import Enrollment from '../models/Enrollment.js';
import { env } from '../config/env.js';
import asyncHandler from '../utils/asyncHandler.js';
import logger from '../utils/logger.js';
import { createPaymentLink, fetchPaymentStatus, getGatewayName } from '../services/paymentGateway.js';
import { assignInvoiceNumber, chargeableAmountPaise, renderInvoiceHtml } from '../services/invoiceService.js';
import { sendEmail } from '../services/emailService.js';

const ORDER_ID_RE = /^ORD-[A-Z0-9-]{6,40}$/;
const DAY_MS = 24 * 60 * 60 * 1000;

const newOrderId = () => {
  const d = new Date();
  const ymd = d.getFullYear() + String(d.getMonth() + 1).padStart(2, '0') + String(d.getDate()).padStart(2, '0');
  return 'ORD-' + ymd + '-' + crypto.randomBytes(5).toString('hex').toUpperCase();
};

// Public URL the gateway redirects back to (our API, not the React app).
const apiBaseUrl = (req) => (process.env.API_PUBLIC_URL || req.protocol + '://' + req.get('host')).replace(/\/$/, '');
const clientUrl = (path) => env.clientUrl.replace(/\/$/, '') + path;

// Looks up the item being bought. Price always comes from the database.
const findItem = async (purpose, slug) => {
  if (purpose === 'plan') {
    const plan = await Plan.findOne({ slug, isActive: true }).lean();
    return plan && { doc: plan, title: plan.name + ' plan (' + plan.segment + ')', pricePaise: Math.round(plan.price * 100) };
  }
  const course = await Course.findOne({ slug, isPublished: true }).lean();
  return course && { doc: course, title: course.title + ' (course)', pricePaise: Math.round(course.price * 100) };
};

const failedPath = (payment) => '/payment/failed?' + (payment.purpose === 'plan' ? 'plan=' : 'course=') + encodeURIComponent(payment.refSlug);

// Creates the Subscription / Enrollment once a payment is confirmed.
const activatePurchase = async (payment) => {
  const person = { name: payment.customer.name, email: payment.customer.email, phone: payment.customer.phone };
  if (payment.purpose === 'plan') {
    const plan = await Plan.findById(payment.refId).lean();
    const start = payment.paidAt;
    const end = plan ? new Date(start.getTime() + plan.durationDays * DAY_MS) : undefined;
    await Subscription.updateOne(
      { payment: payment._id },
      { $setOnInsert: { ...person, plan: payment.refId, payment: payment._id, startDate: start, endDate: end, status: 'active' } },
      { upsert: true }
    );
  } else {
    await Enrollment.updateOne(
      { payment: payment._id },
      { $setOnInsert: { ...person, course: payment.refId, payment: payment._id, status: 'active' } },
      { upsert: true }
    );
  }
};

// Receipt + GST invoice to the customer and an alert to the team.
const sendPaymentEmails = async (payment) => {
  const invoice = renderInvoiceHtml(payment);
  const amount = '₹' + (payment.amountPaise / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 });
  await sendEmail({
    to: payment.customer.email,
    subject: 'Payment received — ' + payment.invoiceNumber,
    text: 'Hi ' + payment.customer.name + ',\n\nWe have received your payment of ' + amount + ' for ' + payment.description +
      '.\nOrder ID: ' + payment.orderId + '\nInvoice: ' + payment.invoiceNumber + '\n\nYour tax invoice is included in this email.\n\n[YOUR NAME]',
    html: '<div style="font-family:Arial,sans-serif;line-height:1.6"><p>Hi ' + payment.customer.name.replace(/[<>&"']/g, '') +
      ',</p><p>We have received your payment. Your tax invoice is below.</p>' + invoice + '<p>[YOUR NAME]</p></div>',
  });
  await Payment.updateOne({ _id: payment._id }, { $set: { receiptSentAt: new Date() } });

  if (process.env.TEAM_ALERT_EMAIL) {
    await sendEmail({
      to: process.env.TEAM_ALERT_EMAIL,
      subject: 'New payment: ' + amount + ' — ' + payment.description,
      text: 'Order ' + payment.orderId + ' paid via ' + payment.gateway + '.\nCustomer: ' + payment.customer.name + ', ' +
        payment.customer.email + ', +91 ' + payment.customer.phone + '\nInvoice: ' + payment.invoiceNumber,
    });
  }
};

// Confirms payment with the gateway (server-to-server) and finalises it once.
// Returns the payment status after the check.
const reconcile = async (payment) => {
  if (payment.status === 'paid') return 'paid';
  if (!payment.gatewayLinkId) return payment.status;

  const result = await fetchPaymentStatus(payment.gateway, payment.gatewayLinkId);
  if (result.status !== 'paid') {
    if (result.status === 'expired' || result.status === 'cancelled') {
      await Payment.updateOne({ _id: payment._id, status: 'created' }, { $set: { status: result.status } });
    }
    return result.status;
  }
  if (result.amountPaidPaise < payment.amountPaise) {
    logger.error('Payment ' + payment.orderId + ': amount paid is less than amount due');
    return 'pending';
  }

  // Only the first caller flips the status, so side effects run exactly once.
  const paid = await Payment.findOneAndUpdate(
    { _id: payment._id, status: { $ne: 'paid' } },
    { $set: { status: 'paid', paidAt: new Date(), gatewayPaymentId: result.paymentId || undefined } },
    { new: true }
  );
  if (!paid) return 'paid';

  await activatePurchase(paid);
  paid.invoiceNumber = await assignInvoiceNumber(paid._id, paid.paidAt);
  sendPaymentEmails(paid).catch((err) => logger.warn('Payment ' + paid.orderId + ': emails failed: ' + err.message));
  return 'paid';
};

// POST /api/payments/order — creates our order + a hosted checkout link.
export const createOrder = asyncHandler(async (req, res) => {
  const { purpose, refId, name, email, phone } = req.body;
  const item = await findItem(purpose, refId);
  if (!item) return res.status(404).json({ message: (purpose === 'plan' ? 'Plan' : 'Course') + ' not found' });
  if (item.pricePaise < 100) return res.status(400).json({ message: 'This item cannot be paid for online' });

  const gateway = getGatewayName();
  if (!gateway) return res.status(503).json({ message: 'Online payments are not configured yet' });

  const orderId = newOrderId();
  const amountPaise = chargeableAmountPaise(item.pricePaise);
  const customer = { name, email, phone };

  // Save our order first so every gateway link maps to a stored payment.
  const payment = await Payment.create({
    orderId,
    purpose,
    refId: item.doc._id,
    refSlug: refId,
    description: item.title,
    amountPaise,
    customer,
    gateway,
  });

  try {
    const link = await createPaymentLink({
      orderId,
      amountPaise,
      description: item.title,
      customer,
      returnUrl: apiBaseUrl(req) + '/api/payments/return?order=' + orderId,
    });
    await Payment.updateOne({ _id: payment._id }, { $set: { gatewayLinkId: link.linkId } });
    return res.status(201).json({ orderId, redirectUrl: link.url });
  } catch (err) {
    await Payment.updateOne({ _id: payment._id }, { $set: { status: 'failed' } });
    throw err;
  }
});

// GET /api/payments/return?order=… — the gateway sends the browser here.
// Status is checked with the gateway, never trusted from query parameters.
export const paymentReturn = asyncHandler(async (req, res) => {
  const orderId = String(req.query.order || '');
  const payment = ORDER_ID_RE.test(orderId) ? await Payment.findOne({ orderId }) : null;
  if (!payment) return res.redirect(303, clientUrl('/payment/failed'));

  try {
    const status = await reconcile(payment);
    if (status === 'paid') return res.redirect(303, clientUrl('/payment/success?order=' + encodeURIComponent(orderId)));
  } catch (err) {
    logger.error('Payment ' + orderId + ': return check failed: ' + err.message);
  }
  return res.redirect(303, clientUrl(failedPath(payment)));
});

// POST /api/payments/verify { orderId } — re-check a payment (e.g. from the success page).
export const verifyPayment = asyncHandler(async (req, res) => {
  const payment = await Payment.findOne({ orderId: req.body.orderId });
  if (!payment) return res.status(404).json({ message: 'Order not found' });
  const status = await reconcile(payment);
  return res.json({ orderId: payment.orderId, status });
});

// GET /api/payments/:orderId/status — minimal, no personal data.
export const getPaymentStatus = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  if (!ORDER_ID_RE.test(orderId)) return res.status(400).json({ message: 'orderId is invalid' });
  const payment = await Payment.findOne({ orderId }).select('orderId status purpose description amountPaise invoiceNumber -_id').lean();
  if (!payment) return res.status(404).json({ message: 'Order not found' });
  return res.json(payment);
});
