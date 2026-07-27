import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { api } from '../api/client'
import './MyShelves.css'

const SHELVES = [
  { key: 'want', label: 'Want to Read' },
  { key: 'reading', label: 'Reading' },
  { key: 'read', label: 'Read' },
]

function MyShelves() {
  const { token } = useAuth()
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    api
      .getShelfEntries(token)
      .then((data) => {
        if (!cancelled) setEntries(data)
      })
      .catch((err) => {
        if (!cancelled) setError(err.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [token])

  async function handleStatusChange(id, status) {
    const updated = await api.updateShelfEntry(token, id, { status })
    setEntries((prev) => prev.map((e) => (e._id === id ? updated : e)))
  }

  async function handleDelete(id) {
    await api.deleteShelfEntry(token, id)
    setEntries((prev) => prev.filter((e) => e._id !== id))
  }

  if (loading) return <p className="status">Loading your shelves…</p>
  if (error) return <p className="status status--error">{error}</p>

  return (
    <section>
      <h1>My Shelves</h1>
      <p className="lead">Everything you've saved, grouped by status.</p>

      {entries.length === 0 && (
        <p className="status">
          Nothing shelved yet — <Link to="/discover">find a book</Link> to get started.
        </p>
      )}

      <div className="shelves">
        {SHELVES.map(({ key, label }) => {
          const shelfEntries = entries.filter((e) => e.status === key)
          if (shelfEntries.length === 0) return null

          return (
            <div className="shelf" key={key}>
              <h2>{label}</h2>
              <ul className="shelf__list">
                {shelfEntries.map((entry) => (
                  <li className="shelf-entry" key={entry._id}>
                    {entry.book?.coverId ? (
                      <img
                        className="shelf-entry__cover"
                        src={`https://covers.openlibrary.org/b/id/${entry.book.coverId}-M.jpg`}
                        alt={entry.book.title}
                      />
                    ) : (
                      <div className="shelf-entry__cover shelf-entry__cover--empty" />
                    )}

                    <div className="shelf-entry__body">
                      <h3>{entry.book?.title}</h3>
                      <p className="book__meta">{entry.book?.author}</p>
                      {entry.rating && <p className="shelf-entry__rating">{'★'.repeat(entry.rating)}</p>}
                      {entry.notes && <p className="shelf-entry__notes">{entry.notes}</p>}

                      <div className="shelf-entry__actions">
                        <select
                          value={entry.status}
                          onChange={(e) => handleStatusChange(entry._id, e.target.value)}
                        >
                          {SHELVES.map((s) => (
                            <option key={s.key} value={s.key}>{s.label}</option>
                          ))}
                        </select>
                        <button className="btn--ghost" onClick={() => handleDelete(entry._id)}>
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default MyShelves
