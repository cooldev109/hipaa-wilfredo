const reportService = require('../services/reportService');
const path = require('path');

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function generate(req, res, next) {
  try {
    const { evaluationId, conditionBlocks, font } = req.body;
    if (!evaluationId) {
      return res.status(400).json({ success: false, errorCode: 'EVALUATION_ID_REQUIRED' });
    }
    if (!UUID_REGEX.test(evaluationId)) {
      return res.status(400).json({ success: false, errorCode: 'INVALID_UUID' });
    }
    const fontKey = font === 'inter' ? 'inter' : 'default';

    const report = await reportService.generateReport(
      evaluationId, conditionBlocks, req.user.userId, req.ip, req.get('User-Agent'), fontKey
    );

    return res.status(201).json({ success: true, data: report });
  } catch (err) {
    if (err.status) return res.status(err.status).json({ success: false, errorCode: err.errorCode });
    next(err);
  }
}

async function getById(req, res, next) {
  try {
    const report = await reportService.getReport(
      req.params.id, req.user.userId, req.ip, req.get('User-Agent')
    );
    return res.json({ success: true, data: report });
  } catch (err) {
    if (err.status) return res.status(err.status).json({ success: false, errorCode: err.errorCode });
    next(err);
  }
}

async function download(req, res, next) {
  try {
    const { filePath, report } = await reportService.downloadReport(
      req.params.id, req.user.userId, req.ip, req.get('User-Agent')
    );

    const absolutePath = path.isAbsolute(filePath) ? filePath : path.resolve(filePath);
    const fileName = path.basename(absolutePath);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.sendFile(absolutePath);
  } catch (err) {
    if (err.status) return res.status(err.status).json({ success: false, errorCode: err.errorCode });
    next(err);
  }
}

async function list(req, res, next) {
  try {
    const { page = 1, limit = 25 } = req.query;
    const result = await reportService.listReports({ page: parseInt(page, 10), limit: parseInt(limit, 10) });
    return res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

async function listByEvaluation(req, res, next) {
  try {
    const reports = await reportService.listByEvaluation(req.params.evaluationId);
    return res.json({ success: true, data: reports });
  } catch (err) {
    next(err);
  }
}

async function signDoctor(req, res, next) {
  try {
    const { signatureData } = req.body;
    if (!signatureData) {
      return res.status(400).json({ success: false, errorCode: 'SIGNATURE_REQUIRED' });
    }

    const report = await reportService.signDoctorReport(
      req.params.id, signatureData, req.user.userId, req.ip, req.get('User-Agent')
    );

    return res.json({ success: true, data: report });
  } catch (err) {
    if (err.status) return res.status(err.status).json({ success: false, errorCode: err.errorCode });
    next(err);
  }
}

async function signParent(req, res, next) {
  try {
    const { signatureData, signerName } = req.body;
    if (!signatureData || !signerName) {
      return res.status(400).json({ success: false, errorCode: 'SIGNATURE_AND_NAME_REQUIRED' });
    }

    const report = await reportService.signParentReport(
      req.params.id, signatureData, signerName, req.user.userId, req.ip, req.get('User-Agent')
    );

    return res.json({ success: true, data: report });
  } catch (err) {
    if (err.status) return res.status(err.status).json({ success: false, errorCode: err.errorCode });
    next(err);
  }
}

module.exports = { generate, getById, download, list, listByEvaluation, signDoctor, signParent };
