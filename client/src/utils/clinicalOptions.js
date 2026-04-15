// Visual Acuity Snellen values
export const VA_OPTIONS = [
  '20/10', '20/15', '20/20', '20/25', '20/30', '20/40', '20/50',
  '20/60', '20/70', '20/80', '20/100', '20/125', '20/150', '20/200',
  '20/300', '20/400', 'CF', 'HM', 'LP', 'NLP'
];

// Color Vision
export const COLOR_VISION_OPTIONS = ['Normal', 'Abnormal', 'Deficient - Red/Green', 'Deficient - Blue/Yellow'];

// Stereo (arc seconds)
export const STEREO_OPTIONS = ['20', '25', '30', '40', '50', '60', '80', '100', '140', '200', '400', '800', 'None'];

// Cover Test
export const COVER_TEST_OPTIONS = ['Ortho', 'Eso', 'Exo', 'Hyper OD', 'Hyper OS', 'Intermittent Eso', 'Intermittent Exo', 'Alternating'];

// Pursuits / Saccades ratings
export const MOVEMENT_RATINGS = [4, 3, 2, 1];

// NPC / NPA / Sheard's - no dropdown needed, these are measurements

// Phoria directions
export const PHORIA_H_OPTIONS = ['Ortho', 'Eso', 'Exo'];
export const PHORIA_V_OPTIONS = ['Ortho', 'Hyper OD', 'Hyper OS'];

// Ocular Health - External structures
export const EXT_LIDS_OPTIONS = ['Healthy', 'WNL', 'Blepharitis', 'Chalazion', 'Hordeolum', 'Ptosis', 'Dermatochalasis', 'Ectropion', 'Entropion', 'Trichiasis', 'Edema', 'Papillae'];
export const EXT_CONJ_OPTIONS = ['Healthy', 'WNL', 'Clear', 'Papillae', 'Pinguecula', 'Pterygium', 'Injection', 'Chemosis', 'Follicles', 'Hemorrhage', 'D&Q'];
export const EXT_CORNEA_OPTIONS = ['Clear', 'WNL', 'SPK', 'Abrasion', 'Infiltrate', 'Scar', 'Dystrophy', 'Edema', 'Neovascularization', 'Arcus', 'Dry'];
export const EXT_IRIS_OPTIONS = ['Healthy', 'WNL', 'Flat', 'Normal', 'Nevus', 'Atrophy', 'Rubeosis', 'Synechiae'];
export const EXT_ANGLES_OPTIONS = [
  'Open',
  'Grade 1',
  'Grade 1 x Grade 2',
  'Grade 2',
  'Grade 2 x Grade 3',
  'Grade 3',
  'Grade 3 x Grade 4',
  'Grade 4',
  'Narrow',
  'Closed'
];
export const EXT_PUPILS_OPTIONS = ['PERRLA', 'Equal', 'Unequal', 'Sluggish', 'Fixed', 'APD OD', 'APD OS', 'Irregular'];

// Ocular Health - Internal structures
export const INT_LENS_OPTIONS = ['Clear', 'WNL', 'NS 1', 'NS 2', 'NS 3', 'NS 4', 'PSC 1', 'PSC 2', 'Cortical', 'IOL', 'Aphakia'];
export const INT_MEDIA_OPTIONS = ['Clear', 'WNL', 'Floaters', 'Vitreous Haze', 'Vitreous Detachment', 'Hemorrhage'];
export const INT_CD_OPTIONS = ['0.1', '0.15', '0.2', '0.25', '0.3', '0.35', '0.4', '0.45', '0.5', '0.55', '0.6', '0.65', '0.7', '0.75', '0.8', '0.85', '0.9'];
export const INT_AV_OPTIONS = ['2:3', '3:4', '1:1', 'Healthy', 'WNL', 'Pallor', 'Edema', 'Cupping', 'Drusen', 'Tilted'];
export const INT_MACULA_OPTIONS = ['Flat', 'Healthy', 'WNL', 'Flat, good reflex', 'Drusen', 'RPE changes', 'Edema', 'Hemorrhage', 'Scar', 'ARMD dry', 'ARMD wet', 'Epiretinal membrane'];

// Lens type options (for Final Rx)
export const LENS_TYPE_OPTIONS = [
  'Single Vision', 'No Line Bifocal', 'Progressive', 'Progressive Digital',
  'FT-28', 'FT-35', 'FT-45', 'Trifocal 7x28', 'Executive',
  'Eyezen 1', 'Eyezen 2', 'Eyezen 3', 'Eyezen 4',
  'Blended', 'Round Seg', 'Computer Lens'
];

// ICD-10 Ophthalmology codes - comprehensive list
export const ICD10_CODES = [
  // Functional Vision (primary for this clinic)
  { code: 'H55.81', name: 'Oculomotor Dysfunction' },
  { code: 'H52.533', name: 'Accommodative Insufficiency' },
  { code: 'H52.523', name: 'Accommodative Excess' },
  { code: 'H52.513', name: 'Accommodative Infacility' },
  { code: 'H51.11', name: 'Convergence Insufficiency' },
  { code: 'H51.12', name: 'Convergence Excess' },
  { code: 'H51.0', name: 'Palsy of Conjugate Gaze' },
  { code: 'H55.89', name: 'Other Irregular Eye Movements' },

  // Refractive
  { code: 'H52.03', name: 'Hypermetropia, bilateral' },
  { code: 'H52.01', name: 'Hypermetropia, right eye' },
  { code: 'H52.02', name: 'Hypermetropia, left eye' },
  { code: 'H52.13', name: 'Myopia, bilateral' },
  { code: 'H52.11', name: 'Myopia, right eye' },
  { code: 'H52.12', name: 'Myopia, left eye' },
  { code: 'H52.23', name: 'Astigmatism, bilateral' },
  { code: 'H52.21', name: 'Astigmatism, right eye' },
  { code: 'H52.22', name: 'Astigmatism, left eye' },
  { code: 'H52.33', name: 'Anisometropia' },
  { code: 'H52.4', name: 'Presbyopia' },
  { code: 'H52.7', name: 'Unspecified Disorder of Refraction' },

  // Strabismus
  { code: 'H50.00', name: 'Unspecified Esotropia' },
  { code: 'H50.10', name: 'Unspecified Exotropia' },
  { code: 'H50.30', name: 'Unspecified Intermittent Heterotropia' },
  { code: 'H50.40', name: 'Other Heterotropia' },
  { code: 'H50.9', name: 'Unspecified Strabismus' },

  // Amblyopia
  { code: 'H53.001', name: 'Amblyopia, right eye' },
  { code: 'H53.002', name: 'Amblyopia, left eye' },
  { code: 'H53.003', name: 'Amblyopia, bilateral' },
  { code: 'H53.031', name: 'Strabismic Amblyopia, right eye' },
  { code: 'H53.032', name: 'Strabismic Amblyopia, left eye' },

  // Conjunctivitis
  { code: 'H10.10', name: 'Acute Atopic Conjunctivitis' },
  { code: 'H10.45', name: 'Other Chronic Allergic Conjunctivitis' },
  { code: 'H10.9', name: 'Unspecified Conjunctivitis' },
  { code: 'H11.00', name: 'Unspecified Pterygium' },
  { code: 'H11.059', name: 'Pinguecula, unspecified eye' },

  // Cornea
  { code: 'H16.009', name: 'Corneal Ulcer, unspecified' },
  { code: 'H18.60', name: 'Keratoconus, unspecified' },

  // Cataracts
  { code: 'H25.011', name: 'Cortical Age-Related Cataract, right' },
  { code: 'H25.012', name: 'Cortical Age-Related Cataract, left' },
  { code: 'H25.013', name: 'Cortical Age-Related Cataract, bilateral' },
  { code: 'H25.041', name: 'Posterior Subcapsular Polar Cataract, right' },
  { code: 'H25.042', name: 'Posterior Subcapsular Polar Cataract, left' },
  { code: 'H25.10', name: 'Age-Related Nuclear Cataract' },
  { code: 'H26.9', name: 'Unspecified Cataract' },

  // Glaucoma
  { code: 'H40.10', name: 'Unspecified Open-Angle Glaucoma' },
  { code: 'H40.11', name: 'Primary Open-Angle Glaucoma' },
  { code: 'H40.20', name: 'Unspecified Angle-Closure Glaucoma' },
  { code: 'H40.051', name: 'Ocular Hypertension, right' },
  { code: 'H40.052', name: 'Ocular Hypertension, left' },
  { code: 'H40.053', name: 'Ocular Hypertension, bilateral' },

  // Retina
  { code: 'H35.30', name: 'Unspecified Macular Degeneration' },
  { code: 'H35.3110', name: 'Early Dry ARMD, right' },
  { code: 'H35.3120', name: 'Early Dry ARMD, left' },
  { code: 'H35.3210', name: 'Exudative (Wet) ARMD, right' },
  { code: 'H35.3220', name: 'Exudative (Wet) ARMD, left' },
  { code: 'H33.001', name: 'Retinal Detachment, right' },
  { code: 'H33.002', name: 'Retinal Detachment, left' },

  // Diabetic Retinopathy
  { code: 'E11.319', name: 'Type 2 DM with Unspecified Diabetic Retinopathy without Macular Edema' },
  { code: 'E11.3211', name: 'Type 2 DM with Mild NPDR, right' },
  { code: 'E11.3212', name: 'Type 2 DM with Mild NPDR, left' },

  // Dry Eye
  { code: 'H04.121', name: 'Dry Eye Syndrome, right' },
  { code: 'H04.122', name: 'Dry Eye Syndrome, left' },
  { code: 'H04.123', name: 'Dry Eye Syndrome, bilateral' },

  // Other
  { code: 'H53.2', name: 'Diplopia' },
  { code: 'H53.14', name: 'Visual Discomfort' },
  { code: 'H57.10', name: 'Ocular Pain, unspecified eye' },
  { code: 'G43.909', name: 'Migraine, unspecified' },
  { code: 'R51.9', name: 'Headache' },
  { code: 'F90.9', name: 'ADHD, unspecified type' },
  { code: 'F81.0', name: 'Specific Reading Disorder (Dyslexia)' },
  { code: 'Z01.00', name: 'Encounter for Eye Examination' },
  { code: 'Z01.01', name: 'Encounter for Eye Exam with Abnormal Findings' }
];

// Recommendation options
export const RECOMMENDATION_OPTIONS = [
  { key: 'visionTherapy', label: 'Functional Vision Therapy (1 weekly session, 60 min)' },
  { key: 'therapeuticGlasses', label: 'Therapeutic Glasses (continuous use)' },
  { key: 'reEvaluation', label: 'Re-evaluation' },
  { key: 'referralNeuro', label: 'Referral to Neurologist' },
  { key: 'referralPediatric', label: 'Referral to Pediatrician' },
  { key: 'referralPsych', label: 'Referral to Psychologist' },
  { key: 'referralOT', label: 'Referral to Occupational Therapist' },
  { key: 'referralSLP', label: 'Referral to Speech-Language Pathologist' },
  { key: 'computerGlasses', label: 'Computer Glasses' },
  { key: 'contactLenses', label: 'Contact Lenses' },
  { key: 'sunglasses', label: 'Prescription Sunglasses' },
  { key: 'homotherapy', label: 'Home Vision Therapy Exercises' }
];
