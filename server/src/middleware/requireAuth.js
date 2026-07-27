const jwt = require('jsonwebtoken');

// Custom authorization guard middleware.
// Expects "Authorization: Bearer <token>". On success, attaches req.userId
// and calls next(). On any failure, responds 401 Unauthorized and stops
// the request from reaching the route handler / database.
function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'Unauthorized: missing bearer token' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = payload.sub;
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized: invalid or expired token' });
  }
}

module.exports = { requireAuth };
