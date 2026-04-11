const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function isValidUUID(value) {
  return UUID_REGEX.test(value);
}

function validateUUIDParam(req, res, next) {
  if (req.params.id && !isValidUUID(req.params.id)) {
    return res.status(400).json({ success: false, errorCode: 'INVALID_UUID' });
  }
  if (req.params.patientId && !isValidUUID(req.params.patientId)) {
    return res.status(400).json({ success: false, errorCode: 'INVALID_UUID' });
  }
  if (req.params.evaluationId && !isValidUUID(req.params.evaluationId)) {
    return res.status(400).json({ success: false, errorCode: 'INVALID_UUID' });
  }
  next();
}

module.exports = { isValidUUID, validateUUIDParam };
