import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import errorHandler, { notFound } from './middleware/errorHandler.js';
import leadRoutes from './routes/leadRoutes.js';
import planRoutes from './routes/planRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import complaintRoutes from './routes/complaintRoutes.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

const app = express();

app.use(cors({ origin: env.clientUrl }));
app.use(express.json({ limit: '100kb' }));
app.use('/api', apiLimiter);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/leads', leadRoutes);
app.use('/api/plans', planRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
