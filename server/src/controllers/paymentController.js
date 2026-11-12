import asyncHandler from '../utils/asyncHandler.js';

export const createOrder = asyncHandler(async (req, res) => {
  res.status(501).json({ message: 'Not implemented' });
});

export const verifyPayment = asyncHandler(async (req, res) => {
  res.status(501).json({ message: 'Not implemented' });
});
