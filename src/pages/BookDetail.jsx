import { Link, useLocation, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AddToShelfForm from '../components/AddToShelfForm'
import './BookDetail.css'

// The book data is passed via router state from the Discover card the user
// clicked (see Discover.jsx's <Link state={{ book }}>). If someone lands
// here directly — a refresh, a shared link — there's no state to read yet,
// so we show a friendly way back to Discover rather than a blank page.
// (A stretch goal noted in the proposal — a dedicated
// GET /api/books/:olKey server route — would make this URL reload-safe.)
function BookDetail() {
  const { olKey } = useParams()
  const location = useLocation()
  const { isAuthenticated } = useAuth()
  const book = location.state?.book

  if (!book) {
    return (
      <section>
        <h1>Book not found here</h1>
        <p className="lead">
          This page only has book details when you arrive from a search result.
        </p>
        <Link className="btn btn--ghost" to="/discover">← Back to Discover</Link>
      </section>
    )
  }

  return (
    <section className="book-detail">
      {book.cover_i ? (
        <img
          className="book-detail__cover"
          src={`https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`}
          alt={book.title}
        />
      ) : (
        <div className="book-detail__cover book-detail__cover--empty">No cover</div>
      )}

      <div className="book-detail__body">
        <h1>{book.title}</h1>
        <p className="lead">
          {book.author_name ? book.author_name[0] : 'Unknown author'}
          {book.first_publish_year ? ` · first published ${book.first_publish_year}` : ''}
        </p>

        <div className="book-detail__shelf">
          {isAuthenticated ? (
            <AddToShelfForm book={book} />
          ) : (
            <p className="status">
              <Link to="/login" state={{ from: `/books/${olKey}` }}>Log in</Link> to add this to a shelf.
            </p>
          )}
        </div>
      </div>
    </section>
  )
}

export default BookDetail
