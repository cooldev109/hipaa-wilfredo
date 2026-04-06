const { pool } = require('../config/database');

async function findByPatientId(patientId) {
  const result = await pool.query(
    `SELECT id, patient_id, visual_history, medical_history, medications,
            family_ocular_history, family_medical_history,
            developmental_birth_weeks, developmental_birth_type,
            developmental_crawled_months, developmental_walked_months, developmental_talked_months,
            therapies, created_at, updated_at
     FROM patient_history WHERE patient_id = $1
     ORDER BY created_at DESC LIMIT 1`,
    [patientId]
  );

  if (result.rows.length === 0) return null;
  return formatHistory(result.rows[0]);
}

async function createOrUpdate(patientId, data, userId) {
  const existing = await findByPatientId(patientId);

  if (existing) {
    const result = await pool.query(
      `UPDATE patient_history SET
        visual_history = $1, medical_history = $2, medications = $3,
        family_ocular_history = $4, family_medical_history = $5,
        developmental_birth_weeks = $6, developmental_birth_type = $7,
        developmental_crawled_months = $8, developmental_walked_months = $9, developmental_talked_months = $10,
        therapies = $11, updated_by = $12, updated_at = NOW()
       WHERE patient_id = $13
       RETURNING *`,
      [
        data.visualHistory || null, data.medicalHistory || null, data.medications || null,
        data.familyOcularHistory || null, data.familyMedicalHistory || null,
        data.developmentalBirthWeeks || null, data.developmentalBirthType || null,
        data.developmentalCrawledMonths || null, data.developmentalWalkedMonths || null, data.developmentalTalkedMonths || null,
        JSON.stringify(data.therapies || {}), userId, patientId
      ]
    );
    return formatHistory(result.rows[0]);
  }

  const result = await pool.query(
    `INSERT INTO patient_history (
      patient_id, visual_history, medical_history, medications,
      family_ocular_history, family_medical_history,
      developmental_birth_weeks, developmental_birth_type,
      developmental_crawled_months, developmental_walked_months, developmental_talked_months,
      therapies, created_by
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
    RETURNING *`,
    [
      patientId,
      data.visualHistory || null, data.medicalHistory || null, data.medications || null,
      data.familyOcularHistory || null, data.familyMedicalHistory || null,
      data.developmentalBirthWeeks || null, data.developmentalBirthType || null,
      data.developmentalCrawledMonths || null, data.developmentalWalkedMonths || null, data.developmentalTalkedMonths || null,
      JSON.stringify(data.therapies || {}), userId
    ]
  );
  return formatHistory(result.rows[0]);
}

function formatHistory(row) {
  return {
    id: row.id,
    patientId: row.patient_id,
    visualHistory: row.visual_history,
    medicalHistory: row.medical_history,
    medications: row.medications,
    familyOcularHistory: row.family_ocular_history,
    familyMedicalHistory: row.family_medical_history,
    developmentalBirthWeeks: row.developmental_birth_weeks,
    developmentalBirthType: row.developmental_birth_type,
    developmentalCrawledMonths: row.developmental_crawled_months,
    developmentalWalkedMonths: row.developmental_walked_months,
    developmentalTalkedMonths: row.developmental_talked_months,
    therapies: typeof row.therapies === 'string' ? JSON.parse(row.therapies) : (row.therapies || {}),
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

module.exports = { findByPatientId, createOrUpdate };
