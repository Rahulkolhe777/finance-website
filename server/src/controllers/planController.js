import Plan from '../models/Plan.js';
import asyncHandler from '../utils/asyncHandler.js';

export const listPlans = asyncHandler(async (req, res) => {
  const plans = await Plan.find({ isActive: true }).sort({ price: 1 }).lean();
  res.json(plans);
});
