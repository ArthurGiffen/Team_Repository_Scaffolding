import { useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'
import './Discover.css'

// Encodes an Open Library work key like "/works/OL45804W" down to just
// "OL45804W" so it reads cleanly as a route param (see BookDetail.jsx).
function shortKey(olKey) {
  return olKey.replace('/works/', '')
}

function Discover() {
  const [query, setQuery] = useState('')
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searched, setSearched] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!query.trim()) return

    setLoading(true)
    setError(null)
    setSearched(true)

    try {
      // Goes through our own Express proxy (/api/books/search), not
      // Open Library directly — the server attaches the required
      // User-Agent header and is the single point where we could add
      // caching later.
      const results = await api.searchBooks(query.trim())
      setBooks(results)
    } catch (err) {
      setError(err.message)
      setBooks([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <section>
      <h1>Discover</h1>
      <p className="lead">Search for a book by title or author.</p>

      <form className="search" onSubmit={handleSubmit}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Try “the hobbit” or “octavia butler”"
          aria-label="Search books"
        />
        <button type="submit" disabled={loading || !query.trim()}>
          {loading ? 'Searching…' : 'Search'}
        </button>
      </form>

      {loading && <p className="status">Loading…</p>}
      {error && <p className="status status--error">{error}</p>}
      {!loading && !error && searched && books.length === 0 && (
        <p className="status">No books matched that search.</p>
      )}

      <div className="book-grid">
        {books.map((book) => (
          <Link
            className="book"
            key={book.key}
            to={`/books/${shortKey(book.key)}`}
            state={{ book }}
          >
            {book.cover_i ? (
              <img
                className="book__cover"
                src={`https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`}
                alt={book.title}
                loading="lazy"
              />
            ) : (
              <div className="book__cover book__cover--empty">No cover</div>
            )}
            <div className="book__body">
              <h3 className="book__title">{book.title}</h3>
              <p className="book__meta">
                {book.author_name ? book.author_name[0] : 'Unknown author'}
                {book.first_publish_year ? `, ${book.first_publish_year}` : ''}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default Discover
