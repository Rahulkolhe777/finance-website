import app from './app.js';
import connectDB from './config/db.js';
import { env } from './config/env.js';
import logger from './utils/logger.js';

async function start() {
  try {
    await connectDB();
    app.listen(env.port, () => logger.info('Server running on port ' + env.port));
  } catch (err) {
    logger.error('Failed to start server', err);
    process.exit(1);
  }
}

start();
