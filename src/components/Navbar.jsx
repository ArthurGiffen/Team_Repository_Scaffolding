import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Navbar.css'

// NavLink marks the current link active and navigates without reloading the page.
function Navbar() {
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <header className="nav">
      <div className="nav__brand">📚 Shelf</div>
      <nav className="nav__links">
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/discover">Discover</NavLink>
        <NavLink to="/about">Team</NavLink>
        {isAuthenticated ? (
          <>
            <NavLink to="/my-shelves">My Shelves</NavLink>
            <button className="btn--ghost nav__logout" onClick={handleLogout}>
              Log out{user?.name ? ` (${user.name})` : ''}
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login">Log In</NavLink>
            <NavLink to="/register">Register</NavLink>
          </>
        )}
      </nav>
    </header>
  )
}

export default Navbar
