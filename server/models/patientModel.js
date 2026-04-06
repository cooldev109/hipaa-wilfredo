const { pool } = require('../config/database');
const { encrypt, decrypt, createSearchHash } = require('../utils/encryption');

async function create({ firstName, lastName, dateOfBirth, sex, school, grade, referredBy, parentGuardianName, parentGuardianPhone, parentGuardianEmail, createdBy }) {
  const searchHash = createSearchHash(`${firstName} ${lastName}`);

  const result = await pool.query(
    `INSERT INTO patients (
      first_name_encrypted, last_name_encrypted, date_of_birth_encrypted,
      sex, school, grade, referred_by,
      parent_guardian_name_encrypted, parent_guardian_phone_encrypted, parent_guardian_email_encrypted,
      search_hash, created_by
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
    RETURNING id, sex, school, grade, referred_by, search_hash, created_at`,
    [
      encrypt(firstName), encrypt(lastName), encrypt(dateOfBirth),
      sex, school || null, grade || null, referredBy || null,
      encrypt(parentGuardianName), encrypt(parentGuardianPhone), encrypt(parentGuardianEmail),
      searchHash, createdBy
    ]
  );

  const row = result.rows[0];
  return {
    id: row.id,
    firstName,
    lastName,
    dateOfBirth,
    sex: row.sex,
    school: row.school,
    grade: row.grade,
    referredBy: row.referred_by,
    parentGuardianName,
    parentGuardianPhone,
    parentGuardianEmail,
    createdAt: row.created_at
  };
}

async function findById(id) {
  const result = await pool.query(
    `SELECT id, first_name_encrypted, last_name_encrypted, date_of_birth_encrypted,
            sex, school, grade, referred_by,
            parent_guardian_name_encrypted, parent_guardian_phone_encrypted, parent_guardian_email_encrypted,
            created_at, updated_at, created_by, updated_by
     FROM patients WHERE id = $1 AND deleted_at IS NULL`,
    [id]
  );

  if (result.rows.length === 0) return null;
  return decryptPatient(result.rows[0]);
}

async function findAll({ search, school, grade, page = 1, limit = 25 }) {
  const offset = (page - 1) * limit;
  const conditions = ['deleted_at IS NULL'];
  const params = [];
  let paramIndex = 1;

  if (search) {
    const searchHash = createSearchHash(search);
    conditions.push(`search_hash = $${paramIndex}`);
    params.push(searchHash);
    paramIndex++;
  }

  if (school) {
    conditions.push(`school ILIKE $${paramIndex}`);
    params.push(`%${school}%`);
    paramIndex++;
  }

  if (grade) {
    conditions.push(`grade = $${paramIndex}`);
    params.push(grade);
    paramIndex++;
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const countResult = await pool.query(
    `SELECT COUNT(*) as total FROM patients ${whereClause}`,
    params
  );
  const total = parseInt(countResult.rows[0].total, 10);

  const dataResult = await pool.query(
    `SELECT id, first_name_encrypted, last_name_encrypted, date_of_birth_encrypted,
            sex, school, grade, referred_by, created_at
     FROM patients ${whereClause}
     ORDER BY created_at DESC
     LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
    [...params, limit, offset]
  );

  const patients = dataResult.rows.map(decryptPatient);

  return {
    patients,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
}

async function update(id, { firstName, lastName, dateOfBirth, sex, school, grade, referredBy, parentGuardianName, parentGuardianPhone, parentGuardianEmail, updatedBy }) {
  const searchHash = createSearchHash(`${firstName} ${lastName}`);

  const result = await pool.query(
    `UPDATE patients SET
      first_name_encrypted = $1, last_name_encrypted = $2, date_of_birth_encrypted = $3,
      sex = $4, school = $5, grade = $6, referred_by = $7,
      parent_guardian_name_encrypted = $8, parent_guardian_phone_encrypted = $9, parent_guardian_email_encrypted = $10,
      search_hash = $11, updated_by = $12, updated_at = NOW()
     WHERE id = $13 AND deleted_at IS NULL
     RETURNING id`,
    [
      encrypt(firstName), encrypt(lastName), encrypt(dateOfBirth),
      sex, school || null, grade || null, referredBy || null,
      encrypt(parentGuardianName), encrypt(parentGuardianPhone), encrypt(parentGuardianEmail),
      searchHash, updatedBy, id
    ]
  );

  if (result.rows.length === 0) return null;
  return findById(id);
}

async function softDelete(id, deletedBy) {
  const result = await pool.query(
    `UPDATE patients SET deleted_at = NOW(), updated_by = $1, updated_at = NOW()
     WHERE id = $2 AND deleted_at IS NULL
     RETURNING id`,
    [deletedBy, id]
  );
  return result.rows.length > 0;
}

function decryptPatient(row) {
  return {
    id: row.id,
    firstName: decrypt(row.first_name_encrypted),
    lastName: decrypt(row.last_name_encrypted),
    dateOfBirth: decrypt(row.date_of_birth_encrypted),
    sex: row.sex,
    school: row.school,
    grade: row.grade,
    referredBy: row.referred_by,
    parentGuardianName: row.parent_guardian_name_encrypted ? decrypt(row.parent_guardian_name_encrypted) : null,
    parentGuardianPhone: row.parent_guardian_phone_encrypted ? decrypt(row.parent_guardian_phone_encrypted) : null,
    parentGuardianEmail: row.parent_guardian_email_encrypted ? decrypt(row.parent_guardian_email_encrypted) : null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    createdBy: row.created_by,
    updatedBy: row.updated_by
  };
}

module.exports = { create, findById, findAll, update, softDelete };
