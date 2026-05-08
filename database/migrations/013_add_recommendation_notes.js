exports.up = function (knex) {
  return knex.raw(`
    ALTER TABLE evaluations
    ADD COLUMN IF NOT EXISTS recommendation_notes TEXT,
    ADD COLUMN IF NOT EXISTS re_evaluation_months INTEGER;
  `);
};

exports.down = function (knex) {
  return knex.raw(`
    ALTER TABLE evaluations
    DROP COLUMN IF EXISTS recommendation_notes,
    DROP COLUMN IF EXISTS re_evaluation_months;
  `);
};
