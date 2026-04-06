exports.up = function (knex) {
  return knex.raw(`
    CREATE TABLE reports (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      evaluation_id UUID NOT NULL REFERENCES evaluations(id),
      patient_id UUID NOT NULL REFERENCES patients(id),
      version INTEGER DEFAULT 1,
      status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'final', 'signed')),
      report_data JSONB NOT NULL,
      pdf_file_path TEXT,
      pdf_file_hash VARCHAR(64),
      doctor_signature_data TEXT,
      doctor_signed_at TIMESTAMP,
      doctor_signed_by UUID REFERENCES users(id),
      parent_signature_data TEXT,
      parent_signed_at TIMESTAMP,
      parent_signer_name VARCHAR(200),
      condition_blocks JSONB DEFAULT '[]',
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW(),
      created_by UUID NOT NULL REFERENCES users(id)
    );

    CREATE INDEX idx_reports_evaluation_id ON reports(evaluation_id);
    CREATE INDEX idx_reports_patient_id ON reports(patient_id);
    CREATE INDEX idx_reports_status ON reports(status);
  `);
};

exports.down = function (knex) {
  return knex.raw('DROP TABLE IF EXISTS reports;');
};
