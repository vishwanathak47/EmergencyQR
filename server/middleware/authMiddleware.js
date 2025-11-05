const jwt = require('jsonwebtoken');

function verifyJWT(req, res, next) {
  // Support token from cookie (httpOnly) or Authorization header (Bearer)
  let token = null;
  if (req.cookies && req.cookies.token) token = req.cookies.token;
  else if (req.headers && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) return res.status(401).json({ message: 'No token provided' });

  jwt.verify(token, process.env.JWT_ACCESS_SECRET, (err, decoded) => {
    if (err) {
      // clear cookie to avoid stale cookie situations
      try { res.clearCookie('token', { httpOnly: true, secure: process.env.NODE_ENV === 'production' }); } catch (e) {}
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    req.user = { userId: decoded.userId, role: decoded.role };
    next();
  });
}

module.exports = { verifyJWT };
