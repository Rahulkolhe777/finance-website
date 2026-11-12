import { Router } from 'express';
import { createComplaint, getComplaintStats } from '../controllers/complaintController.js';
import { formLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post('/', formLimiter, createComplaint);
router.get('/stats', getComplaintStats);

export default router;
