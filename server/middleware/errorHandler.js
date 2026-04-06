const logger = require('../utils/logger');

function errorHandler(err, req, res, next) {
  logger.error({
    err,
    method: req.method,
    url: req.url,
    userId: req.user ? req.user.userId : null
  }, 'Unhandled error');

  if (err.isJoi || err.name === 'ValidationError') {
    return res.status(400).json({ success: false, errorCode: 'VALIDATION_ERROR' });
  }

  if (err.name === 'UnauthorizedError' || err.status === 401) {
    return res.status(401).json({ success: false, errorCode: 'UNAUTHORIZED' });
  }

  if (err.status === 403) {
    return res.status(403).json({ success: false, errorCode: 'FORBIDDEN' });
  }

  if (err.status === 404) {
    return res.status(404).json({ success: false, errorCode: 'NOT_FOUND' });
  }

  return res.status(500).json({ success: false, errorCode: 'INTERNAL_ERROR' });
}

module.exports = errorHandler;
