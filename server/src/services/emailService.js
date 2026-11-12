import nodemailer from 'nodemailer';
import { env } from '../config/env.js';
import logger from '../utils/logger.js';

// SMTP settings come only from environment variables (works with any SMTP
// provider, including Resend: set SMTP_HOST to smtp.resend.com, SMTP_USER to
// "resend" and SMTP_PASS to your Resend API key).
const smtp = () => ({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  user: process.env.SMTP_USER,
  pass: process.env.SMTP_PASS,
  from: process.env.EMAIL_FROM,
});

let transporter = null;
const getTransporter = () => {
  const cfg = smtp();
  if (!cfg.host || !cfg.user || !cfg.pass || !cfg.from) return null;
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: cfg.host,
      port: cfg.port,
      secure: cfg.port === 465,
      auth: { user: cfg.user, pass: cfg.pass },
    });
  }
  return transporter;
};

const escapeHtml = (value) =>
  String(value ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

const SOURCE_LABELS = { trial: 'Trial form', callback: 'Callback request', contact: 'Contact form', popup: 'Trial popup' };

// Sends one email. Returns { sent: boolean }. Never logs message bodies.
export async function sendEmail({ to, subject, text, html, replyTo }) {
  const transport = getTransporter();
  if (!transport) {
    if (env.nodeEnv === 'production') logger.warn('Email not sent: SMTP is not configured');
    else logger.warn('[dev] Email not sent (SMTP not configured): "' + subject + '"');
    return { sent: false };
  }
  await transport.sendMail({ from: smtp().from, to, subject, text, html, replyTo });
  return { sent: true };
}

// Internal alert to the team about a new lead.
export async function sendLeadAlert(lead) {
  const to = process.env.TEAM_ALERT_EMAIL;
  if (!to) {
    logger.warn('Lead alert not sent: TEAM_ALERT_EMAIL is not set');
    return { sent: false };
  }
  const rows = [
    ['Source', SOURCE_LABELS[lead.source] || lead.source],
    ['Page', lead.sourcePage || '—'],
    ['Name', lead.name || '—'],
    ['Mobile', '+91 ' + lead.phone],
    ['Email', lead.email || '—'],
    ['Segment', lead.segment || '—'],
    ['Message', lead.message || '—'],
    ['Consent', lead.consent ? 'Yes' : 'No'],
    ['Received', new Date(lead.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST'],
  ];
  const text = rows.map(([k, v]) => k + ': ' + v).join('\n');
  const html =
    '<h2 style="font-family:sans-serif">New lead</h2><table style="font-family:sans-serif;border-collapse:collapse">' +
    rows.map(([k, v]) => '<tr><td style="padding:4px 12px 4px 0;color:#555">' + escapeHtml(k) + '</td><td style="padding:4px 0"><strong>' + escapeHtml(v) + '</strong></td></tr>').join('') +
    '</table>';

  return sendEmail({
    to,
    subject: 'New lead: ' + (SOURCE_LABELS[lead.source] || lead.source) + ' — ' + (lead.name || '+91 ' + lead.phone),
    text,
    html,
    replyTo: lead.email || undefined,
  });
}

// Auto-reply to the visitor (only when they gave an email).
export async function sendLeadAutoReply(lead) {
  if (!lead.email) return { sent: false };
  const greeting = 'Hi ' + (lead.name || 'there') + ',';
  const body = [
    'Thank you for contacting us. We have received your request and our team will get in touch with you shortly.',
    '[YOUR AUTO-REPLY TEXT]',
    'Investments in securities market are subject to market risks. Read all the related documents carefully before investing.',
  ];
  return sendEmail({
    to: lead.email,
    subject: 'We have received your request',
    text: [greeting, '', ...body, '', '[YOUR NAME]', 'SEBI Registered Research Analyst'].join('\n'),
    html:
      '<div style="font-family:sans-serif;line-height:1.6"><p>' + escapeHtml(greeting) + '</p>' +
      body.map((p) => '<p>' + escapeHtml(p) + '</p>').join('') +
      '<p>[YOUR NAME]<br>SEBI Registered Research Analyst</p></div>',
  });
}
