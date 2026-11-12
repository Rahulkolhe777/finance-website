# Research Analyst Website

React + Vite frontend (`client/`), Node.js + Express backend (`server/`), MongoDB via Mongoose.

## Setup

1. Install dependencies: `npm run install:all`
2. Copy `server/.env.example` to `server/.env` and fill in the values.
3. Start MongoDB locally (or point `MONGODB_URI` at a cluster).
4. In two terminals: `npm run dev:server` (http://localhost:5000) and `npm run dev:client` (http://localhost:5173).

The Vite dev server proxies `/api` to the backend.

## Structure rules

- Pages only in `client/src/pages`; reusable pieces in `client/src/components`; one PascalCase component per file.
- All API calls only in `client/src/services`.
- Business logic only in server controllers; schemas only in server models; routes only list endpoints and call controllers.
- Secrets only in `.env` files, never in code.
