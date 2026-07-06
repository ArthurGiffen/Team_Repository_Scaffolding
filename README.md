# Shelf

We will update this doc as we progress.

A minimal React single-page app for our capstone: client-side routing with a
persistent navbar, an organized `components` / `pages` structure, and a
`useEffect` fetch to the Open Library API that proves our data connection works.

## Run it

```bash
npm install
npm run dev      # open the http://localhost:5173 link it prints
```

## What's here

- **Organized structure:** `src/components/` (presentation, e.g. `Navbar`) vs
  `src/pages/` (routed page targets: `Home`, `Discover`, `About`).
- **Router tree:** `react-router-dom` with 3 routes - `/` (Home), `/discover`,
  `/about` (Team). The `Navbar` sits outside `<Routes>` in `App.jsx`, so it stays
  put across views with no full-page reloads.
- **API handshake:** `pages/Discover.jsx` runs a `useEffect` on mount that
  fetches the Open Library search API (free, no key), console-logs the results
  array (open DevTools to see it), and displays book covers on screen. In the
  capstone this becomes a live search box; the fetch logic stays the same.

## Data source

[Open Library API](https://openlibrary.org/developers/api) (Internet Archive) -
free, no API key. Search: `openlibrary.org/search.json?q=...`. Covers:
`covers.openlibrary.org/b/id/<cover_i>-M.jpg`.
