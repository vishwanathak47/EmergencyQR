# Local Development Setup Guide

## Prerequisites

1. Install Node.js 18.x LTS from: https://nodejs.org/
2. Install MongoDB Community Edition from: https://www.mongodb.com/try/download/community
3. Install MongoDB Compass (optional, for database management): https://www.mongodb.com/try/download/compass

## Setup Steps

### 1. MongoDB Setup
1. After installing MongoDB, create a data directory:
```powershell
mkdir C:\data\db
```

2. Start MongoDB service:
```powershell
"C:\Program Files\MongoDB\Server\6.0\bin\mongod.exe" --dbpath="c:\data\db"
```

### 2. Server Setup
1. Navigate to the server directory:
```powershell
cd server
```

2. Install dependencies:
```powershell
npm install
```

3. Create a .env file in the server directory with:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/emergency_db
JWT_ACCESS_SECRET=940a99ade54b6a6ef91300e8e23a9af3e2879a9f6316ba659744623bb57d8512
JWT_REFRESH_SECRET=744d66a47d6727d215a67ac63537e51dbff0d6bbee0fb507b8a87e39be6d081c
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
# For dev set DEPLOYED_DOMAIN to your frontend dev URL (Vite). Vite typically uses 5173 (or 5174 if 5173 is busy)
DEPLOYED_DOMAIN=http://localhost:5173
CLIENT_URL=http://localhost:5173
```

4. Start the server:
```powershell
npm run dev
```

### 3. Client Setup
1. Open a new terminal and navigate to the client directory:
```powershell
cd client
```

2. Install dependencies:
```powershell
npm install
```

3. Create a .env file in the client directory with:
```
VITE_SERVER_URL=http://localhost:5000/api
```

4. Start the development server:
```powershell
npm run dev
```

## Accessing the Application

- Frontend: http://localhost:5173 (Vite dev server)
- Backend API: http://localhost:5000
# Local development — quick guide

This project is developed with a separate frontend (Vite + React) and backend (Express + Node). The instructions below get the application running on your local machine for development and testing.

## Prerequisites
- Node.js (v18+ recommended)
- MongoDB (local install) or an Atlas cluster
- Git

## Local MongoDB (optional)
If you run MongoDB locally, create the data directory once:

```powershell
mkdir C:\data\db
```

Start MongoDB (replace path/version as appropriate for your installation):

```powershell
& "C:\Program Files\MongoDB\Server\8.0\bin\mongod.exe" --dbpath="C:\data\db"
```

## Server (backend)
1. Open a PowerShell window and install dependencies:

```powershell
cd "C:\local storage_myfiles_vishwanath\Emergency-QR-Project\server"
npm install
```

2. Create a local `.env` from the example and edit values for your environment:

```powershell
copy .env.example .env
# Edit server/.env and set MONGODB_URI to your local or Atlas connection string
```

3. Start the server (development):

```powershell
npm run dev
# The server should log: "Server running on port 5000"
```

## Client (frontend)
1. Open a separate PowerShell window and install dependencies:

```powershell
cd "C:\local storage_myfiles_vishwanath\Emergency-QR-Project\client"
npm install
```

2. Create a `client/.env` (use `.env.example` as reference) and ensure `VITE_SERVER_URL` points to your backend API, e.g. `http://localhost:5000/api`.

3. Start the Vite dev server:

```powershell
npm run dev
# Vite will print the local URL (typically http://localhost:5173 or 5174)
```

## Validation checklist
- Visit the frontend URL shown by Vite (e.g. http://localhost:5173)
- Sign up and log in
- Create a contact on the Contact Form page and generate a QR
- Scan the QR (phone or Google Lens); it should resolve to `/scan/:id` on the frontend and load the contact details by calling the API

## Notes & troubleshooting
- Never commit real credentials (MongoDB URI, JWT secrets) to Git. Use `.env` locally and set environment variables in your host for production.
- If you see CORS errors during development, ensure `CLIENT_URL` in `server/.env` matches the origin shown by Vite (5173/5174).
- If a port is already in use, Vite will pick the next available port (e.g. 5174). Update `DEPLOYED_DOMAIN`/`CLIENT_URL` accordingly for local testing.

If you want, I can run through these steps and verify end-to-end on your machine; tell me if you want me to continue.