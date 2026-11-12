import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    purpose: { type: String, enum: ['plan', 'course'], required: true },
    refId: { type: mongoose.Schema.Types.ObjectId, required: true },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'INR' },
    gateway: { type: String },
    orderId: { type: String, index: true },
    paymentId: { type: String },
    status: { type: String, enum: ['created', 'paid', 'failed', 'refunded'], default: 'created' },
    invoiceNumber: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model('Payment', paymentSchema);
