exports.up = function (knex) {
  return knex.raw(`
    ALTER TABLE evaluations
    ADD COLUMN IF NOT EXISTS garner_recognition_sd DECIMAL(5,2);
  `);
};

exports.down = function (knex) {
  return knex.raw(`
    ALTER TABLE evaluations
    DROP COLUMN IF EXISTS garner_recognition_sd;
  `);
};
