#!/usr/bin/env node
/**
 * One-shot cleanup script — keep one sample patient, wipe all other patients,
 * their history, evaluations, and reports (including report files on disk).
 *
 * Usage:
 *   # Dry-run (default — only reports what WOULD be deleted)
 *   node server/scripts/cleanup-demo-data.js
 *
 *   # Actually delete
 *   node server/scripts/cleanup-demo-data.js --confirm
 *
 *   # Keep a different patient (instead of Emma) by their UUID
 *   node server/scripts/cleanup-demo-data.js --keep <uuid> --confirm
 *
 *   # Keep a different patient by first name (case-insensitive)
 *   node server/scripts/cleanup-demo-data.js --keep-name Sofia --confirm
 *
 * Users, audit logs, and refresh tokens are not touched.
 */
const path = require('path');
const fs = require('fs');

require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const { pool } = require('../config/database');
const { decrypt } = require('../utils/encryption');

function arg(flag) {
  const i = process.argv.indexOf(flag);
  return i > -1 ? process.argv[i + 1] : null;
}
const CONFIRM = process.argv.includes('--confirm');
const LIST_ONLY = process.argv.includes('--list');
const KEEP_ID = arg('--keep');
const KEEP_NAME = (arg('--keep-name') || 'Emma').trim();

(async () => {
  if (LIST_ONLY) {
    const rows = (await pool.query(
      'SELECT id, first_name_encrypted, last_name_encrypted, created_at FROM patients WHERE deleted_at IS NULL ORDER BY created_at'
    )).rows;
    console.log(`Patients in DB (${rows.length}):`);
    for (const p of rows) {
      let first = '?', last = '?';
      try { first = decrypt(p.first_name_encrypted) || '?'; } catch { /* ignore */ }
      try { last = decrypt(p.last_name_encrypted) || '?'; } catch { /* ignore */ }
      console.log(`  ${p.id}  ${first} ${last}`);
    }
    await pool.end();
    return;
  }
  console.log(CONFIRM ? '=== CLEANUP (live) ===' : '=== CLEANUP (dry-run) ===');
  console.log();

  // 1) Resolve the patient to keep
  let keepId = KEEP_ID;
  if (!keepId) {
    const rows = (await pool.query('SELECT id, first_name_encrypted, last_name_encrypted FROM patients WHERE deleted_at IS NULL')).rows;
    for (const p of rows) {
      try {
        const first = decrypt(p.first_name_encrypted) || '';
        if (first.toLowerCase() === KEEP_NAME.toLowerCase()) {
          keepId = p.id;
          const last = decrypt(p.last_name_encrypted) || '';
          console.log(`Keeping patient: ${first} ${last} (${keepId})`);
          break;
        }
      } catch { /* ignore decryption failures */ }
    }
  }
  if (!keepId) {
    console.error(`ERROR: no patient matched --keep-name "${KEEP_NAME}". Use --keep <uuid> to specify a patient ID directly.`);
    await pool.end();
    process.exit(1);
  }

  // 2) Count what would be deleted
  const counts = {
    patients: (await pool.query('SELECT COUNT(*)::int AS n FROM patients WHERE id != $1', [keepId])).rows[0].n,
    history: (await pool.query('SELECT COUNT(*)::int AS n FROM patient_history WHERE patient_id != $1', [keepId])).rows[0].n,
    evaluations: (await pool.query('SELECT COUNT(*)::int AS n FROM evaluations WHERE patient_id != $1', [keepId])).rows[0].n,
    reports: (await pool.query('SELECT COUNT(*)::int AS n FROM reports WHERE patient_id != $1', [keepId])).rows[0].n
  };

  console.log();
  console.log('Will delete:');
  for (const [k, v] of Object.entries(counts)) console.log(`  ${k.padEnd(12)} ${v}`);

  // 3) Enumerate report files on disk. The docx_file_path column only exists
  // after migration 012, so we discover available columns dynamically.
  const cols = (await pool.query(
    `SELECT column_name FROM information_schema.columns
     WHERE table_name = 'reports' AND column_name IN ('pdf_file_path', 'docx_file_path')`
  )).rows.map((r) => r.column_name);
  const pathCols = cols.join(', ') || "''::text AS pdf_file_path";
  const fileRows = (await pool.query(
    `SELECT ${pathCols} FROM reports WHERE patient_id != $1`,
    [keepId]
  )).rows;
  const filesToDelete = [];
  for (const r of fileRows) {
    if (r.pdf_file_path && fs.existsSync(r.pdf_file_path)) filesToDelete.push(r.pdf_file_path);
    if (r.docx_file_path && fs.existsSync(r.docx_file_path)) filesToDelete.push(r.docx_file_path);
  }
  console.log(`  report files (disk) ${filesToDelete.length}`);

  if (!CONFIRM) {
    console.log();
    console.log('Dry-run only. Re-run with --confirm to actually delete.');
    await pool.end();
    return;
  }

  // 4) Hard-delete in FK-safe order, all inside a transaction.
  // Audit logs are intentionally preserved for HIPAA compliance.
  console.log();
  console.log('Deleting...');
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const r1 = await client.query('DELETE FROM reports WHERE patient_id != $1', [keepId]);
    const r2 = await client.query('DELETE FROM evaluations WHERE patient_id != $1', [keepId]);
    const r3 = await client.query('DELETE FROM patient_history WHERE patient_id != $1', [keepId]);
    const r4 = await client.query('DELETE FROM patients WHERE id != $1', [keepId]);
    await client.query('COMMIT');
    console.log(`  reports        ${r1.rowCount}`);
    console.log(`  evaluations    ${r2.rowCount}`);
    console.log(`  history        ${r3.rowCount}`);
    console.log(`  patients       ${r4.rowCount}`);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Transaction rolled back:', err.message);
    await client.release();
    await pool.end();
    process.exit(1);
  }
  client.release();

  // 5) Remove report files from disk
  let removed = 0;
  for (const f of filesToDelete) {
    try { fs.unlinkSync(f); removed++; } catch { /* ignore */ }
  }
  console.log(`  report files   ${removed}`);

  console.log();
  console.log('Done.');
  await pool.end();
})().catch(async (e) => {
  console.error('FAILED:', e.message);
  try { await pool.end(); } catch { /* ignore */ }
  process.exit(1);
});
