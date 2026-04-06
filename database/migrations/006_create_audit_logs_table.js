exports.up = function (knex) {
  return knex.raw(`
    CREATE TABLE audit_logs (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      timestamp TIMESTAMP DEFAULT NOW(),
      user_id UUID REFERENCES users(id),
      user_email VARCHAR(255),
      action VARCHAR(50) NOT NULL,
      resource VARCHAR(50),
      resource_id UUID,
      ip_address VARCHAR(45),
      user_agent TEXT,
      details JSONB,
      created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
    CREATE INDEX idx_audit_logs_resource ON audit_logs(resource, resource_id);
    CREATE INDEX idx_audit_logs_action ON audit_logs(action);
    CREATE INDEX idx_audit_logs_timestamp ON audit_logs(timestamp);
  `);
};

exports.down = function (knex) {
  return knex.raw('DROP TABLE IF EXISTS audit_logs;');
};
