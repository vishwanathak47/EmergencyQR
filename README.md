# Emergency QR Portal

A compact, secure emergency contact system that lets authenticated users store essential emergency information and generate scannable QR codes. Scanning a QR opens a public read-only page containing only minimal, non-sensitive data (name, allergies, and emergency contacts).

Core technologies
- Node.js + Express — API server and routing
- MongoDB (Mongoose) — data persistence
- React (Vite) + Tailwind CSS — frontend UI
- JWT-based authentication with httpOnly cookies (with an Authorization header fallback)
- html5-qrcode for scanning and `qrcode` for QR image generation

Key features
- Secure sign up and login with JWTs and httpOnly cookies (token fallback supported via Authorization header)
- Server-side input sanitization and common security middleware (helmet, express-mongo-sanitize, rate limiting)
- Create contacts with multiple emergency contacts, generate a QR that links to a public scan page
- Admin endpoints for contact listing (requires admin role)
- Ready for local development (Vite + nodemon) or production deployment (server can serve the built frontend)

Repository structure (high level)
- `server/` — Express API, models, controllers, middleware and a `server.js` entry point
- `client/` — Vite + React frontend, pages, components, and Tailwind CSS config
- `docker-compose.yml` — optional compose setup for local containerized development

Quick start (local, without Docker)
1. Start MongoDB (locally or Atlas)
2. Backend
   ```powershell
   cd server
   npm install
   copy .env.example .env
   # edit server/.env to add your local MONGODB_URI and secrets
   npm run dev
   ```
3. Frontend
   ```powershell
   cd client
   npm install
   npm run dev
   ```
4. Open the frontend at `http://localhost:5173` (or the Vite-assigned port)

Environment variables
- Server: use `server/.env.example` as the template and configure values via your host (Render, Heroku, etc.) in production. Do NOT store secrets in the repository.
- Client: set `VITE_SERVER_URL` to the API base (e.g. `https://api.example.com/api`) during deployment.

API endpoints (high level)
- POST /api/auth/signup — create account; sets httpOnly cookie and returns basic user info
- POST /api/auth/login — login; sets httpOnly cookie and returns basic user info
- POST /api/auth/logout — clear authentication cookie
- POST /api/contact/submit — protected; create contact and receive QR data URL
- GET /api/contact/scan/:id — public; returns minimal emergency information for scanned QR

Security notes
- Do not commit secrets or production DB URIs to the repository. Use your hosting platform's environment configuration.
- Use HTTPS in production and ensure `secure: true` cookie flag is enabled (`NODE_ENV=production`).

Next steps and maintenance
- Add unit/integration tests for auth and contact flows before production rollout
- Add CI pipeline to run lint/tests and build the client
- Use a managed MongoDB (Atlas) for production and secure the connection string with environment variables

License: MIT

Last updated: 2025-11-05

