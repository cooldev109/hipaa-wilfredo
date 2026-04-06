const evaluationModel = require('../models/evaluationModel');
const patientModel = require('../models/patientModel');
const auditLogModel = require('../models/auditLogModel');
const { AUDIT_ACTIONS, EVALUATION_STATUS } = require('../utils/constants');
const { decrypt } = require('../utils/encryption');

async function createEvaluation(patientId, evaluationDate, userId, ipAddress, userAgent) {
  const patient = await patientModel.findById(patientId);
  if (!patient) {
    throw { status: 404, errorCode: 'PATIENT_NOT_FOUND' };
  }

  const evaluation = await evaluationModel.create(patientId, evaluationDate, userId);

  await auditLogModel.create({
    userId,
    action: AUDIT_ACTIONS.EVALUATION_CREATE,
    resource: 'evaluations',
    resourceId: evaluation.id,
    ipAddress,
    userAgent
  });

  return evaluation;
}

async function getEvaluation(id, userId, ipAddress, userAgent) {
  const evaluation = await evaluationModel.findById(id);
  if (!evaluation) {
    throw { status: 404, errorCode: 'EVALUATION_NOT_FOUND' };
  }

  // Decrypt patient name for display
  if (evaluation.firstNameEncrypted) {
    evaluation.patientFirstName = decrypt(evaluation.firstNameEncrypted);
    evaluation.patientLastName = decrypt(evaluation.lastNameEncrypted);
    evaluation.patientDateOfBirth = decrypt(evaluation.dateOfBirthEncrypted);
    delete evaluation.firstNameEncrypted;
    delete evaluation.lastNameEncrypted;
    delete evaluation.dateOfBirthEncrypted;
  }

  // Parse JSON fields
  const jsonFields = ['diagnoses', 'recommendations', 'extAnglesOd', 'extAnglesOs',
    'retinoscopyOd', 'retinoscopyOs', 'subjectiveRefractionOd', 'subjectiveRefractionOs',
    'finalRxOd', 'finalRxOs', 'vergenceDistanceBi', 'vergenceDistanceBo',
    'vergenceNearBi', 'vergenceNearBo'];

  for (const field of jsonFields) {
    if (evaluation[field] && typeof evaluation[field] === 'string') {
      try { evaluation[field] = JSON.parse(evaluation[field]); } catch { /* keep as string */ }
    }
  }

  await auditLogModel.create({
    userId,
    action: AUDIT_ACTIONS.EVALUATION_READ,
    resource: 'evaluations',
    resourceId: id,
    ipAddress,
    userAgent
  });

  return evaluation;
}

async function listEvaluations(filters) {
  const result = await evaluationModel.findAll(filters);

  // Decrypt patient names
  result.evaluations = result.evaluations.map((e) => {
    if (e.firstNameEncrypted) {
      e.patientFirstName = decrypt(e.firstNameEncrypted);
      e.patientLastName = decrypt(e.lastNameEncrypted);
      delete e.firstNameEncrypted;
      delete e.lastNameEncrypted;
    }
    return e;
  });

  return result;
}

async function listByPatient(patientId) {
  return evaluationModel.findByPatientId(patientId);
}

async function updateEvaluation(id, data, userId, ipAddress, userAgent) {
  const existing = await evaluationModel.findById(id);
  if (!existing) {
    throw { status: 404, errorCode: 'EVALUATION_NOT_FOUND' };
  }

  if (existing.status === EVALUATION_STATUS.SIGNED) {
    throw { status: 400, errorCode: 'EVALUATION_SIGNED' };
  }

  const evaluation = await evaluationModel.update(id, data, userId);

  await auditLogModel.create({
    userId,
    action: AUDIT_ACTIONS.EVALUATION_UPDATE,
    resource: 'evaluations',
    resourceId: id,
    ipAddress,
    userAgent
  });

  return evaluation;
}

async function autoSaveEvaluation(id, data, userId) {
  const existing = await evaluationModel.findById(id);
  if (!existing || existing.status === EVALUATION_STATUS.SIGNED) return;

  await evaluationModel.autoSave(id, data, userId);
}

async function changeStatus(id, newStatus, userId, ipAddress, userAgent) {
  const existing = await evaluationModel.findById(id);
  if (!existing) {
    throw { status: 404, errorCode: 'EVALUATION_NOT_FOUND' };
  }

  // Validate transitions: draft -> complete -> signed
  const validTransitions = {
    [EVALUATION_STATUS.DRAFT]: [EVALUATION_STATUS.COMPLETE],
    [EVALUATION_STATUS.COMPLETE]: [EVALUATION_STATUS.SIGNED, EVALUATION_STATUS.DRAFT],
    [EVALUATION_STATUS.SIGNED]: []
  };

  if (!validTransitions[existing.status]?.includes(newStatus)) {
    throw { status: 400, errorCode: 'INVALID_STATUS_TRANSITION' };
  }

  const evaluation = await evaluationModel.updateStatus(id, newStatus);

  await auditLogModel.create({
    userId,
    action: AUDIT_ACTIONS.EVALUATION_STATUS_CHANGE,
    resource: 'evaluations',
    resourceId: id,
    ipAddress,
    userAgent,
    details: { from: existing.status, to: newStatus }
  });

  return evaluation;
}

async function deleteEvaluation(id, userId, ipAddress, userAgent) {
  const deleted = await evaluationModel.softDelete(id, userId);
  if (!deleted) {
    throw { status: 404, errorCode: 'EVALUATION_NOT_FOUND' };
  }

  await auditLogModel.create({
    userId,
    action: AUDIT_ACTIONS.EVALUATION_DELETE,
    resource: 'evaluations',
    resourceId: id,
    ipAddress,
    userAgent
  });
}

module.exports = { createEvaluation, getEvaluation, listEvaluations, listByPatient, updateEvaluation, autoSaveEvaluation, changeStatus, deleteEvaluation };
