import Course from '../models/Course.js';
import asyncHandler from '../utils/asyncHandler.js';

export const listCourses = asyncHandler(async (req, res) => {
  const courses = await Course.find({ isPublished: true }).select('-description').sort({ createdAt: -1 }).lean();
  res.json(courses);
});

export const getCourseBySlug = asyncHandler(async (req, res) => {
  const course = await Course.findOne({ slug: req.params.slug, isPublished: true }).lean();
  if (!course) return res.status(404).json({ message: 'Course not found' });
  return res.json(course);
});
