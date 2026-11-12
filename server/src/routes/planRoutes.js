import { Router } from 'express';
import { listPlans, getPlanBySlug } from '../controllers/planController.js';

const router = Router();

router.get('/', listPlans);
router.get('/:slug', getPlanBySlug);

export default router;
