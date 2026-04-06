const { pool } = require('../config/database');

async function getStats(req, res, next) {
  try {
    const [patientsResult, evalsMonthResult, pendingReportsResult] = await Promise.all([
      pool.query('SELECT COUNT(*) as total FROM patients WHERE deleted_at IS NULL'),
      pool.query(`SELECT COUNT(*) as total FROM evaluations WHERE deleted_at IS NULL AND evaluation_date >= date_trunc('month', CURRENT_DATE)`),
      pool.query("SELECT COUNT(*) as total FROM evaluations WHERE deleted_at IS NULL AND status = 'complete' AND id NOT IN (SELECT evaluation_id FROM reports)")
    ]);

    return res.json({
      success: true,
      data: {
        totalPatients: parseInt(patientsResult.rows[0].total, 10),
        evaluationsThisMonth: parseInt(evalsMonthResult.rows[0].total, 10),
        pendingReports: parseInt(pendingReportsResult.rows[0].total, 10)
      }
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getStats };
