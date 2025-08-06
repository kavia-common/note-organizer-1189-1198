const jwt = require('jsonwebtoken');

/**
 * JWT authentication middleware for Express.
 * Verifies Authorization: Bearer <token>, sets req.user if valid. Sends 401 otherwise.
 */

// PUBLIC_INTERFACE
function authenticateJWT(req, res, next) {
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid Authorization header' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Missing JWT' });

  jwt.verify(token, process.env.JWT_SECRET, (err, userPayload) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
    req.user = userPayload;
    next();
  });
}

module.exports = authenticateJWT;
