const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const { ROLES } = require('../utils/constants');
const { validateUUIDParam } = require('../utils/validators');

router.use(authenticate);
router.use(authorize(ROLES.DOCTOR));

router.post('/generate', reportController.generate);
router.get('/', reportController.list);
router.get('/:id', validateUUIDParam, reportController.getById);
router.get('/:id/download', validateUUIDParam, reportController.download);
router.post('/:id/sign/doctor', validateUUIDParam, reportController.signDoctor);
router.post('/:id/sign/parent', validateUUIDParam, reportController.signParent);
router.get('/evaluation/:evaluationId', validateUUIDParam, reportController.listByEvaluation);

module.exports = router;
