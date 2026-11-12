import mongoose from 'mongoose';
import { env } from './env.js';
import logger from '../utils/logger.js';

export default async function connectDB() {
  if (!env.mongoUri) {
    throw new Error('MONGODB_URI is not set');
  }
  await mongoose.connect(env.mongoUri);
  logger.info('MongoDB connected');
}
