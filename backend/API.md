# Finance Tracker API Reference

Base URL: `http://localhost:4000/api`. Error responses have the envelope `{ "error": { "message": string, "details"?: unknown } }`. Validation failures are always `400 Validation failed`; `details` is an array of Zod `{ path, message }` objects. Set `TOKEN` after registration or login:

```bash
TOKEN='replace-with-JWT'
```

## POST `/auth/register`

- Auth: no. Query: none. Body: `{ name: string, email: string, password: string }`; name is 1–100 characters and password is 8–72 characters.
- Success: `201 { user: { id: number, name: string, email: string, createdAt: string }, token: string }`. `user` never contains `password_hash`.
- Errors: `400 Validation failed`; `409 Email is already registered`; `409 Resource already exists` (duplicate-key race); `500 Failed to load created user`.

```bash
curl -i -X POST http://localhost:4000/api/auth/register -H 'Content-Type: application/json' -d '{"name":"Ada","email":"ada@example.com","password":"password123"}'
```

## POST `/auth/login`

- Auth: no. Query: none. Body: `{ email: string, password: string }`.
- Success: `200 { user: { id: number, name: string, email: string, createdAt: string }, token: string }`.
- Errors: `400 Validation failed`; `401 Invalid email or password` for both unknown email and wrong password.

```bash
curl -i -X POST http://localhost:4000/api/auth/login -H 'Content-Type: application/json' -d '{"email":"ada@example.com","password":"password123"}'
```

## GET `/auth/me`

- Auth: yes. Query/body: none.
- Success: `200 { user: { id: number, name: string, email: string, createdAt: string } }`.
- Errors: shared auth errors; `404 User not found`.

```bash
curl -i http://localhost:4000/api/auth/me -H "Authorization: Bearer $TOKEN"
```

## GET `/categories`

- Auth: yes. Query: `type` (`INCOME | EXPENSE`, optional, no default) filters global categories. Body: none.
- Success: `200 { categories: [{ id: number, name: string, type: "INCOME" | "EXPENSE" }] }`.
- Errors: shared auth errors; `400 Query parameter 'type' must be INCOME or EXPENSE`.

```bash
curl -i 'http://localhost:4000/api/categories?type=EXPENSE' -H "Authorization: Bearer $TOKEN"
```

## GET `/transactions`

- Auth: yes. Query: `search` (string, optional, 1–255 characters, description substring); `type` (`INCOME | EXPENSE`, optional); `categoryId` (positive integer, optional); `from`/`to` (`YYYY-MM-DD`, optional, inclusive); `page` (positive integer, default `1`); `limit` (integer 1–100, default `20`); `sort` (`date_desc | date_asc | amount_desc | amount_asc`, default `date_desc`). Body: none.
- Success: `200 { items: [transaction], total: number, page: number, limit: number, totalPages: number }`; a transaction is `{ id, type, amount: string, categoryId, categoryName, description: string | null, date: "YYYY-MM-DD", createdAt, updatedAt }`.
- Errors: shared auth errors; `400 Validation failed`.

```bash
curl -i 'http://localhost:4000/api/transactions?page=1&limit=20&sort=date_desc' -H "Authorization: Bearer $TOKEN"
```

## GET `/transactions/:id`

- Auth: yes. Query/body: none. `id` is a positive integer.
- Success: `200 { transaction: transaction }`.
- Errors: shared auth errors; `400 Invalid transaction id`; `404 Transaction not found`, including another user’s transaction.

```bash
curl -i http://localhost:4000/api/transactions/1 -H "Authorization: Bearer $TOKEN"
```

## POST `/transactions`

- Auth: yes. Query: none. Body: `{ type: "INCOME" | "EXPENSE", amount: number, categoryId: number, description?: string, date: "YYYY-MM-DD" }`; amount is positive and description is at most 255 characters.
- Success: `201 { transaction: transaction }`.
- Errors: shared auth errors; `400 Validation failed`; `400 Category does not exist`; `400 Category is for INCOME, not EXPENSE`; or `400 Category is for EXPENSE, not INCOME`.

```bash
curl -i -X POST http://localhost:4000/api/transactions -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' -d '{"type":"EXPENSE","amount":42.50,"categoryId":5,"description":"Groceries","date":"2026-10-08"}'
```

## PUT `/transactions/:id`

- Auth: yes. Query: none. Body: the same required shape as `POST /transactions`; `id` is a positive integer.
- Success: `200 { transaction: transaction }`.
- Errors: shared auth errors; `400 Invalid transaction id`; `400 Validation failed`; the category errors above; `404 Transaction not found`, including another user’s transaction.

```bash
curl -i -X PUT http://localhost:4000/api/transactions/1 -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' -d '{"type":"EXPENSE","amount":45.00,"categoryId":5,"description":"Updated groceries","date":"2026-10-08"}'
```

## DELETE `/transactions/:id`

- Auth: yes. Query/body: none. `id` is a positive integer.
- Success: `204` with an empty response body.
- Errors: shared auth errors; `400 Invalid transaction id`; `404 Transaction not found`, including another user’s transaction.

```bash
curl -i -X DELETE http://localhost:4000/api/transactions/1 -H "Authorization: Bearer $TOKEN"
```

## GET `/stats/summary`

- Auth: yes. Query: `from` and `to` (`YYYY-MM-DD`, optional, inclusive). Body: none.
- Success: `200 { totalIncome: string, totalExpense: string, balance: string, transactionCount: number }`; a fresh user gets `"0.00"`, `"0.00"`, `"0.00"`, and `0`.
- Errors: shared auth errors; `400 Query parameter 'from' must be in YYYY-MM-DD format`; `400 Query parameter 'to' must be in YYYY-MM-DD format`.

```bash
curl -i http://localhost:4000/api/stats/summary -H "Authorization: Bearer $TOKEN"
```

## GET `/stats/by-category`

- Auth: yes. Query: `type` (`INCOME | EXPENSE`, optional, default `EXPENSE`); `from`/`to` (`YYYY-MM-DD`, optional, inclusive). Body: none.
- Success: `200 { items: [{ categoryId: number, categoryName: string, total: string, count: number }] }`.
- Errors: shared auth errors; `400 Query parameter 'type' must be INCOME or EXPENSE`; the date-format errors above.

```bash
curl -i 'http://localhost:4000/api/stats/by-category?type=EXPENSE' -H "Authorization: Bearer $TOKEN"
```

## GET `/stats/monthly`

- Auth: yes. Query: `months` (integer 1–24, optional, default `12`). Body: none.
- Success: `200 { items: [{ month: "YYYY-MM", income: string, expense: string }] }`.
- Errors: shared auth errors; `400 Query parameter 'months' must be an integer between 1 and 24`.

```bash
curl -i 'http://localhost:4000/api/stats/monthly?months=12' -H "Authorization: Bearer $TOKEN"
```

## GET `/health`

- Auth: no. Query/body: none.
- Success: `200 { status: "ok", timestamp: string }`.
- Errors: none from this route.

```bash
curl -i http://localhost:4000/api/health
```

## Shared errors

Authenticated routes can return `401 Authentication required`, `401 Invalid Authorization header format`, `401 Invalid or expired token`, or `401 Invalid token payload`. Any unmatched route returns `404 Route not found`. Unexpected errors return `500 Internal server error` in production; in development the thrown error text is returned.
