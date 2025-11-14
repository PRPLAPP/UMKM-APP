
---
title: UMKM-APP
emoji: 🛍️
colorFrom: blue
colorTo: purple
sdk: docker
pinned: false
license: mit
app_port: 3000
---

  ## Project layout

  - `src/` – Vite + React frontend.
  - `server/` – Fastify + TypeScript API (Node 20, Zod validation, dotenv for config).

  ## Frontend

  1. Run `npm install` in the project root.
  2. Run `npm run dev` to start Vite (expects the backend on `http://localhost:5000` via the `/api` proxy in dev mode).
  3. Optional: set `VITE_API_BASE_URL` before `npm run build` if the API lives elsewhere.

  ## Backend

  1. `cd server && npm install` (first time only).
  2. Copy `server/.env.example` to `server/.env` and set `API_PORT`, `DATABASE_URL`, and `JWT_SECRET` (defaults assume Postgres running on `localhost:5432` with user/password/db `umkm`).
  3. Make sure Postgres is running, then run `npm run prisma:migrate` inside `server/` to apply migrations.
  4. (Optional) Run `npm run db:seed` inside `server/` to populate a couple of sample products and demo accounts (`msme@example.com` / `Password123!`, `admin@example.com` / `Password123!`).
  5. Run `npm run dev:api` from the project root (or `npm run dev` inside `server/`) to boot the Fastify server with hot reload via `tsx`. The server listens on `0.0.0.0:${API_PORT}` and will honor the `PORT` env var when provided (handy for hosting platforms).

  ### Available endpoints

  - `GET /health` – uptime/status probe.
  - `GET /products` – list catalog items.
  - `POST /products` – create a product (`name`, `description`, `price`, `stock`, `category`).
  - `GET /orders` – list submitted orders.
  - `POST /orders` – create an order (`customerName`, `customerEmail`, `items[{ productId, quantity }]`); totals are computed server-side.
  - `GET /reports/sales` – aggregated sales totals backed by Postgres.
  - `POST /auth/register` – create an account (`name`, `email`, `password`, `role`).
  - `POST /auth/login` – exchange email/password for a JWT + profile.
  - `GET /auth/me` – fetch the authenticated profile (requires `Authorization: Bearer <token>`).
  - `GET /community/home` – villager feed (news, tourism spots, MSME directory stats).
  - `GET /admin/dashboard` – admin-only metrics (totals, growth data, verification queue).

  Routes live in `server/src/routes`, business logic in `server/src/services`, and persistence is handled by Prisma + Postgres (see `server/prisma/schema.prisma`). Update the schema and run `npm run prisma:migrate` any time the data model changes.

  The Vite dev server proxies `/api/*` to the Fastify port so React components can call e.g. `fetch('/api/products')` without worrying about CORS during local development. Production builds default to hitting `${window.location.origin}/api` unless `VITE_API_BASE_URL` is set at build time, which makes it easy to host the frontend + API behind the same domain or point the UI at a remote API. Make sure both `npm run dev` and `npm run dev:api` are running (plus Postgres) to see live data inside the MSME dashboard.

  ## Docker workflow

  1. Copy `server/.env.example` to `server/.env` (Compose reads the same values).
  2. Run `docker compose up --build`.
  3. Visit `http://localhost:3000` for the frontend; the API is available at `http://localhost:5050`, and Postgres lives inside the `db` service. Client-side routes (e.g., `/register`) now resolve correctly via the Nginx SPA fallback.
  4. Seed sample data any time with `docker compose exec api npm run db:seed`.

  The compose stack includes:

  - `db` – Postgres 16 with a persisted volume.
  - `api` – Fastify server (build + migrate on startup) exposed on port 5000.
  - `web` – Static build served by Nginx on port 3000 (built with `VITE_API_BASE_URL=http://localhost:5000` by default).

  The root `Dockerfile` builds the frontend and backend into a single image (Fastify serves the static assets) so you can deploy to single-container hosts such as Hugging Face Spaces. Provide the appropriate `DATABASE_URL`, `JWT_SECRET`, and `PORT` environment variables at runtime.
  
