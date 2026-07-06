import { useEffect, useState } from 'react'
import './Discover.css'

// API handshake: on load, fetch the Open Library API (free, no key),
// log the results, and show the books. This proves the network works.
const SAMPLE_QUERY =
  'https://openlibrary.org/search.json?q=the+lord+of+the+rings&fields=key,title,author_name,first_publish_year,cover_i&limit=8'

function Discover() {
  const [books, setBooks] = useState([])
  const [status, setStatus] = useState('Loading...')

  useEffect(() => {
    fetch(SAMPLE_QUERY)
      .then((res) => res.json())
      .then((data) => {
        console.log('API handshake OK. Open Library returned:', data.docs)
        setBooks(data.docs)
        setStatus('')
      })
      .catch((err) => {
        console.error('Handshake failed:', err)
        setStatus('Could not reach the Open Library API.')
      })
  }, [])

  return (
    <section>
      <h1>Discover</h1>
      <p className="lead">Sample results from the Open Library API.</p>

      {status && <p className="status">{status}</p>}

      <div className="book-grid">
        {books.map((book) => (
          <article className="book" key={book.key}>
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
          </article>
        ))}
      </div>
    </section>
  )
}

export default Discover
