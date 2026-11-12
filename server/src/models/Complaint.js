import mongoose from 'mongoose';

export const COMPLAINT_STATUSES = ['received', 'in_progress', 'resolved'];
// Where the complaint came from (used in the public complaint data table).
export const COMPLAINT_SOURCES = ['direct', 'scores', 'other'];

const complaintSchema = new mongoose.Schema(
  {
    complaintNumber: { type: String, required: true, unique: true },
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, lowercase: true, trim: true, maxlength: 200 },
    phone: { type: String, trim: true, maxlength: 15 },
    subject: { type: String, required: true, trim: true, maxlength: 150 },
    description: { type: String, required: true, maxlength: 3000 },
    source: { type: String, enum: COMPLAINT_SOURCES, default: 'direct' },
    status: { type: String, enum: COMPLAINT_STATUSES, default: 'received' },
    resolution: { type: String },
    resolvedAt: { type: Date },
  },
  { timestamps: true }
);

complaintSchema.index({ createdAt: 1 });
complaintSchema.index({ resolvedAt: 1 });

export default mongoose.model('Complaint', complaintSchema);
