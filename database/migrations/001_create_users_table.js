exports.up = function (knex) {
  return knex.raw(`
    CREATE EXTENSION IF NOT EXISTS "pgcrypto";

    CREATE TABLE users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      first_name VARCHAR(100) NOT NULL,
      last_name VARCHAR(100) NOT NULL,
      role VARCHAR(20) NOT NULL CHECK (role IN ('doctor', 'assistant', 'secretary')),
      license_number VARCHAR(50),
      is_active BOOLEAN DEFAULT true,
      force_password_change BOOLEAN DEFAULT true,
      failed_login_attempts INTEGER DEFAULT 0,
      locked_until TIMESTAMP,
      last_login_at TIMESTAMP,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW(),
      created_by UUID REFERENCES users(id)
    );
  `);
};

exports.down = function (knex) {
  return knex.raw('DROP TABLE IF EXISTS users;');
};
