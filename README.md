(# Job Request (monorepo))

(This repository contains a Next.js frontend and an Express backend for a simple job-request application.)

(Folders:)

(- `frontend/` — Next.js app (port 3000))
(- `backend/` — Express API (port 4000))

(## Required environment variables)

(Backend (create `backend/.env`):)

```env
PORT=4000
JWT_SECRET=your-jwt-secret
MONGO_URI=your-mongodb-connection-string
CORS_ORIGIN=http://localhost:3000
```

(Frontend (create `frontend/.env`):)

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
```

(Notes:)

(- The frontend proxies `/api/*` to the backend via a Next.js rewrite so that auth cookies can be same-origin. Keep `NEXT_PUBLIC_API_BASE_URL` pointing at the Next dev server (default `http://localhost:3000`).)
(- Ensure `MONGO_URI` is reachable from the backend machine before starting the backend.)

(## Install & Run (local development))

(1. Install dependencies for both apps:)

```bash
# from repository root
cd backend && npm install
cd ../frontend && npm install
```

(2. Start the backend API (separate terminal):)

```bash
cd backend
npm run dev
```

(3. Start the frontend (separate terminal):)

```bash
cd frontend
npm run dev
```

(Open the frontend at http://localhost:3000. Backend healthcheck: http://localhost:4000/api/health)

(## Useful scripts)

(- Backend: `npm run dev` (runs `ts-node` via `nodemon`))
(- Frontend: `npm run dev` (Next.js dev server))

(## Troubleshooting)

(- If cookies for authentication are not being set, confirm the frontend and backend are both running on the expected ports and `CORS_ORIGIN` in the backend `.env` matches the frontend origin.)
(- If Mongo connection fails, verify `MONGO_URI` and network access.)

(If you want a consolidated or more detailed README (deploy steps, environment presets, production notes), tell me what to include and I will extend this file.)
