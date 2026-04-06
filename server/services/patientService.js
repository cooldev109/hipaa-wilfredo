const patientModel = require('../models/patientModel');
const patientHistoryModel = require('../models/patientHistoryModel');
const auditLogModel = require('../models/auditLogModel');
const { AUDIT_ACTIONS } = require('../utils/constants');
const dayjs = require('dayjs');

async function createPatient(data, userId, ipAddress, userAgent) {
  const patient = await patientModel.create({ ...data, createdBy: userId });

  if (data.history) {
    await patientHistoryModel.createOrUpdate(patient.id, data.history, userId);
  }

  await auditLogModel.create({
    userId,
    action: AUDIT_ACTIONS.PATIENT_CREATE,
    resource: 'patients',
    resourceId: patient.id,
    ipAddress,
    userAgent
  });

  return patient;
}

async function getPatient(id, userId, ipAddress, userAgent) {
  const patient = await patientModel.findById(id);
  if (!patient) {
    throw { status: 404, errorCode: 'PATIENT_NOT_FOUND' };
  }

  const history = await patientHistoryModel.findByPatientId(id);

  await auditLogModel.create({
    userId,
    action: AUDIT_ACTIONS.PATIENT_READ,
    resource: 'patients',
    resourceId: id,
    ipAddress,
    userAgent
  });

  return {
    ...patient,
    age: calculateAge(patient.dateOfBirth),
    history: history || null
  };
}

async function listPatients(filters, userId, ipAddress, userAgent) {
  const result = await patientModel.findAll(filters);

  // Add age to each patient
  result.patients = result.patients.map((p) => ({
    ...p,
    age: calculateAge(p.dateOfBirth)
  }));

  return result;
}

async function updatePatient(id, data, userId, ipAddress, userAgent) {
  const patient = await patientModel.update(id, { ...data, updatedBy: userId });
  if (!patient) {
    throw { status: 404, errorCode: 'PATIENT_NOT_FOUND' };
  }

  await auditLogModel.create({
    userId,
    action: AUDIT_ACTIONS.PATIENT_UPDATE,
    resource: 'patients',
    resourceId: id,
    ipAddress,
    userAgent
  });

  return patient;
}

async function updateHistory(patientId, historyData, userId, ipAddress, userAgent) {
  const patient = await patientModel.findById(patientId);
  if (!patient) {
    throw { status: 404, errorCode: 'PATIENT_NOT_FOUND' };
  }

  const history = await patientHistoryModel.createOrUpdate(patientId, historyData, userId);

  await auditLogModel.create({
    userId,
    action: AUDIT_ACTIONS.PATIENT_UPDATE,
    resource: 'patients',
    resourceId: patientId,
    ipAddress,
    userAgent,
    details: { section: 'history' }
  });

  return history;
}

async function deletePatient(id, userId, ipAddress, userAgent) {
  const deleted = await patientModel.softDelete(id, userId);
  if (!deleted) {
    throw { status: 404, errorCode: 'PATIENT_NOT_FOUND' };
  }

  await auditLogModel.create({
    userId,
    action: AUDIT_ACTIONS.PATIENT_DELETE,
    resource: 'patients',
    resourceId: id,
    ipAddress,
    userAgent
  });
}

function calculateAge(dateOfBirth) {
  if (!dateOfBirth) return null;
  const dob = dayjs(dateOfBirth);
  const now = dayjs();
  const years = now.diff(dob, 'year');
  const months = now.diff(dob, 'month') % 12;
  return { years, months };
}

module.exports = { createPatient, getPatient, listPatients, updatePatient, updateHistory, deletePatient };
