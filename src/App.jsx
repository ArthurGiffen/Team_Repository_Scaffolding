import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar.jsx'
import PrivateRoute from './components/PrivateRoute.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import Home from './pages/Home.jsx'
import Discover from './pages/Discover.jsx'
import About from './pages/About.jsx'
import BookDetail from './pages/BookDetail.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import MyShelves from './pages/MyShelves.jsx'

// The Navbar is outside <Routes>, so it stays on screen on every page.
// Only the matched route below it changes, with no full page reloads.
// AuthProvider wraps everything so any page/component can read the
// signed-in user's token via useAuth(). ErrorBoundary wraps the routed
// area so a bug in one page shows a fallback instead of a blank screen.
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <main className="page">
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/discover" element={<Discover />} />
              <Route path="/about" element={<About />} />
              <Route path="/books/:olKey" element={<BookDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/my-shelves"
                element={
                  <PrivateRoute>
                    <MyShelves />
                  </PrivateRoute>
                }
              />
            </Routes>
          </ErrorBoundary>
        </main>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
