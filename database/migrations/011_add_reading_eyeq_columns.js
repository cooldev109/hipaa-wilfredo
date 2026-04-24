exports.up = function (knex) {
  return knex.raw(`
    ALTER TABLE evaluations
    ADD COLUMN IF NOT EXISTS reading_eyeq_wpm INTEGER,
    ADD COLUMN IF NOT EXISTS reading_eyeq_grade_level VARCHAR(50);
  `);
};

exports.down = function (knex) {
  return knex.raw(`
    ALTER TABLE evaluations
    DROP COLUMN IF EXISTS reading_eyeq_wpm,
    DROP COLUMN IF EXISTS reading_eyeq_grade_level;
  `);
};
