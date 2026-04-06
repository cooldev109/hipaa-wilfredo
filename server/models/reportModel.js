const { pool } = require('../config/database');

async function create({ evaluationId, patientId, version, reportData, conditionBlocks, createdBy }) {
  const result = await pool.query(
    `INSERT INTO reports (evaluation_id, patient_id, version, status, report_data, condition_blocks, created_by)
     VALUES ($1, $2, $3, 'draft', $4, $5, $6)
     RETURNING *`,
    [evaluationId, patientId, version, JSON.stringify(reportData), JSON.stringify(conditionBlocks), createdBy]
  );
  return formatRow(result.rows[0]);
}

async function findById(id) {
  const result = await pool.query('SELECT * FROM reports WHERE id = $1', [id]);
  return formatRow(result.rows[0]);
}

async function findByEvaluationId(evaluationId) {
  const result = await pool.query(
    'SELECT * FROM reports WHERE evaluation_id = $1 ORDER BY version DESC',
    [evaluationId]
  );
  return result.rows.map(formatRow);
}

async function findAll({ page = 1, limit = 25 }) {
  const offset = (page - 1) * limit;

  const countResult = await pool.query('SELECT COUNT(*) as total FROM reports');
  const total = parseInt(countResult.rows[0].total, 10);

  const dataResult = await pool.query(
    `SELECT r.*, p.first_name_encrypted, p.last_name_encrypted
     FROM reports r
     JOIN patients p ON r.patient_id = p.id
     ORDER BY r.created_at DESC
     LIMIT $1 OFFSET $2`,
    [limit, offset]
  );

  return {
    reports: dataResult.rows.map(formatRow),
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
  };
}

async function getNextVersion(evaluationId) {
  const result = await pool.query(
    'SELECT COALESCE(MAX(version), 0) + 1 as next_version FROM reports WHERE evaluation_id = $1',
    [evaluationId]
  );
  return result.rows[0].next_version;
}

async function updatePdfPath(id, pdfFilePath, pdfFileHash) {
  await pool.query(
    'UPDATE reports SET pdf_file_path = $1, pdf_file_hash = $2, status = $3, updated_at = NOW() WHERE id = $4',
    [pdfFilePath, pdfFileHash, 'final', id]
  );
}

async function signDoctor(id, signatureData, signedBy) {
  const result = await pool.query(
    `UPDATE reports SET doctor_signature_data = $1, doctor_signed_at = NOW(), doctor_signed_by = $2, updated_at = NOW()
     WHERE id = $3 RETURNING *`,
    [signatureData, signedBy, id]
  );
  return formatRow(result.rows[0]);
}

async function signParent(id, signatureData, signerName) {
  const result = await pool.query(
    `UPDATE reports SET parent_signature_data = $1, parent_signed_at = NOW(), parent_signer_name = $2,
     status = CASE WHEN doctor_signature_data IS NOT NULL THEN 'signed' ELSE status END,
     updated_at = NOW()
     WHERE id = $3 RETURNING *`,
    [signatureData, signerName, id]
  );
  return formatRow(result.rows[0]);
}

function formatRow(row) {
  if (!row) return null;
  const result = {};
  for (const [key, value] of Object.entries(row)) {
    const camelKey = key.replace(/_([a-z])/g, (_, l) => l.toUpperCase());
    result[camelKey] = value;
  }
  return result;
}

module.exports = { create, findById, findByEvaluationId, findAll, getNextVersion, updatePdfPath, signDoctor, signParent };
