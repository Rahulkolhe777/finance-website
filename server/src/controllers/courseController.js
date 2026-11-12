import Course, { COURSE_LEVELS, COURSE_MODES } from '../models/Course.js';
import asyncHandler from '../utils/asyncHandler.js';

// Fields needed for course cards; detail-only fields are left out of the listing.
const CARD_FIELDS = 'title slug level mode shortDescription highlights duration price thumbnail sortOrder';

// GET /api/courses?level=Beginner&mode=Recorded — published courses for cards.
export const listCourses = asyncHandler(async (req, res) => {
  const { level, mode } = req.query;
  const filter = { isPublished: true };

  if (level !== undefined) {
    if (typeof level !== 'string' || !COURSE_LEVELS.includes(level)) {
      return res.status(400).json({ message: 'level must be one of ' + COURSE_LEVELS.join(', ') });
    }
    filter.level = level;
  }
  if (mode !== undefined) {
    if (typeof mode !== 'string' || !COURSE_MODES.includes(mode)) {
      return res.status(400).json({ message: 'mode must be one of ' + COURSE_MODES.join(', ') });
    }
    filter.mode = mode;
  }

  const courses = await Course.find(filter).select(CARD_FIELDS).sort({ sortOrder: 1, createdAt: -1 }).lean();
  return res.json(courses);
});

// GET /api/courses/:slug — full course detail.
export const getCourseBySlug = asyncHandler(async (req, res) => {
  const course = await Course.findOne({ slug: String(req.params.slug).toLowerCase(), isPublished: true }).lean();
  if (!course) return res.status(404).json({ message: 'Course not found' });
  return res.json(course);
});
