const { pool } = require('../config/database');

// All evaluation columns except id and metadata
const EVALUATION_FIELDS = [
  'patient_id', 'evaluation_date', 'status', 'reason_for_visit',
  'va_near_aided_od', 'va_near_aided_os', 'va_near_aided_ou',
  'va_near_unaided_od', 'va_near_unaided_os', 'va_near_unaided_ou', 'va_near_method',
  'va_distance_aided_od', 'va_distance_aided_os', 'va_distance_aided_ou',
  'va_distance_unaided_od', 'va_distance_unaided_os', 'va_distance_unaided_ou', 'va_distance_method',
  'color_vision_test', 'color_vision_result', 'stereo_test', 'stereo_result',
  'cover_test_distance', 'cover_test_near',
  'pursuits_ou', 'saccades_ou',
  'npc_1_blur', 'npc_1_break', 'npc_1_recovery',
  'npc_2_blur', 'npc_2_break', 'npc_2_recovery',
  'npa_od', 'npa_os', 'sheards_od', 'sheards_os', 'minimum_aoa',
  'retinoscopy_od', 'retinoscopy_os',
  'subjective_refraction_od', 'subjective_refraction_os',
  'final_rx_od', 'final_rx_os', 'final_rx_add',
  'post_rx_va_retinoscopy_od', 'post_rx_va_retinoscopy_os', 'post_rx_va_retinoscopy_ou',
  'post_rx_va_subjective_od', 'post_rx_va_subjective_os', 'post_rx_va_subjective_ou',
  'post_rx_va_final_od', 'post_rx_va_final_os', 'post_rx_va_final_ou',
  'phoria_distance_h', 'phoria_distance_v', 'phoria_near_h', 'phoria_near_v',
  'vergence_distance_bi', 'vergence_distance_bo', 'vergence_distance_bu', 'vergence_distance_bd',
  'vergence_near_bi', 'vergence_near_bo', 'vergence_near_bu', 'vergence_near_bd',
  'ext_lids_lash_od', 'ext_lids_lash_os', 'ext_conj_od', 'ext_conj_os',
  'ext_cornea_od', 'ext_cornea_os', 'ext_iris_od', 'ext_iris_os',
  'ext_angles_od', 'ext_angles_os', 'ext_pupils_od', 'ext_pupils_os',
  'int_lens_od', 'int_lens_os', 'int_media_od', 'int_media_os',
  'int_cd_od', 'int_cd_os', 'int_av_od', 'int_av_os',
  'int_macula_fr_od', 'int_macula_fr_os',
  'righteye_global_score', 'righteye_tracking_score', 'righteye_saccadic_score', 'righteye_fixation_score',
  'garner_unknown_errors', 'garner_unknown_mean', 'garner_unknown_sd',
  'garner_reversed_errors', 'garner_reversed_mean', 'garner_reversed_sd',
  'garner_recognition_errors', 'garner_recognition_mean', 'garner_recognition_sd',
  'vmi_raw_score', 'vmi_chronological_age', 'vmi_perceptual_age', 'vmi_standard_score', 'vmi_percentile',
  'vp_raw_score', 'vp_chronological_age', 'vp_perceptual_age', 'vp_standard_score', 'vp_percentile',
  'assessment_notes', 'diagnoses', 'plan_rx_od', 'plan_rx_os', 'plan_rx_add', 'recommendations'
];

// Map camelCase JS keys to snake_case DB columns
function camelToSnake(str) {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

function snakeToCamel(str) {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

function formatRow(row) {
  if (!row) return null;
  const result = {};
  for (const [key, value] of Object.entries(row)) {
    result[snakeToCamel(key)] = value;
  }
  return result;
}

function prepareData(data) {
  const dbData = {};
  for (const [key, value] of Object.entries(data)) {
    const snakeKey = camelToSnake(key);
    if (EVALUATION_FIELDS.includes(snakeKey)) {
      // JSON fields
      if (['diagnoses', 'recommendations', 'ext_angles_od', 'ext_angles_os'].includes(snakeKey)) {
        dbData[snakeKey] = typeof value === 'string' ? value : JSON.stringify(value);
      } else if (['retinoscopy_od', 'retinoscopy_os', 'subjective_refraction_od', 'subjective_refraction_os',
                   'final_rx_od', 'final_rx_os', 'vergence_distance_bi', 'vergence_distance_bo',
                   'vergence_near_bi', 'vergence_near_bo'].includes(snakeKey)) {
        dbData[snakeKey] = typeof value === 'string' ? value : JSON.stringify(value);
      } else {
        dbData[snakeKey] = value === '' ? null : value;
      }
    }
  }
  return dbData;
}

async function create(patientId, evaluationDate, createdBy) {
  const result = await pool.query(
    `INSERT INTO evaluations (patient_id, evaluation_date, status, created_by)
     VALUES ($1, $2, 'draft', $3)
     RETURNING *`,
    [patientId, evaluationDate, createdBy]
  );
  return formatRow(result.rows[0]);
}

async function findById(id) {
  const result = await pool.query(
    `SELECT e.*, p.first_name_encrypted, p.last_name_encrypted, p.date_of_birth_encrypted, p.sex
     FROM evaluations e
     JOIN patients p ON e.patient_id = p.id
     WHERE e.id = $1 AND e.deleted_at IS NULL`,
    [id]
  );
  return formatRow(result.rows[0]);
}

async function findByPatientId(patientId) {
  const result = await pool.query(
    `SELECT id, patient_id, evaluation_date, status, created_at, updated_at, last_auto_saved_at
     FROM evaluations
     WHERE patient_id = $1 AND deleted_at IS NULL
     ORDER BY evaluation_date DESC`,
    [patientId]
  );
  return result.rows.map(formatRow);
}

async function findAll({ status, page = 1, limit = 25 }) {
  const offset = (page - 1) * limit;
  const conditions = ['e.deleted_at IS NULL'];
  const params = [];
  let paramIndex = 1;

  if (status) {
    conditions.push(`e.status = $${paramIndex}`);
    params.push(status);
    paramIndex++;
  }

  const whereClause = conditions.join(' AND ');

  const countResult = await pool.query(
    `SELECT COUNT(*) as total FROM evaluations e WHERE ${whereClause}`,
    params
  );
  const total = parseInt(countResult.rows[0].total, 10);

  const dataResult = await pool.query(
    `SELECT e.id, e.patient_id, e.evaluation_date, e.status, e.created_at, e.last_auto_saved_at,
            p.first_name_encrypted, p.last_name_encrypted
     FROM evaluations e
     JOIN patients p ON e.patient_id = p.id
     WHERE ${whereClause}
     ORDER BY e.evaluation_date DESC
     LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
    [...params, limit, offset]
  );

  return {
    evaluations: dataResult.rows.map(formatRow),
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
  };
}

async function update(id, data, updatedBy) {
  const dbData = prepareData(data);
  if (Object.keys(dbData).length === 0) return findById(id);

  const setClauses = [];
  const values = [];
  let paramIndex = 1;

  for (const [key, value] of Object.entries(dbData)) {
    setClauses.push(`${key} = $${paramIndex}`);
    values.push(value);
    paramIndex++;
  }

  setClauses.push(`updated_by = $${paramIndex}`);
  values.push(updatedBy);
  paramIndex++;

  setClauses.push(`updated_at = NOW()`);

  values.push(id);

  const result = await pool.query(
    `UPDATE evaluations SET ${setClauses.join(', ')} WHERE id = $${paramIndex} AND deleted_at IS NULL RETURNING *`,
    values
  );

  return formatRow(result.rows[0]);
}

async function autoSave(id, data, updatedBy) {
  const dbData = prepareData(data);
  if (Object.keys(dbData).length === 0) return null;

  const setClauses = [];
  const values = [];
  let paramIndex = 1;

  for (const [key, value] of Object.entries(dbData)) {
    setClauses.push(`${key} = $${paramIndex}`);
    values.push(value);
    paramIndex++;
  }

  setClauses.push(`updated_by = $${paramIndex}`);
  values.push(updatedBy);
  paramIndex++;

  setClauses.push(`last_auto_saved_at = NOW()`);
  setClauses.push(`updated_at = NOW()`);

  values.push(id);

  await pool.query(
    `UPDATE evaluations SET ${setClauses.join(', ')} WHERE id = $${paramIndex} AND deleted_at IS NULL`,
    values
  );
}

async function updateStatus(id, status) {
  const result = await pool.query(
    `UPDATE evaluations SET status = $1, updated_at = NOW() WHERE id = $2 AND deleted_at IS NULL RETURNING *`,
    [status, id]
  );
  return formatRow(result.rows[0]);
}

async function softDelete(id, deletedBy) {
  const result = await pool.query(
    `UPDATE evaluations SET deleted_at = NOW(), updated_by = $1, updated_at = NOW()
     WHERE id = $2 AND deleted_at IS NULL RETURNING id`,
    [deletedBy, id]
  );
  return result.rows.length > 0;
}

module.exports = { create, findById, findByPatientId, findAll, update, autoSave, updateStatus, softDelete };
