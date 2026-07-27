import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { api } from '../api/client'

// Flow B from the proposal: from a book's detail, "Add to Shelf" opens this
// multi-field form (status / rating / notes) and POSTs it to our API.
function AddToShelfForm({ book }) {
  const { token } = useAuth()
  const [status, setStatus] = useState('want')
  const [rating, setRating] = useState('')
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      await api.createShelfEntry(token, {
        olKey: book.key,
        title: book.title,
        author: book.author_name ? book.author_name[0] : undefined,
        firstPublishYear: book.first_publish_year,
        coverId: book.cover_i,
        status,
        rating: rating ? Number(rating) : undefined,
        notes: notes || undefined,
      })
      setSuccess(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (success) {
    return <p className="form-success">Added to your shelf.</p>
  }

  return (
    <form className="add-to-shelf" onSubmit={handleSubmit}>
      {error && <p className="form-error">{error}</p>}

      <div className="field">
        <label htmlFor="status">Shelf</label>
        <select id="status" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="want">Want to Read</option>
          <option value="reading">Reading</option>
          <option value="read">Read</option>
        </select>
      </div>

      <div className="field">
        <label htmlFor="rating">Rating (1–5, optional)</label>
        <select id="rating" value={rating} onChange={(e) => setRating(e.target.value)}>
          <option value="">No rating</option>
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor="notes">Notes (optional)</label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="What did you think?"
        />
      </div>

      <button type="submit" disabled={submitting}>
        {submitting ? 'Adding…' : 'Add to Shelf'}
      </button>
    </form>
  )
}

export default AddToShelfForm
