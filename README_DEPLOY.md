## Deploying to Render (API) + Netlify (frontend) — recommended setup

This pairing is straightforward: host the API on Render (or a similar host) and the static frontend on Netlify.

Render (backend)
1. Create a new Web Service in Render and connect it to this repository (select the `server` directory as the root).
2. Build & start commands:

   - Build command: `npm install`
   - Start command: `npm run start`

3. Add the required environment variables in Render's dashboard (use `server/.env.example` as a template):

   - `MONGODB_URI` — your MongoDB Atlas connection string (mongodb+srv://...)
   - `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET` — secure random values
   - `DEPLOYED_DOMAIN` — Netlify URL for the frontend (e.g. `https://your-site.netlify.app`)
   - `CLIENT_URL` — same as `DEPLOYED_DOMAIN`
   - `NODE_ENV=production`

4. Deploy. After successful deployment the API will be reachable at a stable Render URL such as `https://api-your-service.onrender.com`.

Netlify (frontend)
1. Connect the `client` directory to Netlify (site from Git) and configure the build:

   - Build command: `npm run build`
   - Publish directory: `dist`

2. Set environment variables in Netlify (Site settings → Build & deploy → Environment):

   - `VITE_SERVER_URL` — set to your Render API base, e.g. `https://api-your-service.onrender.com/api`

3. Deploy and confirm the frontend is live at your Netlify domain.

Security and secrets (do not commit)

- Never commit `MONGODB_URI` or JWT secrets to GitHub. If you already pushed credentials, rotate them immediately and remove the secrets from the repo history.
- Use the Render and Netlify environment variable settings to store production secrets.

Post-deploy checklist

1. Visit the frontend URL and sign up.
2. Create a contact and generate a QR; confirm the QR points to the frontend domain `/scan/:id`.
3. Verify the scan page fetches `GET <API_BASE>/api/contact/scan/:id` and shows data.
4. Verify `GET <API_BASE>/api/health` returns `{ "status": "ok" }`.

Additional help

I can generate provider-specific artifacts:

- A `Procfile` or `ecosystem.config.js` for PM2
- An Nginx reverse proxy example if you host the API on a VPS
- A step-by-step Render + Netlify setup checklist with screenshots

If you want me to prepare any of these artifacts, tell me which one and I'll add it to the repo.
