# Deployment

Chosen setup (free URLs first, own domain later):

| Part | Host | Notes |
|---|---|---|
| Frontend (`client/`) | Vercel | `client/vercel.json` sends every path to `index.html` so page refreshes work |
| API (`server/`) | Render (Web Service) | Free tier sleeps after ~15 min idle; first request then takes ~30 s. Paid Starter stays awake |
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

4. After the first deploy, open the Render Shell and run `npm run seed:plans` once to load the pricing plans.
5. Check `https://<your-service>.onrender.com/api/health` returns `{"status":"ok"}`.

## 5. Frontend on Vercel

1. Add New → Project → import the GitHub repo.
2. Root Directory `client`, Framework Vite (build `npm run build`, output `dist`).
3. Environment variable: `VITE_API_URL=https://<your-service>.onrender.com/api`
4. Deploy, then put the final Vercel URL into Render's `CLIENT_URL` and redeploy the API.

`VITE_API_URL` is baked in at build time; redeploy the frontend after changing it.

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
