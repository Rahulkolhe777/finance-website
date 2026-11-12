import Complaint from '../models/Complaint.js';
import asyncHandler from '../utils/asyncHandler.js';

export const createComplaint = asyncHandler(async (req, res) => {
  const { name, email, phone, subject, description } = req.body;
  if (!name || !email || !subject || !description) {
    return res.status(400).json({ message: 'name, email, subject and description are required' });
  }
  const complaint = await Complaint.create({ name, email, phone, subject, description });
  return res.status(201).json({ id: complaint._id, message: 'Complaint registered.' });
});

export const listComplaints = asyncHandler(async (req, res) => {
  const complaints = await Complaint.find().sort({ createdAt: -1 }).limit(500).lean();
  res.json(complaints);
});
