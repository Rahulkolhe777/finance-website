import asyncHandler from '../utils/asyncHandler.js';

export const login = asyncHandler(async (req, res) => {
  res.status(501).json({ message: 'Not implemented' });
});
