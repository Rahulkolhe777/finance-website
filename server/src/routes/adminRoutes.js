import { Router } from 'express';
import auth from '../middleware/auth.js';
import { listLeads } from '../controllers/leadController.js';
import { listComplaints } from '../controllers/complaintController.js';

const router = Router();

router.use(auth);

router.get('/leads', listLeads);
router.get('/complaints', listComplaints);

export default router;
