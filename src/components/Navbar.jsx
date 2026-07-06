import { NavLink } from 'react-router-dom'
import './Navbar.css'

// NavLink marks the current link active and navigates without reloading the page.
function Navbar() {
  return (
    <header className="nav">
      <div className="nav__brand">📚 Shelf</div>
      <nav className="nav__links">
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/discover">Discover</NavLink>
        <NavLink to="/about">Team</NavLink>
      </nav>
    </header>
  )
}

export default Navbar
