import { Router } from 'express';
import { createLead } from '../controllers/leadController.js';
import validate from '../middleware/validate.js';
import { formLimiter } from '../middleware/rateLimiter.js';
import leadValidator from '../validators/leadValidator.js';

const router = Router();

router.post('/', formLimiter, validate(leadValidator), createLead);

export default router;
