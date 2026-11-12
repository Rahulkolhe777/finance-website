import crypto from 'node:crypto';
import { env } from '../config/env.js';
import logger from '../utils/logger.js';

const OTP_LENGTH = 6;
const OTP_TTL_MS = 5 * 60 * 1000;
const RESEND_COOLDOWN_MS = 30 * 1000;
const MAX_ATTEMPTS = 5;
const INDIAN_MOBILE = /^[6-9]\d{9}$/;

// In-memory store: phone -> { hash, expiresAt, sentAt, attempts }.
// NOTE: single-instance only and cleared on restart. Move to MongoDB/Redis
// before running more than one server instance.
const otpStore = new Map();

const hashOtp = (phone, code) => crypto.createHash('sha256').update(phone + ':' + code).digest('hex');

const assertPhone = (phone) => {
  if (!INDIAN_MOBILE.test(String(phone))) {
    const err = new Error('Invalid mobile number');
    err.statusCode = 400;
    throw err;
  }
};

const pruneExpired = () => {
  const now = Date.now();
  for (const [phone, entry] of otpStore) {
    if (entry.expiresAt <= now) otpStore.delete(phone);
  }
};

// Provider adapter. Credentials come only from environment variables.
// TODO: call your SMS provider's API here ([SMS PROVIDER]); DLT-registered
// templates are required for SMS in India.
async function deliverSms(phone, text) {
  const apiKey = process.env.SMS_API_KEY;
  if (!apiKey) {
    if (env.nodeEnv === 'production') {
      throw new Error('SMS provider is not configured (SMS_API_KEY missing)');
    }
    // Development only: never log message contents in production.
    logger.warn('[dev] SMS not sent (no SMS_API_KEY). To +91' + phone + ': ' + text);
    return { delivered: false, dev: true };
  }
  throw new Error('SMS provider integration not implemented yet');
}

// Send a one-time password. Returns { expiresInSeconds }.
export async function sendOtp(phone) {
  assertPhone(phone);
  pruneExpired();

  const existing = otpStore.get(phone);
  if (existing && Date.now() - existing.sentAt < RESEND_COOLDOWN_MS) {
    const err = new Error('Please wait before requesting another OTP');
    err.statusCode = 429;
    throw err;
  }

  const code = String(crypto.randomInt(0, 10 ** OTP_LENGTH)).padStart(OTP_LENGTH, '0');
  otpStore.set(phone, {
    hash: hashOtp(phone, code),
    expiresAt: Date.now() + OTP_TTL_MS,
    sentAt: Date.now(),
    attempts: 0,
  });

  await deliverSms(phone, 'Your verification code is ' + code + '. It is valid for 5 minutes. Do not share it with anyone.');
  return { expiresInSeconds: OTP_TTL_MS / 1000 };
}

// Check a code. Returns true once (the OTP is consumed on success).
export async function verifyOtp(phone, code) {
  assertPhone(phone);
  const entry = otpStore.get(phone);
  if (!entry || entry.expiresAt <= Date.now()) {
    otpStore.delete(phone);
    return false;
  }

  entry.attempts += 1;
  if (entry.attempts > MAX_ATTEMPTS) {
    otpStore.delete(phone);
    return false;
  }

  const expected = Buffer.from(entry.hash, 'hex');
  const actual = Buffer.from(hashOtp(phone, String(code ?? '')), 'hex');
  const ok = crypto.timingSafeEqual(expected, actual);
  if (ok) otpStore.delete(phone);
  return ok;
}

// Plain confirmation SMS (e.g. after a trial request).
export async function sendConfirmationSms(phone, message) {
  assertPhone(phone);
  return deliverSms(phone, message);
}
