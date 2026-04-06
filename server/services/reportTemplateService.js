/**
 * Report Template Service
 *
 * Assembles narrative report blocks from evaluation data.
 * Each block is a function that receives patient + evaluation data
 * and returns HTML content for the PDF.
 *
 * Based on the DOCX template: "Informe Visual Funcional"
 * from Neuronita - Clínica de Rehabilitación Neuro-Cognitiva
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
  const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  const d = dayjs(date);
  return `${d.date()} de ${months[d.month()]} de ${d.year()}`;
}

function formatRx(rxData) {
  if (!rxData) return '—';
  if (typeof rxData === 'string') {
    try { rxData = JSON.parse(rxData); } catch { return rxData; }
  }
  const parts = [];
  if (rxData.sphere) parts.push(`${rxData.sphere > 0 ? '+' : ''}${rxData.sphere}`);
  if (rxData.cylinder) parts.push(`${rxData.cylinder > 0 ? '+' : ''}${rxData.cylinder}`);
  if (rxData.axis) parts.push(`x${rxData.axis}°`);
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
        <p class="clinic-sub">Clínica de Rehabilitación Neuro-Cognitiva</p>
      </div>
      <div class="header-right">
        Tel. 787-407-4814<br>
        Fax. 787-258-8225<br>
        clinicarehabilitacion10@gmail.com
      </div>
    </div>
    <h2 class="report-title">Informe Visual Funcional</h2>
  `;
}

function patientInfoBlock(patient, evaluation) {
  const age = calculateAge(patient.dateOfBirth);
  return `
    <div class="section">
      <table class="info-table">
        <tr><td><strong>Paciente:</strong></td><td>${patient.firstName} ${patient.lastName}</td></tr>
        <tr><td><strong>Fecha de Evaluación:</strong></td><td>${formatDate(evaluation.evaluationDate)}</td></tr>
        <tr><td><strong>Fecha Nacimiento:</strong></td><td>${formatDate(patient.dateOfBirth)}</td></tr>
        <tr><td><strong>Edad Cronológica:</strong></td><td>${age.years} años con ${age.months} meses</td></tr>
        <tr><td><strong>Escuela:</strong></td><td>${patient.school || '—'}</td></tr>
        <tr><td><strong>Grado:</strong></td><td>${patient.grade || '—'}</td></tr>
      </table>
    </div>
  `;
}

function reasonForVisitBlock(patient) {
  return `
    <div class="section">
      <h3>Razón de la visita</h3>
      <p>El paciente nos visita para descartar si algún problema en el funcionamiento de sus ojos está haciendo que aprender a leer, escribir o concentrarse sea más difícil de lo normal.</p>
    </div>
  `;
}

function historyBlock(patient, evaluation, history) {
  if (!history) return '';
  const therapyLabels = {
    occupational: 'Ocupacional (TO)',
    occupationalSensory: 'Ocupacional Sensorial (TOS)',
    speech: 'Habla y Lenguaje (THL)',
    physical: 'Física (TP)',
    educational: 'Educativa (TE)',
    psychological: 'Psicológica (TPSIC)',
    functionalVision: 'Visión Funcional (VF)'
  };

  const activeTherapies = history.therapies
    ? Object.entries(history.therapies).filter(([, v]) => v).map(([k]) => therapyLabels[k] || k)
    : [];

  return `
    <div class="section">
      <h3>HISTORIAL</h3>
      <p><strong>Historial Visual:</strong> ${history.visualHistory || '—'}</p>
      <p><strong>Historial Médico:</strong> ${history.medicalHistory || '—'}</p>
      <p><strong>Medicamentos:</strong> ${history.medications || '—'}</p>
      <p><strong>Historial del Desarrollo Motor:</strong> El desarrollo físico temprano del paciente nos da pistas sobre su desarrollo visual. Nació a las ${history.developmentalBirthWeeks || '___'} semanas mediante parto ${history.developmentalBirthType === 'cesarean' ? 'por cesárea' : 'natural'}. Comenzó a gatear a los ${history.developmentalCrawledMonths || '___'} meses, a caminar a los ${history.developmentalWalkedMonths || '___'} meses y dijo sus primeras palabras a los ${history.developmentalTalkedMonths || '___'} meses.</p>
      ${activeTherapies.length > 0 ? `<p><strong>Servicios Especializados:</strong> ${activeTherapies.join(', ')}</p>` : ''}
      <p><strong>Historial Ocular Familiar:</strong> ${history.familyOcularHistory || '—'}</p>
      <p><strong>Historial Médico Familiar:</strong> ${history.familyMedicalHistory || '—'}</p>
    </div>
  `;
}

function testsPerformedBlock() {
  return `
    <div class="section">
      <h3>Pruebas Realizadas</h3>
      <p>Evaluamos mucho más que solo "ver las letras pequeñas". Analizamos cómo el cerebro y los ojos trabajan en equipo.</p>
      <ul>
        <li>Salud Visual (Examen físico del ojo)</li>
        <li>Visión a Color</li>
        <li>Agudeza Visual (Qué tan claro ve de lejos y de cerca)</li>
        <li>Refracción (Si necesita espejuelos)</li>
        <li>Evaluación de Movimientos Oculares (Cómo mueve los ojos al seguir objetos)</li>
        <li>Prueba RightEye (Cómo se mueven los ojos al leer)</li>
        <li>Habilidad de Enfoque (Cómo cambia la vista de la pizarra al papel)</li>
        <li>Binocularidad (Cómo trabajan ambos ojos juntos como equipo)</li>
        <li>Percepción de Profundidad (Visión en 3D)</li>
        <li>Reversión de Letras/Números (Confusión de letras como 'b' y 'd')</li>
        <li>Integración Visual-Motora (Coordinación ojo-mano)</li>
        <li>Percepción Visual (Cómo el cerebro entiende lo que ven los ojos)</li>
      </ul>
    </div>
  `;
}

function ocularHealthBlock(patient, evaluation) {
  return `
    <div class="section">
      <h3>SALUD VISUAL</h3>
      <p>Los ojos de ${patient.firstName}, tejido ocular, y estructuras relacionadas están saludables y libres de enfermedad.</p>
      <p><strong>Visión a Color encontrada:</strong> ${evaluation.colorVisionResult || 'Normal'}.</p>
    </div>
  `;
}

function visualAcuityBlock(patient, evaluation) {
  return `
    <div class="section">
      <h3>AGUDEZA VISUAL</h3>
      <p>(Claridad de visión) Decir que alguien tiene visión "20/20" solo significa que puede ver letras pequeñas desde lejos. Sin embargo, esto no nos dice si el niño tiene que hacer un esfuerzo enorme para verlas, ni si sus ojos se cansan rápido al leer.</p>
      <table class="data-table">
        <thead>
          <tr><th>Agudeza Visual</th><th>Ojo</th><th>Sin Corrección</th><th>Con Corrección</th></tr>
        </thead>
        <tbody>
          <tr><td rowspan="2">Distancia</td><td>OD</td><td>20/${evaluation.vaDistanceUnaidedOd || '—'}</td><td>20/${evaluation.vaDistanceAidedOd || '—'}</td></tr>
          <tr><td>OS</td><td>20/${evaluation.vaDistanceUnaidedOs || '—'}</td><td>20/${evaluation.vaDistanceAidedOs || '—'}</td></tr>
          <tr><td rowspan="2">Cerca</td><td>OD</td><td>20/${evaluation.vaNearUnaidedOd || '—'}</td><td>20/${evaluation.vaNearAidedOd || '—'}</td></tr>
          <tr><td>OS</td><td>20/${evaluation.vaNearUnaidedOs || '—'}</td><td>20/${evaluation.vaNearAidedOs || '—'}</td></tr>
        </tbody>
      </table>
    </div>
  `;
}

// ============================================
// CONDITIONAL BLOCKS
// ============================================

function refractiveHyperopiaBlock(patient) {
  return `
    <div class="section">
      <p><strong>Hipermetropía:</strong> Significa que sus ojos tienen que hacer un esfuerzo extra para ver de cerca (como al leer un libro o usar una tablet).</p>
    </div>
  `;
}

function refractiveMyopiaBlock(patient) {
  return `
    <div class="section">
      <p><strong>Miopía:</strong> Significa que sus ojos tienen que hacer esfuerzo extra para ver de lejos.</p>
    </div>
  `;
}

function refractiveAstigmatismBlock(patient) {
  return `
    <div class="section">
      <p><strong>Astigmatismo:</strong> Causa que las imágenes se vean un poco distorsionadas o estiradas, afectando la visión a cualquier distancia.</p>
    </div>
  `;
}

function oculomotorControlBlock(patient, evaluation) {
  return `
    <div class="section">
      <h3>CONTROL DE MOVIMIENTO OCULAR</h3>
      <p>El control del movimiento ocular requiere el más alto nivel de precisión motora en el humano. Para cambiar el punto de fijación, o mantener la fijación en un objeto que está en movimiento, los ojos deben moverse con precisión y ambos al mismo tiempo.</p>
      <p>El análisis de movimiento ocular de ${patient.firstName} muestra que la habilidad de seguir un objeto en movimiento con precisión está por debajo del nivel necesario para mantener un nivel académico máximo.</p>
    </div>
  `;
}

function rightEyeResultsBlock(patient, evaluation) {
  return `
    <div class="section">
      <h3>EVALUACIÓN DE MOVIMIENTOS DE LECTURA (RightEye)</h3>
      <p>La prueba "RightEye" evalúa la calidad de los movimientos sacádicos de pequeña amplitud, movimientos de seguimiento y las fijaciones visuales.</p>
      <table class="data-table">
        <thead><tr><th>Movimiento ocular</th><th>Resultado Obtenido</th><th>Resultado Esperado</th></tr></thead>
        <tbody>
          <tr><td>Seguimiento</td><td>${evaluation.righteyeTrackingScore || '—'}</td><td>&gt;75</td></tr>
          <tr><td>Sacádico</td><td>${evaluation.righteyeSaccadicScore || '—'}</td><td>&gt;75</td></tr>
          <tr><td>Fijación</td><td>${evaluation.righteyeFixationScore || '—'}</td><td>&gt;75</td></tr>
        </tbody>
      </table>
      <p>${patient.firstName} obtuvo un resultado Global de ${evaluation.righteyeGlobalScore || '—'}, en donde lo esperado es mayor de 75.</p>
    </div>
  `;
}

function accommodationBlock(patient) {
  return `
    <div class="section">
      <h3>ACOMODACIÓN (HABILIDAD DE ENFOQUE)</h3>
      <p>El desempeño académico y atlético depende de la habilidad para enfocar los ojos rápida y automáticamente, independientemente de la distancia en la que se trabaja.</p>
      <p>Durante la evaluación de habilidad acomodativa ${patient.firstName} presentó dificultad para mantener el enfoque.</p>
      <p><strong>Dificultad Acomodativa:</strong> El "enfoque automático" de sus ojos es lento o le cuesta mantenerlo.</p>
      <p><strong>¿Cómo le afecta en la escuela?</strong> Le causa cansancio visual, dolor de cabeza al hacer tareas, hace que las letras se vean borrosas después de un rato y reduce lo que entiende de lo que lee.</p>
    </div>
  `;
}

function convergenceInsufficiencyBlock(patient) {
  return `
    <div class="section">
      <h3>INTEGRACIÓN BINOCULAR</h3>
      <p>${patient.firstName} presenta Insuficiencia de convergencia, a los ojos les cuesta mucho esfuerzo mantener ese giro hacia adentro al leer.</p>
      <p>La analogía de las linternas: Es como si las baterías de las linternas estuvieran débiles. Intentan apuntar juntas a la palabra, pero se cansan y una (o ambas) tiende a abrirse o desviarse hacia afuera.</p>
    </div>
  `;
}

function convergenceExcessBlock(patient) {
  return `
    <div class="section">
      <p>${patient.firstName} presenta Exceso de Convergencia. Al mirar el cuaderno, en lugar de apuntar justo a la página, los músculos de los ojos giran hacia adentro demasiado.</p>
    </div>
  `;
}

function depthPerceptionBlock(patient, evaluation) {
  return `
    <div class="section">
      <h3>PERCEPCIÓN DE PROFUNDIDAD</h3>
      <p>${patient.firstName} presenta una percepción de profundidad reducida, de ${evaluation.stereoResult || '—'} segundos de arco.</p>
    </div>
  `;
}

function garnerReversalBlock(patient, evaluation) {
  return `
    <div class="section">
      <h3>PRUEBA DE REVERSIÓN GARNER</h3>
      <p>Se realiza para probar la habilidad de escribir, reconocer y unir letras y números en su orientación correcta.</p>
      <table class="data-table">
        <thead><tr><th>Ejecución</th><th># de Errores</th><th>Promedio</th><th>Desviación Estándar</th></tr></thead>
        <tbody>
          <tr><td>Letras/Números Desconocidas</td><td>${evaluation.garnerUnknownErrors ?? '—'}</td><td>${evaluation.garnerUnknownMean ?? '—'}</td><td>${evaluation.garnerUnknownSd ?? '—'}</td></tr>
          <tr><td>Letras/Números Revertidas</td><td>${evaluation.garnerReversedErrors ?? '—'}</td><td>${evaluation.garnerReversedMean ?? '—'}</td><td>${evaluation.garnerReversedSd ?? '—'}</td></tr>
          <tr><td>Reconocimiento</td><td>${evaluation.garnerRecognitionErrors ?? '—'}</td><td>${evaluation.garnerRecognitionMean ?? '—'}</td><td></td></tr>
        </tbody>
      </table>
    </div>
  `;
}

function vmiResultsBlock(patient, evaluation) {
  return `
    <div class="section">
      <h3>INTEGRACIÓN VISUAL MOTORA (Beery VMI)</h3>
      <p>La Prueba de Desarrollo de Integración Visual-Motora evalúa la coordinación ojo-mano y motor fino.</p>
      <table class="data-table">
        <thead><tr><th>Puntuación Cruda</th><th>Edad Cronológica</th><th>Equivalencia de Edad</th><th>Puntuación Estándar</th><th>Percentila</th></tr></thead>
        <tbody>
          <tr><td>${evaluation.vmiRawScore ?? '—'}</td><td>${evaluation.vmiChronologicalAge || '—'}</td><td>${evaluation.vmiPerceptualAge || '—'}</td><td>${evaluation.vmiStandardScore ?? '—'}</td><td>${evaluation.vmiPercentile ?? '—'}</td></tr>
        </tbody>
      </table>
    </div>
  `;
}

function visualPerceptionBlock(patient, evaluation) {
  return `
    <div class="section">
      <h3>Percepción Visual</h3>
      <p>La Prueba de Desarrollo Visual Perceptual examina las habilidades de la forma visual-perceptual.</p>
      <table class="data-table">
        <thead><tr><th>Puntuación Cruda</th><th>Edad Cronológica</th><th>Equivalencia de Edad</th><th>Puntuación Estándar</th><th>Percentila</th></tr></thead>
        <tbody>
          <tr><td>${evaluation.vpRawScore ?? '—'}</td><td>${evaluation.vpChronologicalAge || '—'}</td><td>${evaluation.vpPerceptualAge || '—'}</td><td>${evaluation.vpStandardScore ?? '—'}</td><td>${evaluation.vpPercentile ?? '—'}</td></tr>
        </tbody>
      </table>
    </div>
  `;
}

function summaryDiagnosesBlock(patient, evaluation) {
  const diagnoses = evaluation.diagnoses || [];
  if (diagnoses.length === 0) return '';

  const diagnosisNames = {
    'H55.81': 'Disfunción Oculomotora',
    'H52.533': 'Insuficiencia de Acomodación',
    'H51.11': 'Insuficiencia de Convergencia',
    'H51.12': 'Exceso de Convergencia',
    'H52.13': 'Miopía',
    'H52.03': 'Hipermetropía',
    'H52.23': 'Astigmatismo'
  };

  const list = diagnoses.map((d) =>
    `<li><strong>${d.code}</strong> — ${diagnosisNames[d.code] || d.name}</li>`
  ).join('');

  return `
    <div class="section">
      <h3>Resumen</h3>
      <p>Las siguientes condiciones están presentes en ${patient.firstName}:</p>
      <ul>${list}</ul>
    </div>
  `;
}

function recommendationsBlock(patient, evaluation) {
  const recs = evaluation.recommendations || [];
  const recLabels = {
    visionTherapy: 'Terapia Visual Funcional: Recomendamos iniciar un programa individualizado con una sesión semanal de 60 minutos.',
    therapeuticGlasses: 'Espejuelos terapéuticos: Se indica el uso continuo de estos lentes para relajar el sistema visual.',
    reEvaluation: 'Re-evaluación recomendada.'
  };

  const activeRecs = recs.filter((r) => r.included);
  if (activeRecs.length === 0) return '';

  const list = activeRecs.map((r) =>
    `<li>${recLabels[r.key] || r.text || r.key}</li>`
  ).join('');

  return `
    <div class="section">
      <h3>Recomendaciones</h3>
      <ul>${list}</ul>
    </div>
  `;
}

function visualHygieneBlock() {
  return `
    <div class="section">
      <h3>RECOMENDACIONES DE HIGIENE VISUAL</h3>
      <ul>
        <li>Buena iluminación para lectura y escritura.</li>
        <li>Se recomienda tabla inclinada de 22 grados para lectura y escritura.</li>
        <li><strong>Distancia de Harmon:</strong> Mantener el material de trabajo a la distancia entre el codo y los nudillos.</li>
        <li><strong>Postura correcta:</strong> Espalda derecha, pies apoyados en el piso.</li>
        <li><strong>Tiempo de pantallas:</strong> No más de 20 minutos continuos. Hacer pausas visuales.</li>
        <li><strong>Nutrición:</strong> Reducir dulces y refrescos, aumentar vegetales y frutas.</li>
      </ul>
    </div>
  `;
}

function signatureBlock(doctorName, licenseNumber) {
  return `
    <div class="signatures">
      <div class="signature-block">
        <div class="signature-line" id="doctor-signature"></div>
        <p>${doctorName}</p>
        <p>Optómetra Certificado y Funcional</p>
        <p>Lic. ${licenseNumber}</p>
        <p>Director de NEURONITA</p>
      </div>
      <div class="signature-block">
        <div class="signature-line" id="parent-signature"></div>
        <p>Firma de Padre, Madre o Encargado</p>
        <p>Fecha: _______________</p>
      </div>
    </div>
  `;
}

// ============================================
// BLOCK REGISTRY
// ============================================

const BLOCK_REGISTRY = {
  // Always included
  header: { fn: headerBlock, always: true },
  patientInfo: { fn: patientInfoBlock, always: true },
  reasonForVisit: { fn: reasonForVisitBlock, always: true },
  history: { fn: historyBlock, always: true, needsHistory: true },
  testsPerformed: { fn: testsPerformedBlock, always: true },
  ocularHealth: { fn: ocularHealthBlock, always: true },
  visualAcuity: { fn: visualAcuityBlock, always: true },

  // Conditional — based on diagnoses or data
  refractiveHyperopia: { fn: refractiveHyperopiaBlock, diagnosisCode: 'H52.03' },
  refractiveMyopia: { fn: refractiveMyopiaBlock, diagnosisCode: 'H52.13' },
  refractiveAstigmatism: { fn: refractiveAstigmatismBlock, diagnosisCode: 'H52.23' },
  oculomotorControl: { fn: oculomotorControlBlock, diagnosisCode: 'H55.81' },
  rightEyeResults: { fn: rightEyeResultsBlock, dataField: 'righteyeGlobalScore' },
  accommodation: { fn: accommodationBlock, diagnosisCode: 'H52.533' },
  convergenceInsufficiency: { fn: convergenceInsufficiencyBlock, diagnosisCode: 'H51.11' },
  convergenceExcess: { fn: convergenceExcessBlock, diagnosisCode: 'H51.12' },
  depthPerception: { fn: depthPerceptionBlock, dataField: 'stereoResult' },
  garnerReversal: { fn: garnerReversalBlock, dataField: 'garnerUnknownErrors' },
  vmiResults: { fn: vmiResultsBlock, dataField: 'vmiRawScore' },
  visualPerception: { fn: visualPerceptionBlock, dataField: 'vpRawScore' },

  // Always at the end
  summaryDiagnoses: { fn: summaryDiagnosesBlock, always: true },
  recommendations: { fn: recommendationsBlock, always: true },
  visualHygiene: { fn: visualHygieneBlock, always: true },
  signatures: { fn: signatureBlock, always: true, isSignature: true }
};

/**
 * Determine which blocks should be included based on evaluation data
 */
function getDefaultConditionBlocks(evaluation) {
  const diagnoses = evaluation.diagnoses || [];
  const diagnosisCodes = diagnoses.map((d) => d.code);

  return Object.entries(BLOCK_REGISTRY).map(([key, config]) => {
    let included = false;

    if (config.always) {
      included = true;
    } else if (config.diagnosisCode) {
      included = diagnosisCodes.includes(config.diagnosisCode);
    } else if (config.dataField) {
      included = evaluation[config.dataField] != null;
    }

    return { key, included };
  });
}

/**
 * Assemble the full report HTML from selected blocks
 */
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
