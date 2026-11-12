import dotenv from 'dotenv';

dotenv.config();

const clientOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map((url) => url.trim().replace(/\/+$/, ''))
  .filter(Boolean);

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 5000,
  mongoUri: process.env.MONGODB_URI,
  // CLIENT_URL may list several origins, comma-separated (e.g. production + a
  // Vercel preview). The first is the main site, used for payment redirects.
  // Trailing slashes are stripped because browsers send the Origin without one.
  clientUrls: clientOrigins,
  clientUrl: clientOrigins[0],
  jwtSecret: process.env.JWT_SECRET,
};
