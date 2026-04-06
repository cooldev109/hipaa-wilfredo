const { pool } = require('../config/database');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');

function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

async function create({ userId, token, expiresAt, ipAddress, userAgent }) {
  const tokenHash = hashToken(token);
  await pool.query(
    `INSERT INTO refresh_tokens (id, user_id, token_hash, expires_at, ip_address, user_agent)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [uuidv4(), userId, tokenHash, expiresAt, ipAddress || null, userAgent || null]
  );
}

async function findByToken(token) {
  const tokenHash = hashToken(token);
  const result = await pool.query(
    `SELECT id, user_id, token_hash, expires_at, is_revoked
     FROM refresh_tokens
     WHERE token_hash = $1 AND is_revoked = false AND expires_at > NOW()`,
    [tokenHash]
  );
  return result.rows[0] || null;
}

async function revoke(token) {
  const tokenHash = hashToken(token);
  await pool.query(
    `UPDATE refresh_tokens SET is_revoked = true, revoked_at = NOW() WHERE token_hash = $1`,
    [tokenHash]
  );
}

async function revokeAllForUser(userId) {
  await pool.query(
    `UPDATE refresh_tokens SET is_revoked = true, revoked_at = NOW() WHERE user_id = $1 AND is_revoked = false`,
    [userId]
  );
}

module.exports = { create, findByToken, revoke, revokeAllForUser, hashToken };
