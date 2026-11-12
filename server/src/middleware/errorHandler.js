import { env } from '../config/env.js';
import logger from '../utils/logger.js';

export function notFound(req, res) {
  res.status(404).json({ message: 'Not found' });
}

// eslint-disable-next-line no-unused-vars
export default function errorHandler(err, req, res, next) {
  const status = err.statusCode || 500;
  if (status >= 500) logger.error(err);
  res.status(status).json({
    message: status >= 500 && env.nodeEnv === 'production' ? 'Internal server error' : err.message,
  });
}
