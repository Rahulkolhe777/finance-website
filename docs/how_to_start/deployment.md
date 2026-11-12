# Deployment

Chosen setup (free URLs first, own domain later):

| Part | Host | Notes |
|---|---|---|
| Frontend (`client/`) | Vercel | `client/vercel.json` sends every path to `index.html`. Hobby plan is non-commercial: move to Pro (or Netlify) once taking payments |
| API (`server/`) | Render (Web Service) | Free tier sleeps after ~15 min idle; kept awake by an uptime monitor (step 5b) |
| Database | MongoDB Atlas, free M0, Mumbai (`ap-south-1`) | |
| Email | Gmail SMTP with an App Password | Switch to Resend/Zoho after buying a domain |
| Payments | Razorpay **test mode** | Switch to live keys after Razorpay approves the site |
| Google Sheets, SMS | Not used yet | Leads are saved in MongoDB and emailed to `TEAM_ALERT_EMAIL` |

Secrets go only into the Render / Vercel dashboards. Never commit `.env`.

## 1. MongoDB Atlas

1. Create a free M0 cluster in the Mumbai region.
2. Database Access → add a user with a strong password.
3. Network Access → allow `0.0.0.0/0` (Render free instances have no fixed IP).
4. Connect → Drivers → copy the `mongodb+srv://...` string and add a database name, e.g. `.../research-analyst?retryWrites=true&w=majority`.

## 2. Gmail App Password

1. On the Gmail account that will send emails, turn on 2-Step Verification.
2. Google Account → Security → App passwords → create one (16 characters).

## 3. Razorpay test keys

Razorpay Dashboard → switch to **Test Mode** → Settings → API Keys → generate. Keys start with `rzp_test_`.

## 4. API on Render

1. New → Web Service → connect the GitHub repo.
2. Root Directory `server`, Runtime Node, Build `npm install`, Start `npm start`, Health check path `/api/health`.
3. Environment variables:

| Variable | Value |
|---|---|
| `NODE_ENV` | `production` |
| `MONGODB_URI` | Atlas connection string |
| `JWT_SECRET` | random 96-character hex string (command in `server/.env.example`) |
| `CLIENT_URL` | `https://<your-project>.vercel.app` |
| `API_PUBLIC_URL` | `https://<your-service>.onrender.com` |
| `GST_RATE` | `0` (not GST-registered) |
| `PRICES_INCLUDE_GST` | `true` |
| `PAYMENT_GATEWAY` | `razorpay` |
| `PAYMENT_KEY_ID` | Razorpay test key id (starts `rzp_test_`) |
| `PAYMENT_KEY_SECRET` | Razorpay test key secret |
| `SMTP_HOST` | `smtp.gmail.com` |
| `SMTP_PORT` | `587` |
| `SMTP_USER` | the Gmail address |
| `SMTP_PASS` | the 16-character Gmail App Password |
| `EMAIL_FROM` | `Priya Kolhe <gmail address>` |
| `TEAM_ALERT_EMAIL` | where lead alerts should go |

Render sets `PORT` itself. `CLIENT_URL` must match the Vercel URL exactly (https, no trailing slash) or the browser blocks API calls (CORS). The first deploy can use a guess and be corrected after step 5.

4. Load the pricing plans into Atlas once, from your PC (Render free has no Shell). In PowerShell, from the `server` folder: `$env:MONGODB_URI="<Atlas connection string>"; npm run seed:plans` (an environment variable set this way overrides `server/.env`; close the terminal afterwards).
5. Check `https://<your-service>.onrender.com/api/health` returns `{"status":"ok"}`.

## 5. Frontend on Vercel

1. Add New → Project → import the GitHub repo.
2. Root Directory `client`, Framework Vite (build `npm run build`, output `dist`).
3. Environment variable: `VITE_API_URL=https://<your-service>.onrender.com/api`
4. Deploy, then put the final Vercel URL into Render's `CLIENT_URL` and redeploy the API.

`VITE_API_URL` is baked in at build time; redeploy the frontend after changing it. If it is not set, production builds fall back to `PRODUCTION_API_URL` in `client/src/services/api.js` (update it if the Render URL changes). A trailing `/` in `CLIENT_URL` is ignored.

## 5b. Keep the free Render API awake

Render's free tier sleeps after ~15 min without requests, so the first visitor then waits ~30–50 s.
Create a free UptimeRobot (or similar) HTTP monitor:

- URL: `https://<your-service>.onrender.com/api/health` (note the `/api` prefix; it returns `{"status":"ok"}`)
- Interval: 5–10 minutes (must stay under 15)

Render still restarts the service on each deploy and occasionally for maintenance; the monitor wakes it again.
Upgrade to Render Starter when paying clients arrive, then the monitor is optional.

## 6. Check after deploy

- Open several pages and refresh each (routing).
- Submit the Instant Trial Form → lead appears in Atlas and an alert email arrives.
- Pricing → checkout with a Razorpay test card → Payment Success page and receipt email.

## Later: own domain

1. Vercel → Project → Domains → add `yourdomain.com` (follow the DNS records shown).
2. Render → Settings → Custom Domains → add `api.yourdomain.com`.
3. Update `CLIENT_URL`, `API_PUBLIC_URL` (Render) and `VITE_API_URL` (Vercel), then redeploy both.
4. Then apply for Razorpay live keys (needs the legal pages filled) and swap the `rzp_test_` keys for live ones.

## Known gaps before going live

- Placeholder text still shows on several pages (legal pages, hero sample call, trial texts, grievance timelines).
- SMS confirmations are not implemented (`server/src/services/otpService.js`); failures are only logged.
- No script creates an admin user, so `/api/admin` cannot be used yet.
