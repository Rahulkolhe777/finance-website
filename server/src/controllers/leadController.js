import Lead from '../models/Lead.js';
import asyncHandler from '../utils/asyncHandler.js';

export const createLead = asyncHandler(async (req, res) => {
  const { name, phone, email, source, message, consent } = req.body;
  const lead = await Lead.create({ name, phone, email, source, message, consent: Boolean(consent) });
  res.status(201).json({ id: lead._id, message: 'Thank you, we will get in touch shortly.' });
});

export const listLeads = asyncHandler(async (req, res) => {
  const leads = await Lead.find().sort({ createdAt: -1 }).limit(500).lean();
  res.json(leads);
});
