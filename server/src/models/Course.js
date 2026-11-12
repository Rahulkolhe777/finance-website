import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    shortDescription: { type: String, trim: true },
    description: { type: String },
    price: { type: Number, required: true, min: 0 },
    thumbnail: { type: String },
    isPublished: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model('Course', courseSchema);
