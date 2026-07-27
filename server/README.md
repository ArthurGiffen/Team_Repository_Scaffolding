# Shelf — Express + MongoDB API

Real backend for the Shelf capstone: Express + Mongoose against MongoDB,
with JWT auth guarding the shelf-entry endpoints.

## Why nothing here has been "live tested against a real database" yet

This code was written and syntax/logic-checked in a sandboxed dev
environment with restricted network egress — it cannot reach MongoDB Atlas
or download a `mongod` binary from that environment. What *was* verified
there, for real, with no mocking:

- Every file passes `node --check` (valid JS, no typos/syntax errors).
- `test-auth-logic.js` actually runs bcrypt hash/compare, signs and verifies
  a real JWT, and drives `requireAuth` through all three cases (no token →
  401, bad token → 401, valid token → `next()` + `req.userId` set). Run it
  yourself with `node test-auth-logic.js`.

What still needs **you** to run it against a real `MONGODB_URI`, because
only you can supply that connection: the actual write/read cycle for
`User`, `Book`, and `ShelfEntry` documents. That's five minutes with the
steps below, and it's the piece that turns this from "code that looks
right" into "verified persistence" for the checkpoint report.

## Setup

```bash
cp .env.example .env
```

Then fill in `.env`:
- **MONGODB_URI** — easiest path: free MongoDB Atlas cluster at
  https://www.mongodb.com/cloud/atlas/register (no credit card). Create a
  cluster → Database Access (add a user) → Network Access (allow your IP,
  or 0.0.0.0/0 for dev) → Connect → Drivers → copy the `mongodb+srv://...`
  string and swap in your DB user/password.
  Local alternative: install MongoDB Community Server and use
  `mongodb://127.0.0.1:27017/shelf`.
- **JWT_SECRET** — any long random string.

Install and run:

```bash
npm install
npm run dev      # http://localhost:4000
```

You should see `[db] MongoDB connected` and `[server] listening on
http://localhost:4000` in the terminal.

## Prove persistence end-to-end (run these yourself, in order)

```bash
# 1. Register a user
curl -s -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Reader","email":"test@example.com","password":"password123"}'
# -> save the "token" from the response into $TOKEN below

TOKEN="paste-the-token-here"

# 2. Shelve a book (writes a Book doc + a ShelfEntry doc)
curl -s -X POST http://localhost:4000/api/shelf-entries \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"olKey":"/works/OL45804W","title":"The Hobbit","author":"J.R.R. Tolkien","firstPublishYear":1937,"coverId":6979861,"status":"reading","rating":5,"notes":"Rereading for the third time"}'

# 3. Read it back — proves the write actually persisted
curl -s http://localhost:4000/api/shelf-entries \
  -H "Authorization: Bearer $TOKEN"

# 4. Confirm the auth guard actually guards: no token -> 401
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:4000/api/shelf-entries
```

If step 3 returns the entry you created in step 2 (with the `book` field
populated), you have verified live reads and writes against your
MongoDB. If step 4 prints `401`, the auth middleware is confirmed working.
At that point Section 2 and Section 3 of the checkpoint report can cite
this directly instead of describing planned work.

## Endpoints

| Method | Path                     | Auth required | Notes |
|---|---|---|---|
| POST | `/api/auth/register`       | no  | creates `User`, returns JWT |
| POST | `/api/auth/login`          | no  | returns JWT |
| GET  | `/api/books/search?q=...`  | no  | server-side proxy to Open Library |
| POST | `/api/shelf-entries`       | yes | upserts `Book`, creates `ShelfEntry` |
| GET  | `/api/shelf-entries`       | yes | lists the caller's entries (`?status=` optional filter) |
| PATCH| `/api/shelf-entries/:id`   | yes | owner-only update |
| DELETE| `/api/shelf-entries/:id`  | yes | owner-only delete |

## Next step for the frontend

Point `Discover.jsx`'s search at `GET /api/books/search?q=...` instead of
calling Open Library directly, and wire the (not-yet-built) `AddToShelf`
form to `POST /api/shelf-entries` with the JWT from login stored in React
state/context.
