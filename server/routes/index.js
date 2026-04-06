const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const patientRoutes = require('./patientRoutes');
const evaluationRoutes = require('./evaluationRoutes');
const reportRoutes = require('./reportRoutes');
const userRoutes = require('./userRoutes');
const dashboardController = require('../controllers/dashboardController');
const authenticate = require('../middleware/authenticate');

router.use('/auth', authRoutes);
router.get('/dashboard/stats', authenticate, dashboardController.getStats);
router.use('/patients', patientRoutes);
router.use('/evaluations', evaluationRoutes);
router.use('/reports', reportRoutes);
router.use('/users', userRoutes);

module.exports = router;
