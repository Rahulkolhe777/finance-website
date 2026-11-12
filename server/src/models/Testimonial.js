import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    profession: { type: String, trim: true },
    content: { type: String, required: true, trim: true, maxlength: 500 },
    rating: { type: Number, min: 1, max: 5, required: true },
    // Compliance: only publish real clients who agreed to be quoted.
    isVerified: { type: Boolean, default: false },
    consentObtained: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// A testimonial can only go live once it is verified and consent is on record.
testimonialSchema.pre('validate', function requireVerificationToPublish(next) {
  if (this.isPublished && !(this.isVerified && this.consentObtained)) {
    this.invalidate('isPublished', 'Only verified testimonials with client consent can be published');
  }
  next();
});

export default mongoose.model('Testimonial', testimonialSchema);
