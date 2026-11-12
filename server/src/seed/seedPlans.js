import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import Plan from '../models/Plan.js';
import logger from '../utils/logger.js';

// Live plans. Keep in sync with client/src/data/plans.js (same slugs and prices).
// Run with: npm run seed:plans   (safe to re-run: upserts by slug)
const PLANS = [
  { slug: 'cash-quarterly', name: 'Quarterly', segment: 'cash', period: 'quarterly', price: 8999, durationDays: 90, sortOrder: 1 },
  { slug: 'cash-half-yearly', name: 'Half-yearly', segment: 'cash', period: 'half-yearly', price: 14999, durationDays: 182, sortOrder: 2 },
  { slug: 'cash-yearly', name: 'Yearly', segment: 'cash', period: 'yearly', price: 24999, durationDays: 365, isFeatured: true, sortOrder: 3 },
].map((plan) => ({ ...plan, isActive: true }));

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
