import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import Plan from '../models/Plan.js';
import logger from '../utils/logger.js';

// Fill in real plans before running: { name, slug, price, durationDays, features: [] }
const PLANS = [];

async function seedPlans() {
  await connectDB();
  for (const plan of PLANS) {
    await Plan.updateOne({ slug: plan.slug }, { $set: plan }, { upsert: true });
  }
  logger.info('Seeded ' + PLANS.length + ' plans');
  await mongoose.disconnect();
}

seedPlans().catch((err) => {
  logger.error(err);
  process.exit(1);
});
