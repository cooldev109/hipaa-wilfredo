const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const evaluationController = require('../controllers/evaluationController');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const { ROLES } = require('../utils/constants');

router.use(authenticate);

router.post('/', patientController.create);
router.get('/', patientController.list);
router.get('/:id', patientController.getById);
router.put('/:id', patientController.update);
router.put('/:id/history', authorize(ROLES.DOCTOR, ROLES.ASSISTANT), patientController.updateHistory);
router.delete('/:id', authorize(ROLES.DOCTOR), patientController.remove);
router.get('/:patientId/evaluations', authorize(ROLES.DOCTOR, ROLES.ASSISTANT), evaluationController.listByPatient);

module.exports = router;
