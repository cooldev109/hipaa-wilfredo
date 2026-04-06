const patientService = require('../services/patientService');

async function create(req, res, next) {
  try {
    const { firstName, lastName, dateOfBirth, sex, school, grade, referredBy, parentGuardianName, parentGuardianPhone, parentGuardianEmail, history } = req.body;

    if (!firstName || !lastName || !dateOfBirth || !sex) {
      return res.status(400).json({ success: false, errorCode: 'PATIENT_REQUIRED_FIELDS' });
    }

    if (!['M', 'F'].includes(sex)) {
      return res.status(400).json({ success: false, errorCode: 'INVALID_SEX' });
    }

    const patient = await patientService.createPatient(
      { firstName, lastName, dateOfBirth, sex, school, grade, referredBy, parentGuardianName, parentGuardianPhone, parentGuardianEmail, history },
      req.user.userId,
      req.ip,
      req.get('User-Agent')
    );

    return res.status(201).json({ success: true, data: patient });
  } catch (err) {
    if (err.status) return res.status(err.status).json({ success: false, errorCode: err.errorCode });
    next(err);
  }
}

async function list(req, res, next) {
  try {
    const { search, school, grade, page = 1, limit = 25 } = req.query;
    const result = await patientService.listPatients(
      { search, school, grade, page: parseInt(page, 10), limit: parseInt(limit, 10) },
      req.user.userId,
      req.ip,
      req.get('User-Agent')
    );
    return res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

async function getById(req, res, next) {
  try {
    const patient = await patientService.getPatient(
      req.params.id,
      req.user.userId,
      req.ip,
      req.get('User-Agent')
    );
    return res.json({ success: true, data: patient });
  } catch (err) {
    if (err.status) return res.status(err.status).json({ success: false, errorCode: err.errorCode });
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const { firstName, lastName, dateOfBirth, sex, school, grade, referredBy, parentGuardianName, parentGuardianPhone, parentGuardianEmail } = req.body;

    if (!firstName || !lastName || !dateOfBirth || !sex) {
      return res.status(400).json({ success: false, errorCode: 'PATIENT_REQUIRED_FIELDS' });
    }

    const patient = await patientService.updatePatient(
      req.params.id,
      { firstName, lastName, dateOfBirth, sex, school, grade, referredBy, parentGuardianName, parentGuardianPhone, parentGuardianEmail },
      req.user.userId,
      req.ip,
      req.get('User-Agent')
    );

    return res.json({ success: true, data: patient });
  } catch (err) {
    if (err.status) return res.status(err.status).json({ success: false, errorCode: err.errorCode });
    next(err);
  }
}

async function updateHistory(req, res, next) {
  try {
    const history = await patientService.updateHistory(
      req.params.id,
      req.body,
      req.user.userId,
      req.ip,
      req.get('User-Agent')
    );
    return res.json({ success: true, data: history });
  } catch (err) {
    if (err.status) return res.status(err.status).json({ success: false, errorCode: err.errorCode });
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    await patientService.deletePatient(
      req.params.id,
      req.user.userId,
      req.ip,
      req.get('User-Agent')
    );
    return res.json({ success: true });
  } catch (err) {
    if (err.status) return res.status(err.status).json({ success: false, errorCode: err.errorCode });
    next(err);
  }
}

module.exports = { create, list, getById, update, updateHistory, remove };
