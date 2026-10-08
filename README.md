
# Finance Tracker

Finance Tracker is a small full-stack portfolio application for recording income and expenses. It provides JWT-authenticated accounts, globally seeded categories, paginated and filterable transactions, and a dashboard that summarizes balances by category and month.

## Screenshots

> Add dashboard, transaction list, and transaction form screenshots here.

## Tech Stack

- Backend: Node.js, TypeScript 5.9, Express 4.22, mysql2/promise 3.24, MySQL 8, Zod 4.6, bcrypt 6, and jsonwebtoken 9.
- Frontend: Vite 8.3, React 19.2, TypeScript 6.0, Redux Toolkit 2.13, React Redux 9.3, React Router DOM 6.30, and Axios 1.20.
- Styling: plain CSS; no component or chart library.
- Local infrastructure: Docker Compose and MySQL 8.

## Prerequisites

- Node.js `^20.19.0` or `>=22.12.0` (required by the installed Vite version)
- npm
- Docker Desktop with Docker Compose

## Setup

### 1. Start the database

From the project root:

```bash
docker compose up -d
```

### 2. Backend

```bash
cd backend
cp .env.example .env
```

Set `DB_PASSWORD=rootpass` in `backend/.env` when using the provided Compose service. Keep the other database values aligned with `docker-compose.yml`, then install packages and initialize the database:

```bash
npm install
docker compose exec -T mysql mysql -uroot -prootpass finance_tracker < src/db/schema.sql
docker compose exec -T mysql mysql -uroot -prootpass finance_tracker < src/db/seed.sql
npm run dev
```

The API listens on `http://localhost:4000` by default.

### 3. Frontend

In another terminal:

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

`frontend/.env.example` points the client at `http://localhost:4000/api`; Vite serves the application at `http://localhost:5173`.

## API Overview

All application routes are prefixed with `/api`. Authenticated routes require `Authorization: Bearer <token>`.

| Method | Path | Auth required |
| --- | --- | --- |
| POST | `/auth/register` | No |
| POST | `/auth/login` | No |
| GET | `/auth/me` | Yes |
| GET | `/categories` | Yes |
| GET | `/transactions` | Yes |
| GET | `/transactions/:id` | Yes |
| POST | `/transactions` | Yes |
| PUT | `/transactions/:id` | Yes |
| DELETE | `/transactions/:id` | Yes |
| GET | `/stats/summary` | Yes |
| GET | `/stats/by-category` | Yes |
| GET | `/stats/monthly` | Yes |
| GET | `/health` | No |

See [backend/API.md](backend/API.md) for request, response, error, and curl details.

## Project Structure

```text
backend/src/
├── config/          environment and MySQL pool configuration
├── db/              schema and category seed SQL
├── middleware/      authentication and Zod validation
├── modules/         auth, categories, transactions, and stats handlers
├── types/           Express request type augmentation
└── utils/           JWT, password, error, and async helpers

frontend/src/
├── api/             Axios client and endpoint wrappers
├── app/             Redux store and typed hooks
├── components/      shared layout and navigation
├── features/        auth, categories, dashboard, filters, stats, and transactions
├── types/           shared frontend API types
└── utils/           currency and date formatting helpers
```

## Design Decisions

- JWT is stored in localStorage to keep this portfolio app’s browser session implementation small and explicit.
- MySQL `DECIMAL` values remain strings on the wire to avoid JavaScript floating-point precision loss.
- Categories are global, seeded reference data rather than user-owned records.
- `applyFiltersAndFetch` centralizes conversion of Redux filter state into one transaction-list request.
- The monthly chart uses CSS bars instead of a chart library to keep the dependency footprint small.

## Known Limitations

- No refresh tokens.
- No password reset flow.
- Transactions are hard-deleted only.
- Filters are not persisted across browser refreshes.
- Months with no transactions are omitted from the monthly chart.

## Testing

Type checking and production build checks:

```bash
cd backend && npx tsc --noEmit
cd frontend && npx tsc --noEmit && npm run build && npm run lint
```

For API smoke testing, start MySQL and the backend, register two throwaway users with `curl`, save their tokens, then exercise every route in [backend/API.md](backend/API.md). Verify that auth rejects cross-user transaction access, transaction amounts remain strings, and a fresh-user summary contains zero strings rather than null values.

For browser smoke testing, register a fresh account; refresh to confirm the session is restored; create, edit, and delete income and expense transactions; combine every list filter; create at least 25 transactions to check pagination; compare dashboard totals with `/stats/summary`; then log out and tamper with `auth_token` to confirm invalid sessions are removed.

## License

MIT

Fill the README with the actual commands and structure of this project.
Do not invent features. Do not oversell. The tone should be technical and
honest — this is a portfolio project and the README will be read by people
who interview me.

Also create `backend/API.md` — a reference document with one section per
endpoint containing:
- Method, path, auth required
- Query parameters (name, type, default, description)
- Request body shape (for POST/PUT)
- Success response shape with status code
- Error responses with status codes and the exact messages
- One curl example per endpoint

### Step 8 — Final cleanup
- Verify `.gitignore` at the root excludes node_modules/, dist/, .env files,
  and OS cruft (.DS_Store, Thumbs.db). Add any missing entries.
- Verify backend/.env.example and frontend/.env.example exist and list every
  variable the code reads.
- Delete any leftover Vite template files (App.css, logo.svg, vite.svg,
  react.svg) that are no longer imported anywhere.
- Delete unused imports in every file.
- Run `git status` and summarize what would be committed.

## Hard rules
1. Do not change the public API contract. Endpoints, shapes, and status
   codes are what they are.
2. Do not change the database schema. Tables, columns, indexes, and
   constraints stay as they are.
3. Do not add npm dependencies.
4. Do not edit any .env file. If a value is missing, report it and stop.
5. Do not commit. Leave changes in the working tree for me to review.
6. Do not touch docker-compose.yml.
7. Do not rename files or move folders.
8. If you are unsure about a fix, write a TODO comment in the code with
   your question, and list it in the report. Do not guess.

## Final report format
Return exactly this structure:

## Status
<OK | FIXES APPLIED | BLOCKED>

## TypeScript
backend: <clean | N errors remaining>
frontend: <clean | N errors remaining>

## Endpoint smoke tests
| # | endpoint | expected | observed | pass/fail |

## Frontend smoke tests
| # | check | result | notes |

## Fixes applied
<bullet list: file path — what changed and why>

## Additional fixes (beyond the list)
<bullet list, or "none">

## Issues I could not resolve
<bullet list, or "none">

## Files created
<README.md, backend/API.md, others>

## Ready to commit
<summary of `git status`>