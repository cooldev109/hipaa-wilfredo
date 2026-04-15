exports.up = function (knex) {
  return knex.raw(`
    ALTER TABLE evaluations
    ADD COLUMN IF NOT EXISTS angles_od VARCHAR(50),
    ADD COLUMN IF NOT EXISTS angles_os VARCHAR(50);
  `);
};

exports.down = function (knex) {
  return knex.raw(`
    ALTER TABLE evaluations
    DROP COLUMN IF EXISTS angles_od,
    DROP COLUMN IF EXISTS angles_os;
  `);
};
