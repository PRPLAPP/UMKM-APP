
  ## Project layout

  - `src/` – Vite + React frontend.
  - `server/` – Fastify + TypeScript API (Node 20, Zod validation, dotenv for config).

  ## Frontend

  1. Run `npm install` in the project root.
  2. Run `npm run dev` to start Vite.

  ## Backend

  1. `cd server && npm install` (first time only).
  2. Copy `server/.env.example` to `server/.env` and adjust `API_PORT` if needed.
  3. Run `npm run dev:api` from the project root (or `npm run dev` inside `server/`) to boot the Fastify server with hot reload via `tsx`.

  The API currently exposes `GET /health`, returning uptime and a timestamp so the frontend (or monitoring) can verify connectivity. Add new routes under `server/src/routes` and register them in `server/src/server.ts`.
  
