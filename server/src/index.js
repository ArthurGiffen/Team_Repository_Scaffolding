require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./db');

const authRoutes = require('./routes/auth.routes');
const shelfEntriesRoutes = require('./routes/shelfEntries.routes');
const booksRoutes = require('./routes/books.routes');

const app = express();

// In production set FRONTEND_URL to the deployed frontend's origin so only
// it can call this API. Left open in local dev for convenience.
app.use(cors({ origin: process.env.FRONTEND_URL || true }));
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ ok: true }));

app.use('/api/auth', authRoutes);
app.use('/api/shelf-entries', shelfEntriesRoutes); // requireAuth is applied inside this router
app.use('/api/books', booksRoutes);

const PORT = process.env.PORT || 4000;

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`[server] listening on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('[server] failed to start:', err.message);
    process.exit(1);
  });

module.exports = app;
