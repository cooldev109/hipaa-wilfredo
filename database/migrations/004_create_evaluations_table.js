exports.up = function (knex) {
  return knex.raw(`
    CREATE TABLE evaluations (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      patient_id UUID NOT NULL REFERENCES patients(id),
      evaluation_date DATE NOT NULL,
      status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'complete', 'signed')),
      reason_for_visit TEXT,

      -- Visual Acuity Near
      va_near_aided_od VARCHAR(10),
      va_near_aided_os VARCHAR(10),
      va_near_aided_ou VARCHAR(10),
      va_near_unaided_od VARCHAR(10),
      va_near_unaided_os VARCHAR(10),
      va_near_unaided_ou VARCHAR(10),
      va_near_method VARCHAR(20),

      -- Visual Acuity Distance
      va_distance_aided_od VARCHAR(10),
      va_distance_aided_os VARCHAR(10),
      va_distance_aided_ou VARCHAR(10),
      va_distance_unaided_od VARCHAR(10),
      va_distance_unaided_os VARCHAR(10),
      va_distance_unaided_ou VARCHAR(10),
      va_distance_method VARCHAR(20),

      -- Color Vision & Stereo
      color_vision_test VARCHAR(50),
      color_vision_result VARCHAR(100),
      stereo_test VARCHAR(50),
      stereo_result VARCHAR(100),

      -- Cover Test
      cover_test_distance TEXT,
      cover_test_near TEXT,

      -- Pursuits & Saccades
      pursuits_ou INTEGER CHECK (pursuits_ou BETWEEN 1 AND 4),
      saccades_ou INTEGER CHECK (saccades_ou BETWEEN 1 AND 4),

      -- NPC
      npc_1_blur VARCHAR(20),
      npc_1_break VARCHAR(20),
      npc_1_recovery VARCHAR(20),
      npc_2_blur VARCHAR(20),
      npc_2_break VARCHAR(20),
      npc_2_recovery VARCHAR(20),

      -- NPA & Sheard's
      npa_od VARCHAR(20),
      npa_os VARCHAR(20),
      sheards_od VARCHAR(20),
      sheards_os VARCHAR(20),
      minimum_aoa VARCHAR(20),

      -- Refraction: Retinoscopy
      retinoscopy_od TEXT,
      retinoscopy_os TEXT,

      -- Refraction: Subjective
      subjective_refraction_od TEXT,
      subjective_refraction_os TEXT,

      -- Refraction: Final Prescription
      final_rx_od TEXT,
      final_rx_os TEXT,
      final_rx_add VARCHAR(20),

      -- Post-Refraction VA
      post_rx_va_retinoscopy_od VARCHAR(10),
      post_rx_va_retinoscopy_os VARCHAR(10),
      post_rx_va_retinoscopy_ou VARCHAR(10),
      post_rx_va_subjective_od VARCHAR(10),
      post_rx_va_subjective_os VARCHAR(10),
      post_rx_va_subjective_ou VARCHAR(10),
      post_rx_va_final_od VARCHAR(10),
      post_rx_va_final_os VARCHAR(10),
      post_rx_va_final_ou VARCHAR(10),

      -- Phorias
      phoria_distance_h VARCHAR(30),
      phoria_distance_v VARCHAR(30),
      phoria_near_h VARCHAR(30),
      phoria_near_v VARCHAR(30),

      -- Vergences
      vergence_distance_bi TEXT,
      vergence_distance_bo TEXT,
      vergence_distance_bu VARCHAR(20),
      vergence_distance_bd VARCHAR(20),
      vergence_near_bi TEXT,
      vergence_near_bo TEXT,
      vergence_near_bu VARCHAR(20),
      vergence_near_bd VARCHAR(20),

      -- Ocular Health: External
      ext_lids_lash_od VARCHAR(100),
      ext_lids_lash_os VARCHAR(100),
      ext_conj_od VARCHAR(100),
      ext_conj_os VARCHAR(100),
      ext_cornea_od VARCHAR(100),
      ext_cornea_os VARCHAR(100),
      ext_iris_od VARCHAR(100),
      ext_iris_os VARCHAR(100),
      ext_angles_od JSONB,
      ext_angles_os JSONB,
      ext_pupils_od VARCHAR(100),
      ext_pupils_os VARCHAR(100),

      -- Ocular Health: Internal
      int_lens_od VARCHAR(100),
      int_lens_os VARCHAR(100),
      int_media_od VARCHAR(100),
      int_media_os VARCHAR(100),
      int_cd_od VARCHAR(20),
      int_cd_os VARCHAR(20),
      int_av_od VARCHAR(100),
      int_av_os VARCHAR(100),
      int_macula_fr_od VARCHAR(100),
      int_macula_fr_os VARCHAR(100),

      -- RightEye Test
      righteye_global_score DECIMAL(5,2),
      righteye_tracking_score DECIMAL(5,2),
      righteye_saccadic_score DECIMAL(5,2),
      righteye_fixation_score DECIMAL(5,2),

      -- Garner Reversal Test
      garner_unknown_errors INTEGER,
      garner_unknown_mean DECIMAL(5,2),
      garner_unknown_sd DECIMAL(5,2),
      garner_reversed_errors INTEGER,
      garner_reversed_mean DECIMAL(5,2),
      garner_reversed_sd DECIMAL(5,2),
      garner_recognition_errors INTEGER,
      garner_recognition_mean DECIMAL(5,2),

      -- Beery VMI
      vmi_raw_score INTEGER,
      vmi_chronological_age VARCHAR(20),
      vmi_perceptual_age VARCHAR(20),
      vmi_standard_score INTEGER,
      vmi_percentile INTEGER,

      -- Visual Perception
      vp_raw_score INTEGER,
      vp_chronological_age VARCHAR(20),
      vp_perceptual_age VARCHAR(20),
      vp_standard_score INTEGER,
      vp_percentile INTEGER,

      -- Assessment & Plan
      assessment_notes TEXT,
      diagnoses JSONB DEFAULT '[]',
      plan_rx_od TEXT,
      plan_rx_os TEXT,
      plan_rx_add VARCHAR(20),
      recommendations JSONB DEFAULT '[]',

      -- Metadata
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW(),
      created_by UUID NOT NULL REFERENCES users(id),
      updated_by UUID REFERENCES users(id),
      deleted_at TIMESTAMP,
      last_auto_saved_at TIMESTAMP
    );

    CREATE INDEX idx_evaluations_patient_id ON evaluations(patient_id);
    CREATE INDEX idx_evaluations_status ON evaluations(status);
    CREATE INDEX idx_evaluations_created_by ON evaluations(created_by);
    CREATE INDEX idx_evaluations_deleted_at ON evaluations(deleted_at);
    CREATE INDEX idx_evaluations_date ON evaluations(evaluation_date);
  `);
};

exports.down = function (knex) {
  return knex.raw('DROP TABLE IF EXISTS evaluations;');
};
