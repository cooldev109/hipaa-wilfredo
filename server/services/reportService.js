const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const reportModel = require('../models/reportModel');
const evaluationModel = require('../models/evaluationModel');
const patientModel = require('../models/patientModel');
const patientHistoryModel = require('../models/patientHistoryModel');
const userModel = require('../models/userModel');
const auditLogModel = require('../models/auditLogModel');
const { assembleReport, getDefaultConditionBlocks } = require('./reportTemplateService');
const { generatePdf } = require('../utils/pdfGenerator');
const { generateDocx } = require('../utils/docxGenerator');
const { AUDIT_ACTIONS } = require('../utils/constants');
const env = require('../config/environment');
const logger = require('../utils/logger');

async function generateReport(evaluationId, conditionBlocks, userId, ipAddress, userAgent, font, lang) {
  const evaluation = await evaluationModel.findById(evaluationId);
  if (!evaluation) throw { status: 404, errorCode: 'EVALUATION_NOT_FOUND' };

  const patient = await patientModel.findById(evaluation.patientId);
  if (!patient) throw { status: 404, errorCode: 'PATIENT_NOT_FOUND' };

  const history = await patientHistoryModel.findByPatientId(evaluation.patientId);
  const doctor = await userModel.findById(userId);

  // Parse JSON fields in evaluation
  const jsonFields = ['diagnoses', 'recommendations', 'retinoscopyOd', 'retinoscopyOs',
    'subjectiveRefractionOd', 'subjectiveRefractionOs', 'finalRxOd', 'finalRxOs',
    'vergenceDistanceBi', 'vergenceDistanceBo', 'vergenceNearBi', 'vergenceNearBo'];
  for (const field of jsonFields) {
    if (evaluation[field] && typeof evaluation[field] === 'string') {
      try { evaluation[field] = JSON.parse(evaluation[field]); } catch { /* keep */ }
    }
  }

  const blocks = conditionBlocks || getDefaultConditionBlocks(evaluation);
  const version = await reportModel.getNextVersion(evaluationId);

  // Assemble HTML
  const htmlBody = assembleReport({
    patient,
    evaluation,
    history,
    conditionBlocks: blocks,
    doctorName: `Dr. ${doctor.first_name} ${doctor.last_name}`,
    licenseNumber: doctor.license_number || '—',
    lang
  });

  // Generate PDF and DOCX in parallel from the same HTML body
  const [pdfBuffer, docxBuffer] = await Promise.all([
    generatePdf(htmlBody, undefined, undefined, font),
    generateDocx(htmlBody, undefined, undefined, font)
  ]);

  // Save both files to disk
  const storageDir = env.storagePath;
  if (!fs.existsSync(storageDir)) {
    fs.mkdirSync(storageDir, { recursive: true });
  }

  const dateStr = new Date(evaluation.evaluationDate).toISOString().split('T')[0];
  const baseName = `report_${patient.id}_${dateStr}_v${version}`;
  const filePath = path.join(storageDir, `${baseName}.pdf`);
  const docxFilePath = path.join(storageDir, `${baseName}.docx`);
  fs.writeFileSync(filePath, pdfBuffer);
  fs.writeFileSync(docxFilePath, docxBuffer);

  const fileHash = crypto.createHash('sha256').update(pdfBuffer).digest('hex');
  const docxFileHash = crypto.createHash('sha256').update(docxBuffer).digest('hex');

  // Create report record
  const report = await reportModel.create({
    evaluationId,
    patientId: patient.id,
    version,
    reportData: { patient: { firstName: patient.firstName, lastName: patient.lastName }, evaluationDate: evaluation.evaluationDate, font: font || 'default', lang: lang || 'en' },
    conditionBlocks: blocks,
    createdBy: userId
  });

  await reportModel.updatePdfPath(report.id, filePath, fileHash);
  await reportModel.updateDocxPath(report.id, docxFilePath, docxFileHash);

  await auditLogModel.create({
    userId,
    action: AUDIT_ACTIONS.REPORT_GENERATE,
    resource: 'reports',
    resourceId: report.id,
    ipAddress,
    userAgent
  });

  return { ...report, pdfFilePath: filePath, pdfFileHash: fileHash, version };
}

async function getReport(id, userId, ipAddress, userAgent) {
  const report = await reportModel.findById(id);
  if (!report) throw { status: 404, errorCode: 'REPORT_NOT_FOUND' };

  await auditLogModel.create({
    userId,
    action: AUDIT_ACTIONS.REPORT_VIEW,
    resource: 'reports',
    resourceId: id,
    ipAddress,
    userAgent
  });

  return report;
}

async function downloadReport(id, userId, ipAddress, userAgent) {
  const report = await reportModel.findById(id);
  if (!report) throw { status: 404, errorCode: 'REPORT_NOT_FOUND' };
  if (!report.pdfFilePath || !fs.existsSync(report.pdfFilePath)) {
    throw { status: 404, errorCode: 'PDF_NOT_FOUND' };
  }

  await auditLogModel.create({
    userId,
    action: AUDIT_ACTIONS.REPORT_DOWNLOAD,
    resource: 'reports',
    resourceId: id,
    ipAddress,
    userAgent
  });

  return { filePath: report.pdfFilePath, report };
}

async function downloadReportDocx(id, userId, ipAddress, userAgent) {
  const report = await reportModel.findById(id);
  if (!report) throw { status: 404, errorCode: 'REPORT_NOT_FOUND' };
  if (!report.docxFilePath || !fs.existsSync(report.docxFilePath)) {
    throw { status: 404, errorCode: 'DOCX_NOT_FOUND' };
  }

  await auditLogModel.create({
    userId,
    action: AUDIT_ACTIONS.REPORT_DOWNLOAD,
    resource: 'reports',
    resourceId: id,
    ipAddress,
    userAgent,
    details: { format: 'docx' }
  });

  return { filePath: report.docxFilePath, report };
}

async function listReports(filters) {
  const result = await reportModel.findAll(filters);
  const { decrypt } = require('../utils/encryption');

  result.reports = result.reports.map((r) => {
    if (r.firstNameEncrypted) {
      r.patientFirstName = decrypt(r.firstNameEncrypted);
      r.patientLastName = decrypt(r.lastNameEncrypted);
      delete r.firstNameEncrypted;
      delete r.lastNameEncrypted;
    }
    return r;
  });

  return result;
}

async function listByEvaluation(evaluationId) {
  return reportModel.findByEvaluationId(evaluationId);
}

async function signDoctorReport(id, signatureData, userId, ipAddress, userAgent) {
  const report = await reportModel.findById(id);
  if (!report) throw { status: 404, errorCode: 'REPORT_NOT_FOUND' };

  const updated = await reportModel.signDoctor(id, signatureData, userId);

  // Regenerate PDF with signature
  if (report.pdfFilePath && fs.existsSync(report.pdfFilePath)) {
    try {
      const evaluation = await evaluationModel.findById(report.evaluationId);
      const patient = await patientModel.findById(report.patientId);
      const history = await patientHistoryModel.findByPatientId(report.patientId);
      const doctor = await userModel.findById(userId);

      const jsonFields = ['diagnoses', 'recommendations'];
      for (const field of jsonFields) {
        if (evaluation[field] && typeof evaluation[field] === 'string') {
          try { evaluation[field] = JSON.parse(evaluation[field]); } catch { /* keep */ }
        }
      }

      const blocks = report.conditionBlocks;
      const reportDataObj2 = typeof report.reportData === 'string' ? JSON.parse(report.reportData) : (report.reportData || {});
      const htmlBody = assembleReport({
        patient, evaluation, history,
        conditionBlocks: typeof blocks === 'string' ? JSON.parse(blocks) : blocks,
        doctorName: `Dr. ${doctor.first_name} ${doctor.last_name}`,
        licenseNumber: doctor.license_number || '—',
        lang: reportDataObj2.lang || 'en'
      });

      const reportDataObj = typeof report.reportData === 'string' ? JSON.parse(report.reportData) : (report.reportData || {});
      const fontKey = reportDataObj.font || 'default';
      const [pdfBuffer, docxBuffer] = await Promise.all([
        generatePdf(htmlBody, signatureData, report.parentSignatureData, fontKey),
        generateDocx(htmlBody, signatureData, report.parentSignatureData, fontKey)
      ]);
      fs.writeFileSync(report.pdfFilePath, pdfBuffer);
      const fileHash = crypto.createHash('sha256').update(pdfBuffer).digest('hex');
      await reportModel.updatePdfPath(id, report.pdfFilePath, fileHash);
      if (report.docxFilePath) {
        fs.writeFileSync(report.docxFilePath, docxBuffer);
        const docxHash = crypto.createHash('sha256').update(docxBuffer).digest('hex');
        await reportModel.updateDocxPath(id, report.docxFilePath, docxHash);
      }
    } catch (err) {
      logger.error({ err }, 'Failed to regenerate PDF/DOCX with doctor signature');
    }
  }

  await auditLogModel.create({
    userId,
    action: AUDIT_ACTIONS.REPORT_SIGN,
    resource: 'reports',
    resourceId: id,
    ipAddress,
    userAgent,
    details: { signer: 'doctor' }
  });

  return updated;
}

async function signParentReport(id, signatureData, signerName, userId, ipAddress, userAgent) {
  const report = await reportModel.findById(id);
  if (!report) throw { status: 404, errorCode: 'REPORT_NOT_FOUND' };

  const updated = await reportModel.signParent(id, signatureData, signerName);

  // Regenerate PDF with parent signature
  if (report.pdfFilePath && fs.existsSync(report.pdfFilePath)) {
    try {
      const evaluation = await evaluationModel.findById(report.evaluationId);
      const patient = await patientModel.findById(report.patientId);
      const history = await patientHistoryModel.findByPatientId(report.patientId);
      const doctor = await userModel.findById(report.createdBy);

      const jsonFields = ['diagnoses', 'recommendations'];
      for (const field of jsonFields) {
        if (evaluation[field] && typeof evaluation[field] === 'string') {
          try { evaluation[field] = JSON.parse(evaluation[field]); } catch { /* keep */ }
        }
      }

      const blocks = report.conditionBlocks;
      const reportDataObj2 = typeof report.reportData === 'string' ? JSON.parse(report.reportData) : (report.reportData || {});
      const htmlBody = assembleReport({
        patient, evaluation, history,
        conditionBlocks: typeof blocks === 'string' ? JSON.parse(blocks) : blocks,
        doctorName: `Dr. ${doctor.first_name} ${doctor.last_name}`,
        licenseNumber: doctor.license_number || '—',
        lang: reportDataObj2.lang || 'en'
      });

      const reportDataObj = typeof report.reportData === 'string' ? JSON.parse(report.reportData) : (report.reportData || {});
      const fontKey = reportDataObj.font || 'default';
      const docSig = report.doctorSignatureData || signatureData;
      const [pdfBuffer, docxBuffer] = await Promise.all([
        generatePdf(htmlBody, docSig, signatureData, fontKey),
        generateDocx(htmlBody, docSig, signatureData, fontKey)
      ]);
      fs.writeFileSync(report.pdfFilePath, pdfBuffer);
      const fileHash = crypto.createHash('sha256').update(pdfBuffer).digest('hex');
      await reportModel.updatePdfPath(id, report.pdfFilePath, fileHash);
      if (report.docxFilePath) {
        fs.writeFileSync(report.docxFilePath, docxBuffer);
        const docxHash = crypto.createHash('sha256').update(docxBuffer).digest('hex');
        await reportModel.updateDocxPath(id, report.docxFilePath, docxHash);
      }
    } catch (err) {
      logger.error({ err }, 'Failed to regenerate PDF/DOCX with parent signature');
    }
  }

  await auditLogModel.create({
    userId,
    action: AUDIT_ACTIONS.REPORT_SIGN,
    resource: 'reports',
    resourceId: id,
    ipAddress,
    userAgent,
    details: { signer: 'parent', signerName }
  });

  return updated;
}

module.exports = { generateReport, getReport, downloadReport, downloadReportDocx, listReports, listByEvaluation, signDoctorReport, signParentReport };
