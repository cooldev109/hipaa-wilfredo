const express = require('express');
const router = express.Router();
const voiceController = require('../controllers/voiceController');
const authenticate = require('../middleware/authenticate');

router.use(authenticate);
router.post('/transcribe', voiceController.uploadMiddleware, voiceController.transcribe);

module.exports = router;
