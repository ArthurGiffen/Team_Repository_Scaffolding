import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Wraps a protected page. If there's no token (never logged in, or logged
// out client-side after a 401), redirect to /login and remember where the
// user was headed so we can send them back after they sign in.
function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
}

export default PrivateRoute;
