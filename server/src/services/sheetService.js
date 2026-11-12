import crypto from 'node:crypto';
import logger from '../utils/logger.js';

// Optional: mirror each new lead into a Google Sheet using a service account.
// Env: GOOGLE_SHEET_ID, GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY
// (and optionally GOOGLE_SHEET_RANGE, default "Leads!A1").
// Share the sheet with the service account email as an Editor.

const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const SCOPE = 'https://www.googleapis.com/auth/spreadsheets';

let cachedToken = null; // { token, expiresAt }

const config = () => ({
  sheetId: process.env.GOOGLE_SHEET_ID,
  clientEmail: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  // Keys stored in env vars usually have literal "\n" sequences.
  privateKey: (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
  range: process.env.GOOGLE_SHEET_RANGE || 'Leads!A1',
});

const base64url = (input) => Buffer.from(input).toString('base64url');

async function getAccessToken({ clientEmail, privateKey }) {
  if (cachedToken && cachedToken.expiresAt - 60_000 > Date.now()) return cachedToken.token;

  const now = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claims = base64url(JSON.stringify({ iss: clientEmail, scope: SCOPE, aud: TOKEN_URL, iat: now, exp: now + 3600 }));
  const signature = crypto.createSign('RSA-SHA256').update(header + '.' + claims).sign(privateKey, 'base64url');

  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: header + '.' + claims + '.' + signature,
    }),
  });
  if (!res.ok) throw new Error('Google token request failed (' + res.status + ')');
  const data = await res.json();
  cachedToken = { token: data.access_token, expiresAt: Date.now() + data.expires_in * 1000 };
  return cachedToken.token;
}

// Appends one row per lead. Returns { appended: boolean }.
export async function appendLeadToSheet(lead) {
  const cfg = config();
  if (!cfg.sheetId || !cfg.clientEmail || !cfg.privateKey) return { appended: false };

  const token = await getAccessToken(cfg);
  const row = [
    new Date(lead.createdAt).toISOString(),
    lead.source,
    lead.sourcePage || '',
    lead.name || '',
    lead.phone,
    lead.email || '',
    lead.segment || '',
    lead.message || '',
    lead.consent ? 'yes' : 'no',
  ];

  const url =
    'https://sheets.googleapis.com/v4/spreadsheets/' + encodeURIComponent(cfg.sheetId) +
    '/values/' + encodeURIComponent(cfg.range) + ':append?valueInputOption=RAW&insertDataOption=INSERT_ROWS';
  const res = await fetch(url, {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
    body: JSON.stringify({ values: [row] }),
  });
  if (!res.ok) {
    logger.warn('Google Sheets append failed (' + res.status + ')');
    return { appended: false };
  }
  return { appended: true };
}
