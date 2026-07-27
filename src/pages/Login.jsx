import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Login() {
  const { login, pending, authError, isAuthenticated } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const location = useLocation()

  if (isAuthenticated) {
    // Already logged in — send them wherever they were headed, or home.
    return <Navigate to={location.state?.from || '/'} replace />
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const ok = await login(email, password)
    if (ok) navigate(location.state?.from || '/my-shelves', { replace: true })
  }

  return (
    <section>
      <h1>Log In</h1>
      <p className="lead">Welcome back.</p>

      <form onSubmit={handleSubmit} style={{ maxWidth: 360, marginTop: 20 }}>
        {authError && <p className="form-error">{authError}</p>}

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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit" disabled={pending}>
          {pending ? 'Logging in…' : 'Log In'}
        </button>
      </form>

      <p className="lead" style={{ marginTop: 16 }}>
        Need an account? <Link to="/register">Register</Link>
      </p>
    </section>
  )
}

export default Login
