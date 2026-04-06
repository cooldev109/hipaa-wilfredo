const { pool } = require('../config/database');

async function findByEmail(email) {
  const result = await pool.query(
    `SELECT id, email, password_hash, first_name, last_name, role, license_number,
            is_active, force_password_change, failed_login_attempts, locked_until, last_login_at
     FROM users WHERE email = $1`,
    [email]
  );
  return result.rows[0] || null;
}

async function findById(id) {
  const result = await pool.query(
    `SELECT id, email, first_name, last_name, role, license_number,
            is_active, force_password_change, last_login_at, created_at
     FROM users WHERE id = $1`,
    [id]
  );
  return result.rows[0] || null;
}

async function findAll() {
  const result = await pool.query(
    `SELECT id, email, first_name, last_name, role, license_number,
            is_active, force_password_change, last_login_at, created_at, updated_at
     FROM users ORDER BY created_at DESC`
  );
  return result.rows;
}

async function create({ email, passwordHash, firstName, lastName, role, licenseNumber, createdBy }) {
  const result = await pool.query(
    `INSERT INTO users (email, password_hash, first_name, last_name, role, license_number, created_by)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING id, email, first_name, last_name, role, license_number, is_active, force_password_change, created_at`,
    [email, passwordHash, firstName, lastName, role, licenseNumber || null, createdBy]
  );
  return result.rows[0];
}

async function update(id, { firstName, lastName, email, licenseNumber }) {
  const result = await pool.query(
    `UPDATE users SET first_name = $1, last_name = $2, email = $3, license_number = $4, updated_at = NOW()
     WHERE id = $5
     RETURNING id, email, first_name, last_name, role, license_number, is_active, force_password_change`,
    [firstName, lastName, email, licenseNumber || null, id]
  );
  return result.rows[0] || null;
}

async function updatePassword(id, passwordHash) {
  await pool.query(
    `UPDATE users SET password_hash = $1, force_password_change = false, updated_at = NOW() WHERE id = $2`,
    [passwordHash, id]
  );
}

async function updateLastLogin(id) {
  await pool.query(
    `UPDATE users SET last_login_at = NOW(), updated_at = NOW() WHERE id = $1`,
    [id]
  );
}

async function deactivate(id) {
  const result = await pool.query(
    `UPDATE users SET is_active = false, updated_at = NOW() WHERE id = $1
     RETURNING id, email, first_name, last_name, role, is_active`,
    [id]
  );
  return result.rows[0] || null;
}

async function updateRole(id, role) {
  const result = await pool.query(
    `UPDATE users SET role = $1, updated_at = NOW() WHERE id = $2
     RETURNING id, email, first_name, last_name, role, is_active`,
    [role, id]
  );
  return result.rows[0] || null;
}

async function updateLoginAttempts(email, attempts, lockedUntil) {
  await pool.query(
    `UPDATE users SET failed_login_attempts = $1, locked_until = $2, updated_at = NOW() WHERE email = $3`,
    [attempts, lockedUntil, email]
  );
}

async function resetLoginAttempts(email) {
  await pool.query(
    `UPDATE users SET failed_login_attempts = 0, locked_until = NULL, updated_at = NOW() WHERE email = $1`,
    [email]
  );
}

module.exports = {
  findByEmail,
  findById,
  findAll,
  create,
  update,
  updatePassword,
  updateLastLogin,
  deactivate,
  updateRole,
  updateLoginAttempts,
  resetLoginAttempts
};
