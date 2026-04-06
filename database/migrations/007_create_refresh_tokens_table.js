exports.up = function (knex) {
  return knex.raw(`
    CREATE TABLE refresh_tokens (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id),
      token_hash VARCHAR(64) NOT NULL,
      expires_at TIMESTAMP NOT NULL,
      is_revoked BOOLEAN DEFAULT false,
      revoked_at TIMESTAMP,
      created_at TIMESTAMP DEFAULT NOW(),
      ip_address VARCHAR(45),
      user_agent TEXT
    );

    CREATE INDEX idx_refresh_tokens_user ON refresh_tokens(user_id);
    CREATE INDEX idx_refresh_tokens_hash ON refresh_tokens(token_hash);
  `);
};

exports.down = function (knex) {
  return knex.raw('DROP TABLE IF EXISTS refresh_tokens;');
};
