import { Router } from 'express';
import { createComplaint } from '../controllers/complaintController.js';
import { formLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post('/', formLimiter, createComplaint);

export default router;
