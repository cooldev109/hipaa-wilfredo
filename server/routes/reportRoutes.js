const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const { ROLES } = require('../utils/constants');

router.use(authenticate);
router.use(authorize(ROLES.DOCTOR));

router.post('/generate', reportController.generate);
router.get('/', reportController.list);
router.get('/:id', reportController.getById);
router.get('/:id/download', reportController.download);
router.post('/:id/sign/doctor', reportController.signDoctor);
router.post('/:id/sign/parent', reportController.signParent);
router.get('/evaluation/:evaluationId', reportController.listByEvaluation);

module.exports = router;
