import { api } from './api.js';

export const getCourses = () => api.get('/courses');
export const getCourseBySlug = (slug) => api.get('/courses/' + encodeURIComponent(slug));
