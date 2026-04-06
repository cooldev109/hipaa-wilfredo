const { pool } = require('../config/database');
const { v4: uuidv4 } = require('uuid');
const logger = require('../utils/logger');

async function createAuditEntry({ userId, userEmail, action, resource, resourceId, ipAddress, userAgent, details }) {
  try {
    await pool.query(
      `INSERT INTO audit_logs (id, user_id, user_email, action, resource, resource_id, ip_address, user_agent, details)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [uuidv4(), userId, userEmail, action, resource, resourceId, ipAddress, userAgent, details ? JSON.stringify(details) : null]
    );
  } catch (err) {
    logger.error({ err, action, resource, resourceId }, 'Failed to create audit log entry');
  }
}

function auditLog(action, resource) {
  return (req, res, next) => {
    const originalJson = res.json.bind(res);

    res.json = function (body) {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        const resourceId = req.params.id || req.params.patientId || (body && body.data && body.data.id);
        createAuditEntry({
          userId: req.user ? req.user.userId : null,
          userEmail: req.user ? req.user.email : null,
          action,
          resource,
          resourceId: resourceId || null,
          ipAddress: req.ip,
          userAgent: req.get('User-Agent'),
          details: null
        });
      }
      return originalJson(body);
    };

    next();
  };
}

module.exports = { auditLog, createAuditEntry };
