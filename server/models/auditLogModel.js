const { pool } = require('../config/database');
const { v4: uuidv4 } = require('uuid');
const logger = require('../utils/logger');

async function create({ userId, userEmail, action, resource, resourceId, ipAddress, userAgent, details }) {
  try {
    await pool.query(
      `INSERT INTO audit_logs (id, user_id, user_email, action, resource, resource_id, ip_address, user_agent, details)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        uuidv4(),
        userId || null,
        userEmail || null,
        action,
        resource || null,
        resourceId || null,
        ipAddress || null,
        userAgent || null,
        details ? JSON.stringify(details) : null
      ]
    );
  } catch (err) {
    logger.error({ err, action, resource }, 'Failed to write audit log');
  }
}

module.exports = { create };
