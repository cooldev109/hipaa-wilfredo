exports.up = function (knex) {
  return knex.raw(`
    CREATE TABLE patient_history (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      patient_id UUID NOT NULL REFERENCES patients(id),
      visual_history TEXT,
      medical_history TEXT,
      medications TEXT,
      family_ocular_history TEXT,
      family_medical_history TEXT,
      developmental_birth_weeks INTEGER,
      developmental_birth_type VARCHAR(50),
      developmental_crawled_months INTEGER,
      developmental_walked_months INTEGER,
      developmental_talked_months INTEGER,
      therapies JSONB DEFAULT '{}',
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW(),
      created_by UUID NOT NULL REFERENCES users(id),
      updated_by UUID REFERENCES users(id)
    );

    CREATE INDEX idx_patient_history_patient_id ON patient_history(patient_id);
  `);
};

exports.down = function (knex) {
  return knex.raw('DROP TABLE IF EXISTS patient_history;');
};
