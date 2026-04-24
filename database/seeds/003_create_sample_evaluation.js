const path = require('path');
const crypto = require('crypto');
const dotenv = require(path.join(__dirname, '..', '..', 'server', 'node_modules', 'dotenv'));

dotenv.config({ path: path.join(__dirname, '..', '..', 'server', '.env') });

const ALGORITHM = 'aes-256-gcm';

function decrypt(encryptedText) {
  if (!encryptedText) return null;
  const parts = encryptedText.split(':');
  if (parts.length !== 3) return null;
  const key = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');
  const iv = Buffer.from(parts[0], 'hex');
  const authTag = Buffer.from(parts[1], 'hex');
  const encrypted = parts[2];
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

exports.seed = async function (knex) {
  console.log('\n=== Evaluation Sample Seed ===');

  // 1) Clear existing reports and evaluations (fresh slate for demo)
  console.log('Clearing existing reports and evaluations...');
  await knex('reports').del();
  await knex('evaluations').del();
  console.log('  Old data cleared.');

  // 2) Find a sample patient (Emma Rodriguez Santos — first in our seeded list)
  const patients = await knex('patients').where({ deleted_at: null });
  let targetPatient = null;
  for (const p of patients) {
    try {
      const firstName = decrypt(p.first_name_encrypted);
      if (firstName && firstName.toLowerCase() === 'emma') {
        targetPatient = p;
        break;
      }
    } catch {
      // ignore decryption errors
    }
  }

  if (!targetPatient) {
    console.log('  Warning: Emma Rodriguez Santos not found. Using first patient.');
    targetPatient = patients[0];
  }

  if (!targetPatient) {
    console.log('  No patients found. Run patient seed first. Skipping evaluation seed.');
    return;
  }

  const doctor = await knex('users').where({ role: 'doctor' }).first();
  if (!doctor) {
    console.log('  No doctor user found. Skipping evaluation seed.');
    return;
  }

  // 3) Insert a complete evaluation
  const evaluationId = crypto.randomUUID();

  await knex('evaluations').insert({
    id: evaluationId,
    patient_id: targetPatient.id,
    evaluation_date: '2026-04-22',
    status: 'complete',
    reason_for_visit: 'School counselor referral — frequent squinting while reading, headaches after homework, loses place when reading.',

    // ===== Visual Acuity =====
    va_near_method: 'snellen',
    va_near_aided_od: '20/20',
    va_near_aided_os: '20/20',
    va_near_aided_ou: '20/20',
    va_near_unaided_od: '20/25',
    va_near_unaided_os: '20/30',
    va_near_unaided_ou: '20/25',
    va_distance_method: 'snellen',
    va_distance_aided_od: '20/20',
    va_distance_aided_os: '20/20',
    va_distance_aided_ou: '20/20',
    va_distance_unaided_od: '20/30',
    va_distance_unaided_os: '20/40',
    va_distance_unaided_ou: '20/30',

    // ===== Color / Stereo / Cover Test =====
    color_vision_test: 'Ishihara',
    color_vision_result: 'Normal',
    stereo_test: 'Randot',
    stereo_result: '40',
    cover_test_distance_type: 'Ortho',
    cover_test_distance_pd: '0',
    cover_test_near_type: 'Exo',
    cover_test_near_pd: '6',

    // ===== Pursuits / Saccades / NPC / NPA / Sheards / AOA =====
    pursuits_ou: 3,
    saccades_ou: 2,
    npc_1_blur: '8',
    npc_1_break: '12',
    npc_1_recovery: '15',
    npc_2_blur: '7',
    npc_2_break: '11',
    npc_2_recovery: '14',
    npa_od: '8',
    npa_os: '8',
    sheards_od: '4',
    sheards_os: '4',
    minimum_aoa: '12.5',

    // ===== Refraction =====
    retinoscopy_od: JSON.stringify({ sphere: '+1.00', cylinder: '-0.50', axis: '90' }),
    retinoscopy_os: JSON.stringify({ sphere: '+0.75', cylinder: '-0.25', axis: '85' }),
    subjective_refraction_od: JSON.stringify({ sphere: '+0.75', cylinder: '-0.50', axis: '90' }),
    subjective_refraction_os: JSON.stringify({ sphere: '+0.50', cylinder: '-0.25', axis: '80' }),
    final_rx_od: JSON.stringify({ sphere: '+1.00', cylinder: '-0.50', axis: '90' }),
    final_rx_os: JSON.stringify({ sphere: '+0.75', cylinder: '-0.25', axis: '85' }),
    final_rx_add: '+1.00',
    post_rx_va_retinoscopy_od: '20/20',
    post_rx_va_retinoscopy_os: '20/20',
    post_rx_va_retinoscopy_ou: '20/20',
    post_rx_va_subjective_od: '20/20',
    post_rx_va_subjective_os: '20/20',
    post_rx_va_subjective_ou: '20/20',
    post_rx_va_final_od: '20/20',
    post_rx_va_final_os: '20/20',
    post_rx_va_final_ou: '20/20',

    // ===== Phorias =====
    phoria_distance_h_type: 'Ortho',
    phoria_distance_h_amount: '0',
    phoria_distance_v_type: 'Ortho',
    phoria_distance_v_amount: '0',
    phoria_near_h_type: 'Exo',
    phoria_near_h_amount: '6',
    phoria_near_v_type: 'Ortho',
    phoria_near_v_amount: '0',

    // ===== Vergences =====
    verg_dist_bi_blur: '10',
    verg_dist_bi_break: '14',
    verg_dist_bi_recovery: '8',
    verg_dist_bo_blur: '8',
    verg_dist_bo_break: '18',
    verg_dist_bo_recovery: '12',
    verg_dist_bu: '2',
    verg_dist_bd: '2',
    verg_near_bi_blur: '12',
    verg_near_bi_break: '18',
    verg_near_bi_recovery: '10',
    verg_near_bo_blur: '14',
    verg_near_bo_break: '22',
    verg_near_bo_recovery: '16',
    verg_near_bu: '3',
    verg_near_bd: '2',

    // ===== Ocular Health External =====
    ext_lids_lash_od: 'Healthy',
    ext_lids_lash_os: 'Healthy',
    ext_conj_od: 'Clear',
    ext_conj_os: 'Clear',
    ext_cornea_od: 'Clear',
    ext_cornea_os: 'Clear',
    ext_iris_od: 'Healthy',
    ext_iris_os: 'Healthy',
    angles_od: 'Grade 2 x Grade 3',
    angles_os: 'Grade 3 x Grade 4',
    ext_pupils_od: 'PERRLA',
    ext_pupils_os: 'PERRLA',

    // ===== Ocular Health Internal =====
    int_lens_od: 'Clear',
    int_lens_os: 'Clear',
    int_media_od: 'Clear',
    int_media_os: 'Clear',
    int_cd_od: '0.3',
    int_cd_os: '0.3',
    int_av_od: '2:3',
    int_av_os: '2:3',
    int_macula_fr_od: 'Flat, good reflex',
    int_macula_fr_os: 'Flat, good reflex',

    // ===== RightEye =====
    righteye_global_score: 62,
    righteye_tracking_score: 58,
    righteye_saccadic_score: 65,
    righteye_fixation_score: 70,
    reading_eyeq_wpm: 31,
    reading_eyeq_grade_level: '1st grade',

    // ===== Garner Reversal =====
    garner_unknown_errors: 2,
    garner_unknown_mean: 0.5,
    garner_unknown_sd: 1.0,
    garner_reversed_errors: 6,
    garner_reversed_mean: 2.1,
    garner_reversed_sd: 1.5,
    garner_recognition_errors: 3,
    garner_recognition_mean: 1.8,
    garner_recognition_sd: 1.2,

    // ===== Beery VMI =====
    vmi_raw_score: 18,
    vmi_chronological_age: '9y 10m',
    vmi_perceptual_age: '7y 6m',
    vmi_standard_score: 85,
    vmi_percentile: 16,

    // ===== Visual Perception =====
    vp_raw_score: 15,
    vp_chronological_age: '9y 10m',
    vp_perceptual_age: '7y 2m',
    vp_standard_score: 80,
    vp_percentile: 9,

    // ===== Assessment & Plan =====
    assessment_notes: 'Patient presents with oculomotor dysfunction, accommodative insufficiency, and convergence insufficiency. Visual-motor integration and visual perception are below expected for chronological age. Significant impact on academic performance observed. Therapeutic intervention strongly recommended.',
    diagnoses: JSON.stringify([
      { code: 'H55.81', name: 'Oculomotor Dysfunction', active: true },
      { code: 'H52.533', name: 'Accommodative Insufficiency', active: true },
      { code: 'H51.11', name: 'Convergence Insufficiency', active: true },
      { code: 'H52.03', name: 'Hyperopia', active: true },
      { code: 'H52.23', name: 'Astigmatism', active: true }
    ]),
    plan_rx_od: JSON.stringify({ sphere: '+1.00', cylinder: '-0.50', axis: '90' }),
    plan_rx_os: JSON.stringify({ sphere: '+0.75', cylinder: '-0.25', axis: '85' }),
    plan_rx_add: '+1.00',
    plan_rx_lens_type: 'Single Vision',
    recommendations: JSON.stringify([
      { key: 'visionTherapy', included: true },
      { key: 'therapeuticGlasses', included: true },
      { key: 'reEvaluation', included: true },
      { key: 'homotherapy', included: true }
    ]),

    // ===== Metadata =====
    created_by: doctor.id,
    updated_by: doctor.id,
    created_at: new Date(),
    updated_at: new Date()
  });

  console.log(`  Created sample evaluation for patient ID: ${targetPatient.id}`);
  console.log(`  Evaluation ID: ${evaluationId}`);
  console.log(`  Status: complete (ready to generate report)`);
  console.log('\n=== Sample Evaluation Seeded Successfully ===\n');
};
