import mongoose from 'mongoose';

export const LEAD_SOURCES = ['trial', 'callback', 'contact', 'popup'];
export const LEAD_SEGMENTS = ['advisory', 'cash', 'stock-options', 'index-options', 'commodities', 'energy'];

const leadSchema = new mongoose.Schema(
  {
    // Name is optional only for callback requests (mobile number only).
    name: { type: String, trim: true, maxlength: 100 },
    phone: { type: String, required: true, trim: true, match: /^[6-9]\d{9}$/ },
    email: { type: String, trim: true, lowercase: true, maxlength: 200 },
    // Which form the lead came from, and the page it was submitted on.
    source: { type: String, enum: LEAD_SOURCES, required: true },
    sourcePage: { type: String, trim: true, maxlength: 300 },
    segment: { type: String, enum: LEAD_SEGMENTS },
    message: { type: String, trim: true, maxlength: 1000 },
    consent: { type: Boolean, default: false },
    consentAt: { type: Date },
    // Repeat submissions within 24 h are merged into the same lead.
    submissionCount: { type: Number, default: 1 },
    lastSubmittedAt: { type: Date, default: Date.now },
    status: { type: String, enum: ['new', 'contacted', 'converted', 'closed'], default: 'new' },
  },
  { timestamps: true }
);

leadSchema.pre('validate', function requireNameUnlessCallback(next) {
  if (this.source !== 'callback' && !this.name) this.invalidate('name', 'name is required');
  next();
});

// Supports the 24 h duplicate check (mobile + email).
leadSchema.index({ phone: 1, email: 1, createdAt: -1 });

export default mongoose.model('Lead', leadSchema);
