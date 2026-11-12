import { api } from './api.js';

export const getCourses = () => api.get('/courses');
export const getCourseBySlug = (slug) => api.get('/courses/' + encodeURIComponent(slug));

// Homepage highlight: the first `limit` published courses.
export const getFeaturedCourses = async (limit = 3) => {
  const courses = await getCourses();
  return Array.isArray(courses) ? courses.slice(0, limit) : [];
};
