exports.up = function (knex) {
  return knex.raw(`
    ALTER TABLE reports
    ADD COLUMN IF NOT EXISTS docx_file_path TEXT,
    ADD COLUMN IF NOT EXISTS docx_file_hash VARCHAR(64);
  `);
};

exports.down = function (knex) {
  return knex.raw(`
    ALTER TABLE reports
    DROP COLUMN IF EXISTS docx_file_path,
    DROP COLUMN IF EXISTS docx_file_hash;
  `);
};
