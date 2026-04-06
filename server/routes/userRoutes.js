const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const { ROLES } = require('../utils/constants');

router.use(authenticate);
router.use(authorize(ROLES.DOCTOR));

router.post('/', userController.createUser);
router.get('/', userController.listUsers);
router.put('/:id', userController.updateUser);
router.patch('/:id/deactivate', userController.deactivateUser);
router.patch('/:id/role', userController.changeRole);

module.exports = router;
