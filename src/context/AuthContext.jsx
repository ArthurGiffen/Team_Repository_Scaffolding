import { createContext, useContext, useEffect, useState } from 'react';
import { api, setUnauthorizedHandler } from '../api/client';

// The JWT lives in React state only — deliberately NOT localStorage or
// sessionStorage, to keep it out of storage that's readable by any script
// on the page (XSS surface). Trade-off: a page refresh logs the user out.
// A future iteration could swap this for an httpOnly-cookie-based session
// to fix that without reintroducing the localStorage risk.
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [authError, setAuthError] = useState(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    // Any 401 from the API client logs the user out client-side too, so
    // the UI never sits in a state where it thinks it's authenticated but
    // every request is silently failing.
    setUnauthorizedHandler(() => {
      setToken(null);
      setUser(null);
    });
  }, []);

  async function register(name, email, password) {
    setPending(true);
    setAuthError(null);
    try {
      const data = await api.register(name, email, password);
      setToken(data.token);
      setUser(data.user);
      return true;
    } catch (err) {
      setAuthError(err.message);
      return false;
    } finally {
      setPending(false);
    }
  }

  async function login(email, password) {
    setPending(true);
    setAuthError(null);
    try {
      const data = await api.login(email, password);
      setToken(data.token);
      setUser(data.user);
      return true;
    } catch (err) {
      setAuthError(err.message);
      return false;
    } finally {
      setPending(false);
    }
  }

  function logout() {
    setToken(null);
    setUser(null);
  }

  const value = { token, user, isAuthenticated: !!token, authError, pending, register, login, logout };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
