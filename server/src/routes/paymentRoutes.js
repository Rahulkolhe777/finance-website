import { Router } from 'express';
import { createOrder, verifyPayment } from '../controllers/paymentController.js';
import validate from '../middleware/validate.js';
import paymentValidator from '../validators/paymentValidator.js';

const router = Router();

router.post('/order', validate(paymentValidator), createOrder);
router.post('/verify', verifyPayment);

export default router;
