const express = require('express');
const router = express.Router();
const evaluationController = require('../controllers/evaluationController');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const { ROLES } = require('../utils/constants');
const { validateUUIDParam } = require('../utils/validators');

router.use(authenticate);
router.use(authorize(ROLES.DOCTOR, ROLES.ASSISTANT));

router.post('/', evaluationController.create);
router.get('/', evaluationController.list);
router.get('/:id', validateUUIDParam, evaluationController.getById);
router.put('/:id', validateUUIDParam, evaluationController.update);
router.patch('/:id/auto-save', validateUUIDParam, evaluationController.autoSave);
router.patch('/:id/status', validateUUIDParam, evaluationController.changeStatus);
router.delete('/:id', validateUUIDParam, authorize(ROLES.DOCTOR), evaluationController.remove);

module.exports = router;
