const jwt = require('jsonwebtoken');
const env = require('../config/environment');

function authenticate(req, res, next) {
  const token = req.cookies && req.cookies.accessToken;

  if (!token) {
    return res.status(401).json({ success: false, errorCode: 'UNAUTHORIZED' });
  }

  try {
    const decoded = jwt.verify(token, env.jwt.accessSecret);
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role
    };
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, errorCode: 'SESSION_EXPIRED' });
    }
    return res.status(401).json({ success: false, errorCode: 'INVALID_TOKEN' });
  }
}

module.exports = authenticate;
