import crypto from 'node:crypto';
import Complaint from '../models/Complaint.js';
import asyncHandler from '../utils/asyncHandler.js';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const INDIAN_MOBILE = /^[6-9]\d{9}$/;
const MONTHS = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
const DAY_MS = 24 * 60 * 60 * 1000;

const str = (value) => (typeof value === 'string' ? value.trim() : '');

const newComplaintNumber = () => {
  const d = new Date();
  const ymd = d.getFullYear() + String(d.getMonth() + 1).padStart(2, '0') + String(d.getDate()).padStart(2, '0');
  return 'CMP-' + ymd + '-' + crypto.randomBytes(3).toString('hex').toUpperCase();
};

// POST /api/complaints — public complaint form.
export const createComplaint = asyncHandler(async (req, res) => {
  const body = req.body || {};
  // Honeypot: real users never fill this hidden field.
  if (str(body.website)) return res.status(201).json({ message: 'Complaint registered.' });

  const data = {
    name: str(body.name),
    email: str(body.email).toLowerCase(),
    phone: str(body.phone),
    subject: str(body.subject),
    description: str(body.description),
  };

  const errors = [];
  if (data.name.length < 2 || data.name.length > 100) errors.push('name is required');
  if (!EMAIL.test(data.email)) errors.push('email is invalid');
  if (data.phone && !INDIAN_MOBILE.test(data.phone)) errors.push('phone must be a valid 10-digit mobile number');
  if (data.subject.length < 3 || data.subject.length > 150) errors.push('subject is required (max 150 characters)');
  if (data.description.length < 10 || data.description.length > 3000) errors.push('description must be 10-3000 characters');
  if (errors.length) return res.status(400).json({ message: 'Validation failed', errors });

  // Retry on the (unlikely) complaint number collision.
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const complaint = await Complaint.create({ ...data, complaintNumber: newComplaintNumber() });
      return res.status(201).json({ complaintNumber: complaint.complaintNumber, message: 'Complaint registered.' });
    } catch (err) {
      if (err.code !== 11000 || attempt === 2) throw err;
    }
  }
  return undefined;
});

// GET /api/complaints/stats?fy=2026 — month-wise complaint data for the
// financial year starting April of `fy` (counts only, no personal data).
export const getComplaintStats = asyncHandler(async (req, res) => {
  const now = new Date();
  const currentFy = now.getMonth() >= 3 ? now.getFullYear() : now.getFullYear() - 1;
  const fy = req.query.fy === undefined ? currentFy : Number(req.query.fy);
  if (!Number.isInteger(fy) || fy < 2000 || fy > currentFy) {
    return res.status(400).json({ message: 'fy must be a year between 2000 and ' + currentFy });
  }

  const fyStart = new Date(fy, 3, 1);
  const fyEnd = new Date(fy + 1, 3, 1);
  const complaints = await Complaint.find({
    createdAt: { $lt: fyEnd },
    $or: [{ resolvedAt: null }, { resolvedAt: { $gte: fyStart } }],
  })
    .select('createdAt resolvedAt source -_id')
    .lean();

  const months = [];
  for (let i = 0; i < 12; i += 1) {
    const start = new Date(fy, 3 + i, 1);
    const end = new Date(fy, 4 + i, 1);
    if (start > now) break;

    const openAt = (date) => (c) => c.createdAt < date && (!c.resolvedAt || c.resolvedAt >= date);
    const carriedForward = complaints.filter(openAt(start)).length;
    const received = complaints.filter((c) => c.createdAt >= start && c.createdAt < end).length;
    const resolvedList = complaints.filter((c) => c.resolvedAt && c.resolvedAt >= start && c.resolvedAt < end);
    const pending = complaints.filter(openAt(end)).length;
    const pendingOver3Months = complaints.filter(
      (c) => openAt(end)(c) && end - c.createdAt > 90 * DAY_MS
    ).length;
    const avgResolutionDays = resolvedList.length
      ? Math.round(resolvedList.reduce((sum, c) => sum + (c.resolvedAt - c.createdAt) / DAY_MS, 0) / resolvedList.length)
      : null;

    months.push({
      month: MONTHS[i] + ' ' + start.getFullYear(),
      carriedForward,
      received,
      resolved: resolvedList.length,
      pending,
      pendingOver3Months,
      avgResolutionDays,
    });
  }

  res.set('Cache-Control', 'public, max-age=3600');
  return res.json({ financialYear: fy + '-' + String(fy + 1).slice(2), months });
});

// Admin only (see adminRoutes).
export const listComplaints = asyncHandler(async (req, res) => {
  const complaints = await Complaint.find().sort({ createdAt: -1 }).limit(500).lean();
  res.json(complaints);
});
