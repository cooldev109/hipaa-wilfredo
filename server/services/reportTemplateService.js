/**
 * Report Template Service — English
 *
 * Assembles narrative report blocks from evaluation data.
 * All content in English. Matches the DOCX template structure.
 * From Neuronita - Neuro-Cognitive Rehabilitation Clinic
 */

const dayjs = require('dayjs');

function calculateAge(dob) {
  const d = dayjs(dob);
  const now = dayjs();
  const years = now.diff(d, 'year');
  const months = now.diff(d, 'month') % 12;
  return { years, months };
}

function formatDate(date) {
  return dayjs(date).format('MMMM D, YYYY');
}

function formatRx(rxData) {
  if (!rxData) return '—';
  if (typeof rxData === 'string') {
    try { rxData = JSON.parse(rxData); } catch { return rxData; }
  }
  const parts = [];
  if (rxData.sphere) parts.push(`${rxData.sphere > 0 ? '+' : ''}${rxData.sphere}`);
  if (rxData.cylinder) parts.push(`${rxData.cylinder > 0 ? '+' : ''}${rxData.cylinder}`);
  if (rxData.axis) parts.push(`x${rxData.axis}`);
  return parts.join(' ') || '—';
}

// ============================================
// ALWAYS-INCLUDED BLOCKS
// ============================================

function headerBlock(patient, evaluation) {
  return `
    <div class="header">
      <div class="header-left">
        <strong>Aquamarina 10</strong><br>
        Urb. Villa Blanca<br>
        Caguas PR 00725
      </div>
      <div class="header-center">
        <h1 class="clinic-name">NEURONITA</h1>
        <p class="clinic-sub">Neuro-Cognitive Rehabilitation Clinic</p>
      </div>
      <div class="header-right">
        Tel. 787-407-4814<br>
        Fax. 787-258-8225<br>
        clinicarehabilitacion10@gmail.com
      </div>
    </div>
    <h2 class="report-title">Functional Vision Evaluation Report</h2>
  `;
}

function patientInfoBlock(patient, evaluation) {
  const age = calculateAge(patient.dateOfBirth);
  return `
    <div class="section">
      <table class="info-table">
        <tr><td><strong>Patient:</strong></td><td>${patient.firstName} ${patient.lastName}</td></tr>
        <tr><td><strong>Evaluation Date:</strong></td><td>${formatDate(evaluation.evaluationDate)}</td></tr>
        <tr><td><strong>Date of Birth:</strong></td><td>${formatDate(patient.dateOfBirth)}</td></tr>
        <tr><td><strong>Chronological Age:</strong></td><td>${age.years} years, ${age.months} months</td></tr>
        <tr><td><strong>School:</strong></td><td>${patient.school || '—'}</td></tr>
        <tr><td><strong>Grade:</strong></td><td>${patient.grade || '—'}</td></tr>
      </table>
    </div>
  `;
}

function reasonForVisitBlock(patient) {
  return `
    <div class="section">
      <h3>Reason for Visit</h3>
      <p>The patient visits us to determine whether any problem in the functioning of their eyes is making learning to read, write, or concentrate more difficult than normal.</p>
    </div>
  `;
}

function historyBlock(patient, evaluation, history) {
  if (!history) return '';
  const therapyLabels = {
    occupational: 'Occupational Therapy (OT)',
    occupationalSensory: 'Sensory OT (SOT)',
    speech: 'Speech & Language (SLP)',
    physical: 'Physical Therapy (PT)',
    educational: 'Educational Therapy (ET)',
    psychological: 'Psychological (PSY)',
    functionalVision: 'Functional Vision (FV)'
  };

  const activeTherapies = history.therapies
    ? Object.entries(history.therapies).filter(([, v]) => v).map(([k]) => therapyLabels[k] || k)
    : [];

  return `
    <div class="section">
      <h3>PATIENT HISTORY</h3>
      <p><strong>Visual History:</strong> ${history.visualHistory || '—'}</p>
      <p><strong>Medical History:</strong> ${history.medicalHistory || '—'}</p>
      <p><strong>Medications:</strong> ${history.medications || '—'}</p>
      <p><strong>Motor Development:</strong> The patient's early physical development provides clues about their visual development. Born at ${history.developmentalBirthWeeks || '___'} weeks via ${history.developmentalBirthType === 'cesarean' ? 'cesarean section' : 'natural delivery'}. Started crawling at ${history.developmentalCrawledMonths || '___'} months, walking at ${history.developmentalWalkedMonths || '___'} months, and first words at ${history.developmentalTalkedMonths || '___'} months.</p>
      ${activeTherapies.length > 0 ? `<p><strong>Specialized Services:</strong> ${activeTherapies.join(', ')}</p>` : ''}
      <p><strong>Family Ocular History:</strong> ${history.familyOcularHistory || '—'}</p>
      <p><strong>Family Medical History:</strong> ${history.familyMedicalHistory || '—'}</p>
    </div>
  `;
}

function testsPerformedBlock() {
  return `
    <div class="section">
      <h3>Tests Performed</h3>
      <p>We evaluate much more than just "seeing small letters." We analyze how the brain and eyes work as a team.</p>
      <ul>
        <li>Ocular Health (Physical eye examination)</li>
        <li>Color Vision</li>
        <li>Visual Acuity (How clearly the patient sees at distance and near)</li>
        <li>Refraction (Whether glasses are needed)</li>
        <li>Eye Movement Evaluation (How the eyes move when tracking objects)</li>
        <li>RightEye Test (How the eyes move during reading)</li>
        <li>Focusing Ability (How the eyes shift focus from board to paper)</li>
        <li>Binocularity (How both eyes work together as a team)</li>
        <li>Depth Perception (3D vision)</li>
        <li>Fusion Test (Seeing a single image with both eyes)</li>
        <li>Letter/Number Reversal (Confusion of letters such as 'b' and 'd')</li>
        <li>Visual-Motor Integration (Eye-hand coordination)</li>
        <li>Visual Perception (How the brain interprets what the eyes see)</li>
      </ul>
    </div>
  `;
}

function ocularHealthBlock(patient, evaluation) {
  return `
    <div class="section">
      <h3>OCULAR HEALTH</h3>
      <p>The eyes of ${patient.firstName}, ocular tissue, and related structures are healthy and free of disease.</p>
      <p><strong>Color Vision:</strong> ${evaluation.colorVisionResult || 'Normal'}.</p>
    </div>
  `;
}

function visualAcuityBlock(patient, evaluation) {
  return `
    <div class="section">
      <h3>VISUAL ACUITY</h3>
      <p>(Clarity of vision) Saying someone has "20/20" vision only means they can see small letters from a distance. However, this does not tell us if the child has to make an enormous effort to see them, or if their eyes tire quickly while reading.</p>
      <table class="data-table">
        <thead>
          <tr><th>Visual Acuity</th><th>Eye</th><th>Unaided</th><th>Aided</th></tr>
        </thead>
        <tbody>
          <tr><td rowspan="2">Distance</td><td>OD</td><td>${evaluation.vaDistanceUnaidedOd || '—'}</td><td>${evaluation.vaDistanceAidedOd || '—'}</td></tr>
          <tr><td>OS</td><td>${evaluation.vaDistanceUnaidedOs || '—'}</td><td>${evaluation.vaDistanceAidedOs || '—'}</td></tr>
          <tr><td rowspan="2">Near</td><td>OD</td><td>${evaluation.vaNearUnaidedOd || '—'}</td><td>${evaluation.vaNearAidedOd || '—'}</td></tr>
          <tr><td>OS</td><td>${evaluation.vaNearUnaidedOs || '—'}</td><td>${evaluation.vaNearAidedOs || '—'}</td></tr>
        </tbody>
      </table>
    </div>
  `;
}

// NEW: VA finding narrative
function vaFindingBlock(patient, evaluation) {
  const hasReduced = (v) => {
    if (!v) return false;
    const parts = String(v).split('/');
    const denom = parseInt(parts[1] || parts[0], 10);
    return Number.isFinite(denom) && denom > 20;
  };
  const distReduced = hasReduced(evaluation.vaDistanceUnaidedOd) || hasReduced(evaluation.vaDistanceUnaidedOs);
  const nearReduced = hasReduced(evaluation.vaNearUnaidedOd) || hasReduced(evaluation.vaNearUnaidedOs);

  let finding = 'within normal limits at distance and near';
  if (distReduced && nearReduced) finding = 'slightly reduced at distance and near without correction';
  else if (distReduced) finding = 'slightly reduced at distance without correction';
  else if (nearReduced) finding = 'slightly reduced at near without correction';

  return `
    <div class="section">
      <p>The Visual Acuity of ${patient.firstName} was found to be: <strong>${finding}</strong>.</p>
    </div>
  `;
}

// ============================================
// CONDITIONAL BLOCKS — Refractive State
// ============================================

function refractiveStateIntroBlock(patient) {
  return `
    <div class="section">
      <h3>REFRACTIVE STATE</h3>
      <p>This is influenced by the development of vision, adaptation to environmental "stress," and hereditary factors. We found that the patient has:</p>
    </div>
  `;
}

function refractiveHyperopiaBlock(patient) {
  return `
    <div class="section">
      <p><strong>Hyperopia:</strong> This means the eyes have to make extra effort to see up close (such as when reading a book or using a tablet).</p>
    </div>
  `;
}

function refractiveMyopiaBlock(patient) {
  return `
    <div class="section">
      <p><strong>Myopia:</strong> This means the eyes have to make extra effort to see at distance. The child sees well up close, but distant objects like the board or television appear blurry.</p>
    </div>
  `;
}

function refractiveAstigmatismBlock(patient) {
  return `
    <div class="section">
      <p><strong>Astigmatism:</strong> The front "window" of the eye is not perfectly round. This causes images to appear slightly stretched, distorted, or with "shadows," both at distance and near.</p>
    </div>
  `;
}

// ============================================
// CONDITIONAL BLOCKS — Oculomotor
// ============================================

function oculomotorControlBlock(patient, evaluation) {
  return `
    <div class="section">
      <h3>OCULOMOTOR CONTROL</h3>
      <p>Oculomotor control requires the highest level of motor precision in humans. To change the point of fixation, or maintain fixation on a moving object, the eyes must move precisely and simultaneously. This requires a high degree of coordination of the eye muscles individually and together. Well-integrated eye movements allow for rapid and precise shifting of the eyes while reading, as well as efficient changes in focus from distance to near.</p>
      <p>The oculomotor analysis of ${patient.firstName} shows that the ability to track a moving object with precision is below the level necessary to maintain maximum academic performance. The quality of eye movement decreases over time. Additionally, precision was significantly reduced when a cognitive demand was presented while continuing to visually track an object.</p>
    </div>
  `;
}

function rightEyeResultsBlock(patient, evaluation) {
  return `
    <div class="section">
      <h3>READING EYE MOVEMENT EVALUATION (RightEye)</h3>
      <p>The RightEye test evaluates the quality of small-amplitude saccadic movements (those used during reading), tracking movements, and visual fixations.</p>
      <table class="data-table">
        <thead><tr><th>Eye Movement</th><th>Score Obtained</th><th>Expected Score</th></tr></thead>
        <tbody>
          <tr><td>Tracking</td><td>${evaluation.righteyeTrackingScore || '—'}</td><td>&gt;75</td></tr>
          <tr><td>Saccadic</td><td>${evaluation.righteyeSaccadicScore || '—'}</td><td>&gt;75</td></tr>
          <tr><td>Fixation</td><td>${evaluation.righteyeFixationScore || '—'}</td><td>&gt;75</td></tr>
        </tbody>
      </table>
      <p>${patient.firstName} obtained a Global score of <strong>${evaluation.righteyeGlobalScore || '—'}</strong>, where the expected score is greater than 75.</p>
      <p>These results indicate a diagnosis of <strong>OCULOMOTOR DYSFUNCTION</strong>. Specifically, saccadic dysfunctions will cause loss of place while reading, skipping words, and increased difficulty when copying from the board. Additionally, poor eye movement will make sports and activities involving movement more difficult. Your child struggles to follow moving objects. Their eyes tire quickly and lose precision, especially when they have to think and look at the same time (as happens in school).</p>
    </div>
  `;
}

// ============================================
// CONDITIONAL BLOCKS — Accommodation
// ============================================

function accommodationBlock(patient) {
  return `
    <div class="section">
      <h3>ACCOMMODATION (FOCUSING ABILITY)</h3>
      <p>Academic and athletic performance depends on the ability to focus the eyes quickly and automatically, regardless of the working distance. Activities such as reading and writing require the ability to sustain prolonged near accommodation. Copying from one place to another requires a rapid and efficient accommodative focus change. Visual focus is also related to the ability to maintain visual attention.</p>
      <p>During the accommodative evaluation, ${patient.firstName} demonstrated difficulty maintaining focus.</p>
      <p><strong>Accommodative Difficulty</strong> (The "auto-focus" of the eyes is slow or difficult to maintain).</p>
      <p><strong>How does it affect school?</strong> It causes visual fatigue, headaches during homework, makes letters appear blurry after a while, and reduces reading comprehension because too much energy is spent just trying to see clearly.</p>
    </div>
  `;
}

// ============================================
// CONDITIONAL BLOCKS — Binocular
// ============================================

function convergenceInsufficiencyBlock(patient) {
  return `
    <div class="section">
      <h3>BINOCULAR INTEGRATION</h3>
      <p>The human visual system is designed so that the eyes and their respective muscles work together with such high precision that the two eyes function as if they were one. "For us to see a single clear image, our two eyes have to work as a perfect team. Imagine that your child's eyes are two flashlights. When looking at the board, the flashlights point straight ahead. But when looking up close, such as reading a book, both flashlights need to turn inward to illuminate exactly the same word at the same time. This inward movement is called convergence."</p>
      <p>${patient.firstName} presents <strong>Convergence Insufficiency</strong> — the eyes struggle greatly to maintain the inward turn needed for reading.</p>
      <p><strong>The flashlight analogy:</strong> It's as if the flashlight batteries are weak. They try to point together at the word, but they get tired and one (or both) tends to open or drift outward.</p>
      <p><strong>How your child feels it:</strong> Imagine trying to hold a heavy object with arms extended. At first you can do it, but after a few minutes your arms shake and drop. That's how the eye muscles feel. After reading for a while, the child gets tired, headaches develop, they lose their place, or letters appear to "dance" or double. They give up because the effort is too much.</p>
    </div>
  `;
}

function convergenceExcessBlock(patient) {
  return `
    <div class="section">
      <p>${patient.firstName} presents <strong>Convergence Excess</strong> (When the team overworks).</p>
      <p><strong>Simple explanation:</strong> When looking at the notebook, instead of aiming precisely at the page, the eye muscles turn inward too much.</p>
      <p><strong>The flashlight analogy:</strong> The flashlights are pointing with too much force toward the center and the light crosses in the air before reaching the book. It's as if the "braking" system of the eyes isn't working properly.</p>
      <p><strong>How your child feels it:</strong> The child has to make an immense and uncomfortable effort to "push" their eyes back outward and focus on the paper. This causes significant visual tension. You may notice the child getting too close to the paper when writing to try to compensate for the crossing, or constantly rubbing their eyes because the muscles are tense and working overtime.</p>
    </div>
  `;
}

// ============================================
// CONDITIONAL BLOCKS — Depth & Fusion
// ============================================

function depthPerceptionBlock(patient, evaluation) {
  return `
    <div class="section">
      <h3>DEPTH PERCEPTION</h3>
      <p>Depth perception is the ability to see things in three dimensions (including length, width, and depth), and to judge the distance of an object. Good depth perception generally requires binocular vision (seeing with both eyes). When both eyes see clearly, the brain efficiently processes the data to produce a single image, and we perceive what is known as stereopsis or three-dimensional vision.</p>
      <p>${patient.firstName} presents reduced depth perception of <strong>${evaluation.stereoResult || '—'} arc seconds</strong>.</p>
    </div>
  `;
}

function fusionTestBlock(patient, evaluation) {
  return `
    <div class="section">
      <h3>FUSION TEST</h3>
      <p>The fusion test evaluates the ability to combine the images from both eyes into a single, clear image. This skill is fundamental for comfortable and efficient binocular vision. Difficulty with fusion can contribute to double vision, eye strain, and reading difficulties.</p>
    </div>
  `;
}

// ============================================
// CONDITIONAL BLOCKS — Perceptual Tests
// ============================================

function garnerReversalBlock(patient, evaluation) {
  return `
    <div class="section">
      <h3>GARNER REVERSAL TEST</h3>
      <p>This test evaluates the ability to write, recognize, and match letters and numbers in their correct orientation. The test consists of a letter/number dictation and a mirror-image differentiation test. According to the literature, children with reading difficulties or signs of dyslexia exhibit higher-than-normal reversal frequency. This test helps identify whether the problems are related to learning or suspected dyslexia.</p>
      <table class="data-table">
        <thead><tr><th>Performance</th><th># Errors</th><th>Mean</th><th>Standard Deviation</th></tr></thead>
        <tbody>
          <tr><td>Unknown Letters/Numbers</td><td>${evaluation.garnerUnknownErrors ?? '—'}</td><td>${evaluation.garnerUnknownMean ?? '—'}</td><td>${evaluation.garnerUnknownSd ?? '—'}</td></tr>
          <tr><td>Reversed Letters/Numbers</td><td>${evaluation.garnerReversedErrors ?? '—'}</td><td>${evaluation.garnerReversedMean ?? '—'}</td><td>${evaluation.garnerReversedSd ?? '—'}</td></tr>
          <tr><td>Recognition</td><td>${evaluation.garnerRecognitionErrors ?? '—'}</td><td>${evaluation.garnerRecognitionMean ?? '—'}</td><td>${evaluation.garnerRecognitionSd ?? '—'}</td></tr>
        </tbody>
      </table>
      <p>Upon evaluating the results, the performance of ${patient.firstName} is <strong>below expectations</strong> for other children of the same age. Specifically, the patient presents difficulties with laterality and directionality, meaning they tend to confuse right with left or reverse letters and numbers.</p>
    </div>
  `;
}

function vmiResultsBlock(patient, evaluation) {
  return `
    <div class="section">
      <h3>VISUAL-MOTOR INTEGRATION AND VISUAL PERCEPTION (Beery VMI - Supplemental Test)</h3>
      <p>The Beery Developmental Test of Visual-Motor Integration, fourth revised edition (VMI-4R), is administered to evaluate eye-hand coordination and fine motor skills. The test consists of copying figures from less to greater difficulty, thus evaluating visual construction skills. The scores for ${patient.firstName} were as follows:</p>
      <table class="data-table">
        <thead><tr><th>Raw Score</th><th>Chronological Age</th><th>Perceptual Age Equivalent</th><th>Standard Score</th><th>Percentile</th></tr></thead>
        <tbody>
          <tr><td>${evaluation.beeryVmiRawScore ?? evaluation.vmiRawScore ?? '—'}</td><td>${evaluation.beeryVmiChronologicalAge || evaluation.vmiChronologicalAge || '—'}</td><td>${evaluation.beeryVmiPerceptualAge || evaluation.vmiPerceptualAge || '—'}</td><td>${evaluation.beeryVmiStandardScore ?? evaluation.vmiStandardScore ?? '—'}</td><td>${evaluation.beeryVmiPercentile ?? evaluation.vmiPercentile ?? '—'}</td></tr>
        </tbody>
      </table>
      <p>The test shows that ${patient.firstName} is <strong>below average</strong> compared to a normative group of the same age. The main issue is that the student presents poor handwriting, extreme slowness, and significant fatigue when writing or performing manual tasks because the eyes and hands cannot coordinate with precision.</p>
    </div>
  `;
}

function visualPerceptionBlock(patient, evaluation) {
  return `
    <div class="section">
      <h3>Visual Perception</h3>
      <p>The Beery VMI Visual Perceptual Development Test is conducted to examine visual-perceptual form skills. These skills are essential for speed and accuracy in identifying and discriminating objects, comparing similarities and differences. They also influence the ability to recognize forms and help us draw valid conclusions based on precise analysis of visual information.</p>
      <table class="data-table">
        <thead><tr><th>Raw Score</th><th>Chronological Age</th><th>Perceptual Age Equivalent</th><th>Standard Score</th><th>Percentile</th></tr></thead>
        <tbody>
          <tr><td>${evaluation.visualPerceptionRawScore ?? evaluation.vpRawScore ?? '—'}</td><td>${evaluation.visualPerceptionChronologicalAge || evaluation.vpChronologicalAge || '—'}</td><td>${evaluation.visualPerceptionPerceptualAge || evaluation.vpPerceptualAge || '—'}</td><td>${evaluation.visualPerceptionStandardScore ?? evaluation.vpStandardScore ?? '—'}</td><td>${evaluation.visualPerceptionPercentile ?? evaluation.vpPercentile ?? '—'}</td></tr>
        </tbody>
      </table>
      <p>The test shows that ${patient.firstName} is <strong>below average</strong> compared to a normative group of the same age. The main issue is that the student confuses letters, makes alignment errors in mathematics, and becomes easily overwhelmed with text-heavy pages because the brain has difficulty correctly interpreting and organizing what the eyes are seeing.</p>
    </div>
  `;
}

// ============================================
// ALWAYS-INCLUDED — Summary & Recommendations
// ============================================

function summaryDiagnosesBlock(patient, evaluation) {
  const diagnoses = evaluation.diagnoses || [];
  if (diagnoses.length === 0) return '';

  const diagnosisDescriptions = {
    'H55.81': { name: 'Oculomotor Dysfunction', desc: 'Difficulty in eye movements necessary for reading (affecting saccadic movements, tracking, and fixations).' },
    'H52.533': { name: 'Accommodative Insufficiency', desc: 'Difficulty or slowness in focusing the eyes on near tasks.' },
    'H51.11': { name: 'Convergence Insufficiency', desc: 'Difficulty of the eyes to work as a team and stay aligned inward during reading.' },
    'H51.12': { name: 'Convergence Excess', desc: 'Tendency of the eyes to cross or push inward too much when looking at near.' },
    'H52.13': { name: 'Myopia', desc: 'Blurry distance vision. The child sees well up close, but distant objects such as the board or television appear blurry.' },
    'H52.03': { name: 'Hyperopia', desc: 'Effort at near vision. The eyes must make additional and exhausting effort to keep letters clear when reading or writing, causing rapid fatigue.' },
    'H52.23': { name: 'Astigmatism', desc: 'Distorted vision. The front "window" of the eye is not perfectly round, causing images to appear slightly stretched or distorted at all distances.' }
  };

  const list = diagnoses.map((d) => {
    const info = diagnosisDescriptions[d.code] || { name: d.name, desc: '' };
    return `<li><strong>${info.name} (${d.code}):</strong> ${info.desc}</li>`;
  }).join('');

  return `
    <div class="section">
      <h3>Summary</h3>
      <p>The following conditions are present in ${patient.firstName}:</p>
      <ul>${list}</ul>
      <p>In summary, ${patient.firstName} presents deficiencies in functional and perceptual visual skills. Specifically, difficulties are observed in oculomotor control, focusing ability, and coordination of both eyes to work as a team. Additionally, a delay in eye-hand coordination is observed.</p>
    </div>
  `;
}

function recommendationsBlock(patient, evaluation) {
  const recs = evaluation.recommendations || [];
  const recLabels = {
    visionTherapy: 'Functional Vision Therapy: We recommend starting an individualized program with one weekly 60-minute session. This treatment is designed to help develop the visual skills essential for reaching maximum potential and academic success.',
    therapeuticGlasses: 'Therapeutic Glasses: Continuous wear is indicated. Their purpose is to relax the visual system and prevent fatigue or headaches during daily activities.',
    reEvaluation: 'Re-evaluation recommended.',
    referralNeuro: 'Referral to Neurologist for further evaluation.',
    referralPediatric: 'Referral to Pediatrician for further evaluation.',
    referralPsych: 'Referral to Psychologist for further evaluation.',
    referralOT: 'Referral to Occupational Therapist.',
    referralSLP: 'Referral to Speech-Language Pathologist.',
    computerGlasses: 'Computer Glasses: Indicated for prolonged near-work with digital devices.',
    contactLenses: 'Contact Lenses: Evaluation for contact lens fitting recommended.',
    sunglasses: 'Prescription Sunglasses: Recommended for outdoor protection.',
    homotherapy: 'Home Vision Therapy Exercises: A set of daily exercises to complement in-office therapy.'
  };

  const activeRecs = recs.filter((r) => r.included);

  const recList = activeRecs.length > 0
    ? activeRecs.map((r) => `<li>${recLabels[r.key] || r.text || r.key}</li>`).join('')
    : '';

  return `
    <div class="section">
      <h3>Main Recommendations</h3>
      ${recList ? `<ul>${recList}</ul>` : ''}
    </div>
  `;
}

// NEW: Intervention Plan
function interventionPlanBlock(patient) {
  return `
    <div class="section">
      <h3>Intervention Plan</h3>
      <p>We recommend an individualized Functional Vision Therapy program to provide the patient the opportunity to develop the visual skills necessary for academic success. This program will emphasize the following areas:</p>
      <ul>
        <li><strong>Monocular Activities:</strong> Designed to equalize and improve the focus, visual tracking, and fixation accuracy of each eye separately.</li>
        <li><strong>Binocular Work:</strong> Aimed at achieving coordinated, simultaneous, and efficient teamwork between both eyes.</li>
        <li><strong>Oculomotor Control:</strong> Exercises to perfect the rapid eye movements (saccades), which are fundamental for fluent reading and writing without losing one's place.</li>
        <li><strong>Visuospatial Skills:</strong> Activities to develop orientation (such as right and left), directionality, and the ability to organize information in sequences.</li>
        <li><strong>Processing and Visualization:</strong> Techniques to increase the speed and breadth of visual recognition (the visual "span"), making information processing more automatic.</li>
        <li><strong>Visomotor Integration:</strong> Tasks aimed at improving body awareness and eye-hand coordination (vision-guided fine motor skills).</li>
        <li><strong>Multisensory Integration:</strong> Exercises that connect the visual, auditory, and verbal systems through association or matching of stimuli, to achieve more complete learning.</li>
      </ul>
    </div>
  `;
}

function visualHygieneBlock() {
  return `
    <div class="section">
      <h3>VISUAL HYGIENE RECOMMENDATIONS</h3>
      <p>Good lighting for reading and writing. A 22-degree inclined desk is recommended for reading and writing.</p>
      <h4>Visual Hygiene and Lifestyle Recommendations</h4>
      <ul>
        <li><strong>Harmon Distance for reading and writing:</strong> Accustom the child to keeping work material at the "Harmon Distance." This is the ideal, personalized measurement between the elbow and knuckles with a fist. Maintaining this distance is fundamental to avoid extreme fatigue and maintain good visual health.</li>
        <li><strong>Correct posture when studying:</strong> It is important to maintain good posture during tasks. The child should sit with a straight back and keep both feet flat on the floor (avoiding crossing legs). Good body posture helps correctly align the eyes with the paper.</li>
        <li><strong>Screen time and breaks:</strong> Limit the use of tablets, phones, or video games to no more than 20 continuous minutes. After this time, the child needs to take a visual break, look into the distance, and preferably engage in outdoor play to relax the visual system.</li>
        <li><strong>Balanced nutrition:</strong> Diet directly impacts energy and visual health. We recommend reducing the consumption of sweets, candy, and sodas, while increasing the daily intake of vegetables, fresh fruits, and salads.</li>
      </ul>
    </div>
  `;
}

function signatureBlock(doctorName, licenseNumber) {
  return `
    <div class="signatures">
      <div class="signature-block">
        <p>Sincerely,</p>
        <div class="signature-line" id="doctor-signature"></div>
        <p><strong>${doctorName}</strong></p>
        <p>Certified Functional Optometrist</p>
        <p>Lic. ${licenseNumber}</p>
        <p>Director, NEURONITA</p>
        <p>NEURO-COGNITIVE REHABILITATION CLINIC</p>
      </div>
      <div class="signature-block">
        <div class="signature-line" id="parent-signature"></div>
        <p>Parent / Guardian Signature</p>
        <p>Date: _______________</p>
      </div>
    </div>
  `;
}

// ============================================
// BLOCK REGISTRY
// ============================================

const BLOCK_REGISTRY = {
  // Always included — top section
  header: { fn: headerBlock, always: true },
  patientInfo: { fn: patientInfoBlock, always: true },
  reasonForVisit: { fn: reasonForVisitBlock, always: true },
  history: { fn: historyBlock, always: true, needsHistory: true },
  testsPerformed: { fn: testsPerformedBlock, always: true },
  ocularHealth: { fn: ocularHealthBlock, always: true },
  visualAcuity: { fn: visualAcuityBlock, always: true },
  vaFinding: { fn: vaFindingBlock, always: true },

  // Conditional — refractive
  refractiveStateIntro: { fn: refractiveStateIntroBlock, diagnosisCode: ['H52.03', 'H52.13', 'H52.23'] },
  refractiveHyperopia: { fn: refractiveHyperopiaBlock, diagnosisCode: 'H52.03' },
  refractiveMyopia: { fn: refractiveMyopiaBlock, diagnosisCode: 'H52.13' },
  refractiveAstigmatism: { fn: refractiveAstigmatismBlock, diagnosisCode: 'H52.23' },

  // Conditional — oculomotor
  oculomotorControl: { fn: oculomotorControlBlock, diagnosisCode: 'H55.81' },
  rightEyeResults: { fn: rightEyeResultsBlock, dataField: 'righteyeGlobalScore' },

  // Conditional — accommodation
  accommodation: { fn: accommodationBlock, diagnosisCode: 'H52.533' },

  // Conditional — binocular
  convergenceInsufficiency: { fn: convergenceInsufficiencyBlock, diagnosisCode: 'H51.11' },
  convergenceExcess: { fn: convergenceExcessBlock, diagnosisCode: 'H51.12' },

  // Conditional — depth & fusion
  depthPerception: { fn: depthPerceptionBlock, dataField: 'stereoResult' },
  fusionTest: { fn: fusionTestBlock, dataField: 'stereoResult' },

  // Conditional — perceptual
  garnerReversal: { fn: garnerReversalBlock, dataField: 'garnerUnknownErrors' },
  vmiResults: { fn: vmiResultsBlock, dataFields: ['beeryVmiRawScore', 'vmiRawScore'] },
  visualPerception: { fn: visualPerceptionBlock, dataFields: ['visualPerceptionRawScore', 'vpRawScore'] },

  // Always — summary and closing
  summaryDiagnoses: { fn: summaryDiagnosesBlock, always: true },
  recommendations: { fn: recommendationsBlock, always: true },
  interventionPlan: { fn: interventionPlanBlock, always: true },
  visualHygiene: { fn: visualHygieneBlock, always: true },
  signatures: { fn: signatureBlock, always: true, isSignature: true }
};

function getDefaultConditionBlocks(evaluation) {
  const diagnoses = evaluation.diagnoses || [];
  const diagnosisCodes = diagnoses.map((d) => d.code);

  return Object.entries(BLOCK_REGISTRY).map(([key, config]) => {
    let included = false;

    if (config.always) {
      included = true;
    } else if (config.diagnosisCode) {
      if (Array.isArray(config.diagnosisCode)) {
        included = config.diagnosisCode.some((code) => diagnosisCodes.includes(code));
      } else {
        included = diagnosisCodes.includes(config.diagnosisCode);
      }
    } else if (config.dataField) {
      included = evaluation[config.dataField] != null;
    } else if (config.dataFields) {
      included = config.dataFields.some((f) => evaluation[f] != null);
    }

    return { key, included };
  });
}

function assembleReport({ patient, evaluation, history, conditionBlocks, doctorName, licenseNumber }) {
  const selectedBlocks = conditionBlocks || getDefaultConditionBlocks(evaluation);
  let htmlBody = '';

  for (const block of selectedBlocks) {
    if (!block.included) continue;

    const config = BLOCK_REGISTRY[block.key];
    if (!config) continue;

    if (config.isSignature) {
      htmlBody += config.fn(doctorName, licenseNumber);
    } else if (config.needsHistory) {
      htmlBody += config.fn(patient, evaluation, history);
    } else {
      htmlBody += config.fn(patient, evaluation);
    }
  }

  return htmlBody;
}

module.exports = { assembleReport, getDefaultConditionBlocks, BLOCK_REGISTRY };
