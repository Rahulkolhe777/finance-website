import rateLimit from 'express-rate-limit';

// NOTE: behind a reverse proxy / load balancer (Render, Railway, Nginx…),
// Express must trust the proxy (app.set('trust proxy', 1)) or every visitor
// shares the proxy's IP and these limits apply to everyone together.

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});

// Public form submissions: 10 per IP per hour.
export const formLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { message: 'Too many submissions from this network. Please try again in an hour.' },
});
