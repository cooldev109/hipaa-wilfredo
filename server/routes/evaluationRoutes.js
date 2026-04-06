const express = require('express');
const router = express.Router();
const evaluationController = require('../controllers/evaluationController');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const { ROLES } = require('../utils/constants');

router.use(authenticate);
router.use(authorize(ROLES.DOCTOR, ROLES.ASSISTANT));

router.post('/', evaluationController.create);
router.get('/', evaluationController.list);
router.get('/:id', evaluationController.getById);
router.put('/:id', evaluationController.update);
router.patch('/:id/auto-save', evaluationController.autoSave);
router.patch('/:id/status', evaluationController.changeStatus);
router.delete('/:id', authorize(ROLES.DOCTOR), evaluationController.remove);

module.exports = router;
