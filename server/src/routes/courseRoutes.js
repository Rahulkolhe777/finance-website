import { Router } from 'express';
import { listCourses, getCourseBySlug } from '../controllers/courseController.js';

const router = Router();

router.get('/', listCourses);
router.get('/:slug', getCourseBySlug);

export default router;
