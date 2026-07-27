const { Router } = require('express');
const { requireAuth } = require('../middleware/requireAuth');
const Book = require('../models/Book');
const ShelfEntry = require('../models/ShelfEntry');

const router = Router();

// Every route in this file is protected — requireAuth runs first and
// short-circuits with 401 before any handler below touches the database.
router.use(requireAuth);

// POST /api/shelf-entries
// body: { olKey, title, author, firstPublishYear, coverId, status, rating, notes }
// Caches the Book on first shelve, then creates the ShelfEntry for req.userId.
router.post('/', async (req, res) => {
  try {
    const { olKey, title, author, firstPublishYear, coverId, status, rating, notes } = req.body;

    if (!olKey || !title || !status) {
      return res.status(400).json({ error: 'olKey, title, and status are required' });
    }

    // Cache the book locally the first time it's shelved by anyone.
    const book = await Book.findOneAndUpdate(
      { olKey },
      { $setOnInsert: { olKey, title, author, firstPublishYear, coverId } },
      { upsert: true, new: true }
    );

    const entry = await ShelfEntry.create({
      user: req.userId,
      book: book._id,
      status,
      rating,
      notes,
    });

    const populated = await entry.populate('book');
    return res.status(201).json(populated);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: 'You already have this book on a shelf' });
    }
    return res.status(500).json({ error: 'Could not create shelf entry', detail: err.message });
  }
});

// GET /api/shelf-entries?status=reading
// Returns the signed-in user's shelf entries, newest first, book details populated.
router.get('/', async (req, res) => {
  try {
    const filter = { user: req.userId };
    if (req.query.status) filter.status = req.query.status;

    const entries = await ShelfEntry.find(filter).populate('book').sort({ createdAt: -1 });
    return res.json(entries);
  } catch (err) {
    return res.status(500).json({ error: 'Could not load shelf entries', detail: err.message });
  }
});

// PATCH /api/shelf-entries/:id
// body: any subset of { status, rating, notes }
// Only the owning user may update their own entry.
router.patch('/:id', async (req, res) => {
  try {
    const { status, rating, notes } = req.body;
    const update = {};
    if (status !== undefined) update.status = status;
    if (rating !== undefined) update.rating = rating;
    if (notes !== undefined) update.notes = notes;

    const entry = await ShelfEntry.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      update,
      { new: true }
    ).populate('book');

    if (!entry) {
      return res.status(404).json({ error: 'Shelf entry not found' });
    }
    return res.json(entry);
  } catch (err) {
    return res.status(500).json({ error: 'Could not update shelf entry', detail: err.message });
  }
});

// DELETE /api/shelf-entries/:id
// Only the owning user may delete their own entry.
router.delete('/:id', async (req, res) => {
  try {
    const entry = await ShelfEntry.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!entry) {
      return res.status(404).json({ error: 'Shelf entry not found' });
    }
    return res.status(204).send();
  } catch (err) {
    return res.status(500).json({ error: 'Could not delete shelf entry', detail: err.message });
  }
});

module.exports = router;
