import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    subject: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    status: { type: String, enum: ['received', 'in_progress', 'resolved'], default: 'received' },
    resolution: { type: String },
    resolvedAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model('Complaint', complaintSchema);
