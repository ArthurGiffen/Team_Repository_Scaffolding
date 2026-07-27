const { Router } = require('express');

const router = Router();

// GET /api/books/search?q=lord+of+the+rings
// Proxies Open Library search through our own server so we can send the
// descriptive User-Agent header Open Library asks API consumers to include,
// and so the frontend calls only our API, never a third party directly.
router.get('/search', async (req, res) => {
  try {
    const q = req.query.q;
    if (!q) {
      return res.status(400).json({ error: 'q query parameter is required' });
    }

    const url = new URL('https://openlibrary.org/search.json');
    url.searchParams.set('q', q);
    url.searchParams.set('fields', 'key,title,author_name,first_publish_year,cover_i');
    url.searchParams.set('limit', '20');

    const upstream = await fetch(url, {
      headers: {
        'User-Agent': 'Shelf-Capstone/0.1 (contact: jab-tech-team@example.com)',
      },
    });

    if (!upstream.ok) {
      return res.status(502).json({ error: 'Open Library request failed' });
    }

    const data = await upstream.json();
    return res.json(data.docs || []);
  } catch (err) {
    return res.status(500).json({ error: 'Book search failed', detail: err.message });
  }
});

module.exports = router;
