import { Router } from 'express';
import { login } from '../controllers/authController.js';
import { formLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post('/login', formLimiter, login);

export default router;
