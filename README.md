# Shelf
**Live app:** https://team-repository-scaffolding.vercel.app
**API:** https://team-repository-scaffolding.onrender.com

## Overview
Shelf is a lightweight reading tracker. You search a large catalog of books,
then you can ad them onto personal shelves as "Want to Read,"
"Reading," and "Read" — each with your own rating and notes. It's the useful
core of a reading app (find a book, save it, remember what you thought)
without the social feed and clutter of bigger platforms.

Built as a React single-page app backed by an Express + MongoDB API:
client-side routing with a persistent navbar, JWT auth, and a book search /
shelf-tracking flow with real persistence.

**Team:** JAB TECH — 
Boris Hernandez ([@Boris713](https://github.com/Boris713)),
Arthur Giffen ([@ArthurGiffen](https://github.com/ArthurGiffen)),
Jun Brooks ([@junbug23](https://github.com/junbug23))

**Stack:** React (Vite) · react-router-dom · Node.js + Express · MongoDB Atlas
(Mongoose) · JWT + bcrypt · Open Library API · deployed on Vercel (frontend)
and Render (API).

## Run it
Backend first, in one terminal:

```bash
cd server
npm install
cp .env.example .env    # fill in MONGODB_URI and JWT_SECRET, see below
npm run dev              # http://localhost:4000
```

Frontend, in another terminal from the repo root:

```bash
npm install
npm run dev      # open the http://localhost:5173 link it prints
```

### Backend setup
`server/.env` needs:

- **MONGODB_URI** — we're using a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
  cluster; grab your own connection string from there. Local instead:
  `mongodb://127.0.0.1:27017/shelf`.
- **JWT_SECRET** — any long random string.
- **FRONTEND_URL** *(optional)* — restricts CORS to that origin. Left unset
  in local dev, which allows any origin.

You should see `[db] MongoDB connected` and `[server] listening on
http://localhost:4000` once it's running.

### Frontend setup

`VITE_API_BASE_URL` (repo root `.env`) points the client at the API. Defaults
to `http://localhost:4000/api` if unset, so local dev needs no config. Note
that Vite bakes this in at **build** time — changing it in production requires
a redeploy, not just a restart.

## What's here

- **Organized structure:** `src/components/` (presentation, e.g. `Navbar`,
  `AddToShelfForm`) vs `src/pages/` (routed page targets: `Home`, `Discover`,
  `BookDetail`, `MyShelves`, `Login`, `Register`, `About`) vs `server/`
  (Express + Mongoose API).
- **Router tree:** `react-router-dom`, with `MyShelves` gated behind
  `PrivateRoute` so you have to be logged in to see it. The `Navbar` sits
  outside `<Routes>` in `App.jsx`, so it stays put across views with no
  full-page reloads.
- **Auth:** `AuthContext` holds onto the JWT you get back from
  `/api/auth/login` or `/api/auth/register`, and `src/api/client.js` attaches
  it to requests and sends you to `/login` if one ever comes back 401.
- **API handshake:** `pages/Discover.jsx` submits a search that hits our own
  `GET /api/books/search` instead of calling Open Library directly — the
  Express server proxies it so it can attach the User-Agent header Open
  Library asks for. From there you can open a book and shelve it with
  `AddToShelfForm`.

## API documentation

Base URL: `/api`. All request and response bodies are JSON. Protected routes
expect an `Authorization: Bearer <token>` header; the token comes from
register or login.

| Method | Path                      | Auth | Notes                                                           |
| ------ | ------------------------- | ---- | --------------------------------------------------------------- |
| GET    | `/api/health`             | no   | liveness check, returns `{ ok: true }`                          |
| POST   | `/api/auth/register`      | no   | creates the account, returns a JWT                              |
| POST   | `/api/auth/login`         | no   | checks the password, returns a JWT                              |
| GET    | `/api/books/search?q=...` | no   | proxies Open Library                                            |
| POST   | `/api/shelf-entries`      | yes  | saves the book (first time it's seen) and adds it to your shelf |
| GET    | `/api/shelf-entries`      | yes  | your shelf, newest first (`?status=` to filter)                 |
| PATCH  | `/api/shelf-entries/:id`  | yes  | update one of your own entries                                  |
| DELETE | `/api/shelf-entries/:id`  | yes  | remove one of your own entries                                  |

Register and login are deliberately public — you need them to obtain a token
in the first place.

### Request examples

**POST `/api/auth/register`**

```json
{ "name": "Ada", "email": "ada@example.com", "password": "password123" }
```

Returns `201` with `{ token, user: { id, name, email } }`.

**POST `/api/auth/login`**

```json
{ "email": "ada@example.com", "password": "password123" }
```

Returns `200` with `{ token, user }`.

**POST `/api/shelf-entries`** (requires Bearer token)

```json
{
  "olKey": "/works/OL45804W",
  "title": "The Hobbit",
  "author": "J.R.R. Tolkien",
  "firstPublishYear": 1937,
  "coverId": 6979861,
  "status": "reading",
  "rating": 5,
  "notes": "Rereading for the third time"
}
```

Returns `201` with the created entry, `book` populated.

**PATCH `/api/shelf-entries/:id`** — any subset of `status`, `rating`, `notes`:

```json
{ "status": "read" }
```

### Status codes

| Code | Meaning in this API                                           |
| ---- | ------------------------------------------------------------- |
| 200  | OK                                                            |
| 201  | Created (register, new shelf entry)                           |
| 204  | Deleted, no body returned                                     |
| 400  | Missing required fields                                       |
| 401  | Missing, invalid, or expired token                            |
| 404  | Entry doesn't exist, or isn't yours                           |
| 409  | Duplicate — email already registered, or book already shelved |
| 500  | Server error                                                  |


## User roles + workflows
There is only one role a **registered user**. There is no admin or moderator
tier. Authorization is ownership-based rather than role-based: every
shelf-entry query filters on `user: req.userId`, where that id comes from the
verified token, not from client input. Attempting to request another user's entry by id
returns `404`.

### Flow 1 — Discover a book
1. User types a title or author into the search bar on Discover and submits.
2. The app calls `GET /api/books/search`, which proxies Open Library, and
   renders matching books as a grid of cover cards.
3. Clicking a card opens the book's detail view (cover, author, first
   published year).

### Flow 2 — Add a book to a shelf
1. From a book's detail page, the user fills in the Add to Shelf form.
2. The form captures shelf status (Want to Read / Reading / Read), an optional
   1–5 rating, and optional notes.
3. On submit, `POST /api/shelf-entries` upserts the `Book` and creates a
   `ShelfEntry` owned by that user.
4. The book then appears under the matching heading on My Shelves, where it
   can be moved between shelves (`PATCH`) or removed (`DELETE`).

## Data source
[Open Library API](https://openlibrary.org/developers/api) (Internet Archive) —
free, no API key. Proxied through our Express server rather than called
directly from the browser. User accounts and shelf entries persist in
MongoDB via that same server. Cover images are the one exception: the browser
loads those directly from `covers.openlibrary.org`, since they're public
static images with nothing to proxy.


## AI assistance disclosure

This project was built with AI assistance (Claude)
**Where AI was used:** Initial scaffolding of the Express + Mongoose
backend (`requireAuth', middleware) and the Login / Register pages, hashing support,
deployment configuration for Render and Vercel, and debugging support
throughout. Also assisted in (PowerShell and Git issues, Atlas IP allowlist failure, Postman
request setup), and Readme polishing.  