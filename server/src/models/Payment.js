import mongoose from 'mongoose';

export const PAYMENT_STATUSES = ['created', 'paid', 'failed', 'cancelled', 'expired', 'refunded'];

const customerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const paymentSchema = new mongoose.Schema(
  {
    // Our own order id, also sent to the gateway as its reference.
    orderId: { type: String, required: true, unique: true },
    purpose: { type: String, enum: ['plan', 'course'], required: true },
    refId: { type: mongoose.Schema.Types.ObjectId, required: true },
    refSlug: { type: String, required: true },
    description: { type: String, required: true },
    // Amount in paise (integer) to avoid floating-point errors. Always taken
    // from the Plan/Course in the database, never from the client.
    amountPaise: { type: Number, required: true, min: 100 },
    currency: { type: String, default: 'INR' },
    customer: { type: customerSchema, required: true },
    gateway: { type: String, enum: ['razorpay', 'cashfree'], required: true },
    gatewayLinkId: { type: String, index: true },
    gatewayPaymentId: { type: String },
    status: { type: String, enum: PAYMENT_STATUSES, default: 'created', index: true },
    paidAt: { type: Date },
    invoiceNumber: { type: String, unique: true, sparse: true },
    receiptSentAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model('Payment', paymentSchema);
