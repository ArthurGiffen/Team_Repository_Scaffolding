import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Register() {
  const { register, pending, authError, isAuthenticated } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  if (isAuthenticated) {
    return <Navigate to="/my-shelves" replace />
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const ok = await register(name, email, password)
    if (ok) navigate('/my-shelves', { replace: true })
  }

  return (
    <section>
      <h1>Create an Account</h1>
      <p className="lead">Start tracking what you read.</p>

      <form onSubmit={handleSubmit} style={{ maxWidth: 360, marginTop: 20 }}>
        {authError && <p className="form-error">{authError}</p>}

        <div className="field">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit" disabled={pending}>
          {pending ? 'Creating account…' : 'Register'}
        </button>
      </form>

      <p className="lead" style={{ marginTop: 16 }}>
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </section>
  )
}

export default Register
