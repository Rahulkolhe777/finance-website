import mongoose from 'mongoose';

const enrollmentSchema = new mongoose.Schema(
  {
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    // One enrollment per successful payment.
    payment: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment', unique: true, sparse: true },
    status: { type: String, enum: ['pending', 'active', 'cancelled'], default: 'pending' },
  },
  { timestamps: true }
);

enrollmentSchema.index({ email: 1, course: 1 });

export default mongoose.model('Enrollment', enrollmentSchema);
