import { Router } from 'express';
import { createOrder, getPaymentStatus, paymentReturn, verifyPayment } from '../controllers/paymentController.js';
import validate from '../middleware/validate.js';
import { formLimiter } from '../middleware/rateLimiter.js';
import paymentValidator, { verifyPaymentValidator } from '../validators/paymentValidator.js';

const router = Router();

router.post('/order', formLimiter, validate(paymentValidator), createOrder);
router.get('/return', paymentReturn);
router.post('/verify', validate(verifyPaymentValidator), verifyPayment);
router.get('/:orderId/status', getPaymentStatus);

export default router;
