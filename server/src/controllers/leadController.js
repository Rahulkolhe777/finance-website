import Lead from '../models/Lead.js';
import asyncHandler from '../utils/asyncHandler.js';
import logger from '../utils/logger.js';
import { sendLeadAlert, sendLeadAutoReply } from '../services/emailService.js';
import { appendLeadToSheet } from '../services/sheetService.js';
import { sendConfirmationSms } from '../services/otpService.js';

const DEDUPE_WINDOW_MS = 24 * 60 * 60 * 1000;
const THANK_YOU = 'Thank you, we will get in touch shortly.';

// Page the form was submitted on: explicit sourcePage, else the Referer path.
const resolveSourcePage = (req) => {
  if (req.body.sourcePage) return req.body.sourcePage;
  try {
    return new URL(req.get('referer')).pathname.slice(0, 300);
  } catch {
    return undefined;
  }
};

// Alerts, auto-reply, sheet sync and SMS run after the response is sent;
// a failure in any of them never loses the lead.
const notify = (lead) => {
  const tasks = [
    ['team alert', sendLeadAlert(lead)],
    ['auto-reply', sendLeadAutoReply(lead)],
    ['sheet sync', appendLeadToSheet(lead)],
  ];
  if (lead.source === 'trial' || lead.source === 'popup') {
    tasks.push(['confirmation SMS', sendConfirmationSms(lead.phone, 'Thank you for requesting a trial. Our team will contact you shortly. Priya Kolhe')]);
  }
  Promise.allSettled(tasks.map(([, p]) => p)).then((results) => {
    results.forEach((r, i) => {
      if (r.status === 'rejected') logger.warn('Lead ' + lead._id + ': ' + tasks[i][0] + ' failed: ' + r.reason?.message);
    });
  });
};

// POST /api/leads — trial, callback, contact and popup forms.
export const createLead = asyncHandler(async (req, res) => {
  const { website, ...input } = req.body;

  // Honeypot filled: answer like a success, store nothing.
  if (website) return res.status(201).json({ message: THANK_YOU });

  const now = new Date();

  // Deduplicate: same mobile + email within 24 h updates the existing lead.
  const duplicate = await Lead.findOneAndUpdate(
    {
      phone: input.phone,
      email: input.email || { $in: [null, ''] },
      createdAt: { $gte: new Date(now.getTime() - DEDUPE_WINDOW_MS) },
    },
    { $inc: { submissionCount: 1 }, $set: { lastSubmittedAt: now } },
    { sort: { createdAt: -1 }, new: true }
  );
  if (duplicate) return res.status(200).json({ message: THANK_YOU });

  const lead = await Lead.create({
    name: input.name || undefined,
    phone: input.phone,
    email: input.email || undefined,
    source: input.source,
    sourcePage: resolveSourcePage(req),
    segment: input.segment || undefined,
    message: input.message || undefined,
    consent: input.consent,
    consentAt: input.consent ? now : undefined,
  });

  res.status(201).json({ message: THANK_YOU });
  notify(lead);
  return undefined;
});

// Admin only (see adminRoutes).
export const listLeads = asyncHandler(async (req, res) => {
  const leads = await Lead.find().sort({ createdAt: -1 }).limit(500).lean();
  res.json(leads);
});
