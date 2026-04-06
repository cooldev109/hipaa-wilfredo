const evaluationService = require('../services/evaluationService');

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function create(req, res, next) {
  try {
    const { patientId, evaluationDate } = req.body;
    if (!patientId || !evaluationDate) {
      return res.status(400).json({ success: false, errorCode: 'EVALUATION_REQUIRED_FIELDS' });
    }
    if (!UUID_REGEX.test(patientId)) {
      return res.status(400).json({ success: false, errorCode: 'INVALID_UUID' });
    }

    const evaluation = await evaluationService.createEvaluation(
      patientId, evaluationDate, req.user.userId, req.ip, req.get('User-Agent')
    );
    return res.status(201).json({ success: true, data: evaluation });
  } catch (err) {
    if (err.status) return res.status(err.status).json({ success: false, errorCode: err.errorCode });
    next(err);
  }
}

async function getById(req, res, next) {
  try {
    const evaluation = await evaluationService.getEvaluation(
      req.params.id, req.user.userId, req.ip, req.get('User-Agent')
    );
    return res.json({ success: true, data: evaluation });
  } catch (err) {
    if (err.status) return res.status(err.status).json({ success: false, errorCode: err.errorCode });
    next(err);
  }
}

async function list(req, res, next) {
  try {
    const { status, page = 1, limit = 25 } = req.query;
    const result = await evaluationService.listEvaluations({
      status, page: parseInt(page, 10), limit: parseInt(limit, 10)
    });
    return res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

async function listByPatient(req, res, next) {
  try {
    const evaluations = await evaluationService.listByPatient(req.params.patientId);
    return res.json({ success: true, data: evaluations });
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const evaluation = await evaluationService.updateEvaluation(
      req.params.id, req.body, req.user.userId, req.ip, req.get('User-Agent')
    );
    return res.json({ success: true, data: evaluation });
  } catch (err) {
    if (err.status) return res.status(err.status).json({ success: false, errorCode: err.errorCode });
    next(err);
  }
}

async function autoSave(req, res, next) {
  try {
    await evaluationService.autoSaveEvaluation(req.params.id, req.body, req.user.userId);
    return res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

async function changeStatus(req, res, next) {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ success: false, errorCode: 'STATUS_REQUIRED' });
    }

    const evaluation = await evaluationService.changeStatus(
      req.params.id, status, req.user.userId, req.ip, req.get('User-Agent')
    );
    return res.json({ success: true, data: evaluation });
  } catch (err) {
    if (err.status) return res.status(err.status).json({ success: false, errorCode: err.errorCode });
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    await evaluationService.deleteEvaluation(
      req.params.id, req.user.userId, req.ip, req.get('User-Agent')
    );
    return res.json({ success: true });
  } catch (err) {
    if (err.status) return res.status(err.status).json({ success: false, errorCode: err.errorCode });
    next(err);
  }
}

module.exports = { create, getById, list, listByPatient, update, autoSave, changeStatus, remove };
