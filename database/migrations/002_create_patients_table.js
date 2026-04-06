exports.up = function (knex) {
  return knex.raw(`
    CREATE TABLE patients (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      first_name_encrypted TEXT NOT NULL,
      last_name_encrypted TEXT NOT NULL,
      date_of_birth_encrypted TEXT NOT NULL,
      sex VARCHAR(1) NOT NULL CHECK (sex IN ('M', 'F')),
      school VARCHAR(255),
      grade VARCHAR(50),
      referred_by VARCHAR(255),
      parent_guardian_name_encrypted TEXT,
      parent_guardian_phone_encrypted TEXT,
      parent_guardian_email_encrypted TEXT,
      search_hash VARCHAR(64),
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW(),
      created_by UUID NOT NULL REFERENCES users(id),
      updated_by UUID REFERENCES users(id),
      deleted_at TIMESTAMP
    );

    CREATE INDEX idx_patients_search_hash ON patients(search_hash);
    CREATE INDEX idx_patients_created_by ON patients(created_by);
    CREATE INDEX idx_patients_deleted_at ON patients(deleted_at);
  `);
};

exports.down = function (knex) {
  return knex.raw('DROP TABLE IF EXISTS patients;');
};
