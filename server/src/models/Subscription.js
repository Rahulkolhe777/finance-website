import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    plan: { type: mongoose.Schema.Types.ObjectId, ref: 'Plan', required: true },
    payment: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' },
    startDate: { type: Date },
    endDate: { type: Date },
    status: { type: String, enum: ['pending', 'active', 'expired', 'cancelled'], default: 'pending' },
  },
  { timestamps: true }
);

export default mongoose.model('Subscription', subscriptionSchema);
