import mongoose from 'mongoose';

export const COURSE_LEVELS = ['Beginner', 'Intermediate', 'Advanced'];
export const COURSE_MODES = ['Recorded', 'Live Online'];

const syllabusModuleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    topics: [{ type: String, trim: true }],
  },
  { _id: false }
);

const faqSchema = new mongoose.Schema(
  {
    question: { type: String, required: true, trim: true },
    answer: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const instructorSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },
    title: { type: String, trim: true },
    bio: { type: String, trim: true },
    photo: { type: String },
  },
  { _id: false }
);

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    level: { type: String, enum: COURSE_LEVELS, required: true, index: true },
    mode: { type: String, enum: COURSE_MODES, required: true, index: true },
    shortDescription: { type: String, trim: true },
    // Card bullets (homepage + listing), max three shown.
    highlights: [{ type: String, trim: true }],
    overview: { type: String },
    syllabus: [syllabusModuleSchema],
    instructor: instructorSchema,
    faqs: [faqSchema],
    duration: { type: String, trim: true },
    // Price in INR.
    price: { type: Number, required: true, min: 0 },
    thumbnail: { type: String },
    sortOrder: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model('Course', courseSchema);
