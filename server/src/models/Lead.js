import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    source: { type: String, enum: ['trial', 'callback', 'contact'], required: true },
    message: { type: String, trim: true },
    consent: { type: Boolean, default: false },
    status: { type: String, enum: ['new', 'contacted', 'converted', 'closed'], default: 'new' },
  },
  { timestamps: true }
);

export default mongoose.model('Lead', leadSchema);
