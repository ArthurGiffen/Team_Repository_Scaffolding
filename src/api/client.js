// Thin fetch wrapper around our Express API. Every component that needs the
// server goes through here instead of calling fetch() directly, so the base
// URL, JSON headers, and 401 handling live in exactly one place.

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

// AuthContext registers a callback here on mount so this module (which has
// no access to React context) can still react to a 401 by clearing the
// stored token and sending the user to /login.
let onUnauthorized = () => {};
export function setUnauthorizedHandler(fn) {
  onUnauthorized = fn;
}

async function request(path, { method = 'GET', body, token } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  let res;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch (networkErr) {
    // The server is down / unreachable — distinct from a 4xx/5xx JSON error.
    throw new Error('Could not reach the server. Is it running?');
  }

  if (res.status === 401) {
    onUnauthorized();
  }

  // No-content responses (e.g. DELETE) won't have a JSON body to parse.
  const hasBody = res.status !== 204;
  const data = hasBody ? await res.json().catch(() => ({})) : null;

  if (!res.ok) {
    throw new Error(data?.error || `Request failed (${res.status})`);
  }

  return data;
}

export const api = {
  register: (name, email, password) =>
    request('/auth/register', { method: 'POST', body: { name, email, password } }),

  login: (email, password) =>
    request('/auth/login', { method: 'POST', body: { email, password } }),

  searchBooks: (q) => request(`/books/search?q=${encodeURIComponent(q)}`),

  getShelfEntries: (token, status) =>
    request(`/shelf-entries${status ? `?status=${status}` : ''}`, { token }),

  createShelfEntry: (token, entry) =>
    request('/shelf-entries', { method: 'POST', body: entry, token }),

  updateShelfEntry: (token, id, changes) =>
    request(`/shelf-entries/${id}`, { method: 'PATCH', body: changes, token }),

  deleteShelfEntry: (token, id) =>
    request(`/shelf-entries/${id}`, { method: 'DELETE', token }),
};
