import mongoose from 'mongoose';

export const PLAN_SEGMENTS = ['cash', 'stock-options', 'index-options', 'commodities', 'energy'];
export const PLAN_PERIODS = ['monthly', 'quarterly', 'half-yearly', 'yearly'];

const planSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    segment: { type: String, enum: PLAN_SEGMENTS, required: true, index: true },
    period: { type: String, enum: PLAN_PERIODS, required: true },
    // Price in INR for the whole billing period.
    price: { type: Number, required: true, min: 0 },
    durationDays: { type: Number, required: true, min: 1 },
    callsPerDay: { type: String, trim: true },
    discountPercent: { type: Number, min: 0, max: 100, default: 0 },
    features: [{ type: String }],
    isFeatured: { type: Boolean, default: false },
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

planSchema.index({ segment: 1, period: 1 }, { unique: true });

export default mongoose.model('Plan', planSchema);
