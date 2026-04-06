const { pool } = require('../config/database');
const logger = require('../utils/logger');

const MAX_ATTEMPTS = 5;
const LOCKOUT_MINUTES = 15;

async function checkLoginAttempts(email) {
  try {
    const result = await pool.query(
      `SELECT failed_login_attempts, locked_until FROM users WHERE email = $1`,
      [email]
    );

    if (result.rows.length === 0) {
      return { allowed: true };
    }

    const user = result.rows[0];

    if (user.locked_until && new Date(user.locked_until) > new Date()) {
      const remainingMs = new Date(user.locked_until) - new Date();
      const remainingMin = Math.ceil(remainingMs / 60000);
      return {
        allowed: false,
        message: `Cuenta bloqueada. Intente nuevamente en ${remainingMin} minuto(s).`
      };
    }

    return { allowed: true };
  } catch (err) {
    logger.error({ err }, 'Error checking login attempts');
    return { allowed: true };
  }
}

async function recordFailedAttempt(email) {
  try {
    const result = await pool.query(
      `UPDATE users
       SET failed_login_attempts = failed_login_attempts + 1,
           locked_until = CASE
             WHEN failed_login_attempts + 1 >= $1
             THEN NOW() + INTERVAL '${LOCKOUT_MINUTES} minutes'
             ELSE locked_until
           END,
           updated_at = NOW()
       WHERE email = $2
       RETURNING failed_login_attempts`,
      [MAX_ATTEMPTS, email]
    );
    return result.rows[0] ? result.rows[0].failed_login_attempts : 0;
  } catch (err) {
    logger.error({ err }, 'Error recording failed login attempt');
    return 0;
  }
}

async function resetLoginAttempts(email) {
  try {
    await pool.query(
      `UPDATE users SET failed_login_attempts = 0, locked_until = NULL, updated_at = NOW() WHERE email = $1`,
      [email]
    );
  } catch (err) {
    logger.error({ err }, 'Error resetting login attempts');
  }
}

module.exports = { checkLoginAttempts, recordFailedAttempt, resetLoginAttempts };
