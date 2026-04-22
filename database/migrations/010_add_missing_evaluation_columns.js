exports.up = function (knex) {
  return knex.raw(`
    ALTER TABLE evaluations
    -- Cover Test — split into type + prism diopters
    ADD COLUMN IF NOT EXISTS cover_test_distance_type VARCHAR(50),
    ADD COLUMN IF NOT EXISTS cover_test_distance_pd VARCHAR(20),
    ADD COLUMN IF NOT EXISTS cover_test_near_type VARCHAR(50),
    ADD COLUMN IF NOT EXISTS cover_test_near_pd VARCHAR(20),

    -- Phorias — split into type + amount
    ADD COLUMN IF NOT EXISTS phoria_distance_h_type VARCHAR(50),
    ADD COLUMN IF NOT EXISTS phoria_distance_h_amount VARCHAR(20),
    ADD COLUMN IF NOT EXISTS phoria_distance_v_type VARCHAR(50),
    ADD COLUMN IF NOT EXISTS phoria_distance_v_amount VARCHAR(20),
    ADD COLUMN IF NOT EXISTS phoria_near_h_type VARCHAR(50),
    ADD COLUMN IF NOT EXISTS phoria_near_h_amount VARCHAR(20),
    ADD COLUMN IF NOT EXISTS phoria_near_v_type VARCHAR(50),
    ADD COLUMN IF NOT EXISTS phoria_near_v_amount VARCHAR(20),

    -- Vergences — blur/break/recovery for BI, BO at Distance and Near
    ADD COLUMN IF NOT EXISTS verg_dist_bi_blur VARCHAR(20),
    ADD COLUMN IF NOT EXISTS verg_dist_bi_break VARCHAR(20),
    ADD COLUMN IF NOT EXISTS verg_dist_bi_recovery VARCHAR(20),
    ADD COLUMN IF NOT EXISTS verg_dist_bo_blur VARCHAR(20),
    ADD COLUMN IF NOT EXISTS verg_dist_bo_break VARCHAR(20),
    ADD COLUMN IF NOT EXISTS verg_dist_bo_recovery VARCHAR(20),
    ADD COLUMN IF NOT EXISTS verg_dist_bu VARCHAR(20),
    ADD COLUMN IF NOT EXISTS verg_dist_bd VARCHAR(20),
    ADD COLUMN IF NOT EXISTS verg_near_bi_blur VARCHAR(20),
    ADD COLUMN IF NOT EXISTS verg_near_bi_break VARCHAR(20),
    ADD COLUMN IF NOT EXISTS verg_near_bi_recovery VARCHAR(20),
    ADD COLUMN IF NOT EXISTS verg_near_bo_blur VARCHAR(20),
    ADD COLUMN IF NOT EXISTS verg_near_bo_break VARCHAR(20),
    ADD COLUMN IF NOT EXISTS verg_near_bo_recovery VARCHAR(20),
    ADD COLUMN IF NOT EXISTS verg_near_bu VARCHAR(20),
    ADD COLUMN IF NOT EXISTS verg_near_bd VARCHAR(20),

    -- Plan RX Lens Type
    ADD COLUMN IF NOT EXISTS plan_rx_lens_type VARCHAR(100);
  `);
};

exports.down = function (knex) {
  return knex.raw(`
    ALTER TABLE evaluations
    DROP COLUMN IF EXISTS cover_test_distance_type,
    DROP COLUMN IF EXISTS cover_test_distance_pd,
    DROP COLUMN IF EXISTS cover_test_near_type,
    DROP COLUMN IF EXISTS cover_test_near_pd,
    DROP COLUMN IF EXISTS phoria_distance_h_type,
    DROP COLUMN IF EXISTS phoria_distance_h_amount,
    DROP COLUMN IF EXISTS phoria_distance_v_type,
    DROP COLUMN IF EXISTS phoria_distance_v_amount,
    DROP COLUMN IF EXISTS phoria_near_h_type,
    DROP COLUMN IF EXISTS phoria_near_h_amount,
    DROP COLUMN IF EXISTS phoria_near_v_type,
    DROP COLUMN IF EXISTS phoria_near_v_amount,
    DROP COLUMN IF EXISTS verg_dist_bi_blur,
    DROP COLUMN IF EXISTS verg_dist_bi_break,
    DROP COLUMN IF EXISTS verg_dist_bi_recovery,
    DROP COLUMN IF EXISTS verg_dist_bo_blur,
    DROP COLUMN IF EXISTS verg_dist_bo_break,
    DROP COLUMN IF EXISTS verg_dist_bo_recovery,
    DROP COLUMN IF EXISTS verg_dist_bu,
    DROP COLUMN IF EXISTS verg_dist_bd,
    DROP COLUMN IF EXISTS verg_near_bi_blur,
    DROP COLUMN IF EXISTS verg_near_bi_break,
    DROP COLUMN IF EXISTS verg_near_bi_recovery,
    DROP COLUMN IF EXISTS verg_near_bo_blur,
    DROP COLUMN IF EXISTS verg_near_bo_break,
    DROP COLUMN IF EXISTS verg_near_bo_recovery,
    DROP COLUMN IF EXISTS verg_near_bu,
    DROP COLUMN IF EXISTS verg_near_bd;
  `);
};
