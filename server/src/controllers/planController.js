import Plan, { PLAN_SEGMENTS } from '../models/Plan.js';
import asyncHandler from '../utils/asyncHandler.js';

// GET /api/plans?segment=cash — active plans, optionally for one segment.
export const listPlans = asyncHandler(async (req, res) => {
  const { segment } = req.query;
  const filter = { isActive: true };

  if (segment !== undefined) {
    if (typeof segment !== 'string' || !PLAN_SEGMENTS.includes(segment)) {
      return res.status(400).json({ message: 'segment must be one of ' + PLAN_SEGMENTS.join(', ') });
    }
    filter.segment = segment;
  }

  const plans = await Plan.find(filter).sort({ segment: 1, sortOrder: 1, price: 1 }).lean();
  return res.json(plans);
});

// GET /api/plans/:slug — a single active plan (used to pre-select a plan at checkout).
export const getPlanBySlug = asyncHandler(async (req, res) => {
  const plan = await Plan.findOne({ slug: String(req.params.slug).toLowerCase(), isActive: true }).lean();
  if (!plan) return res.status(404).json({ message: 'Plan not found' });
  return res.json(plan);
});
