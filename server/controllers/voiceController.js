const fs = require('fs');
const os = require('os');
const path = require('path');
const multer = require('multer');
const voiceService = require('../services/voiceService');

// Whisper accepts up to 25MB; we cap to 20MB for safety.
const MAX_BYTES = 20 * 1024 * 1024;
const ACCEPTED_MIME = /^audio\/(webm|ogg|mpeg|mp3|wav|x-wav|mp4|m4a|x-m4a)/i;

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, os.tmpdir()),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || '') || '.webm';
    cb(null, `voice-${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: MAX_BYTES },
  fileFilter: (_req, file, cb) => {
    if (ACCEPTED_MIME.test(file.mimetype)) cb(null, true);
    else cb(Object.assign(new Error('UNSUPPORTED_AUDIO_TYPE'), { status: 400 }), false);
  }
}).single('audio');

function uploadMiddleware(req, res, next) {
  upload(req, res, (err) => {
    if (!err) return next();
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ success: false, errorCode: 'AUDIO_TOO_LARGE' });
    }
    if (err.message === 'UNSUPPORTED_AUDIO_TYPE') {
      return res.status(400).json({ success: false, errorCode: 'UNSUPPORTED_AUDIO_TYPE' });
    }
    return next(err);
  });
}

async function transcribe(req, res, next) {
  let tmpPath;
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, errorCode: 'AUDIO_REQUIRED' });
    }
    tmpPath = req.file.path;
    const lang = req.body.lang === 'en' ? 'en' : 'es';

    const text = await voiceService.transcribeAndLog({
      filePath: tmpPath,
      lang,
      userId: req.user.userId,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    return res.json({ success: true, data: { text, lang } });
  } catch (err) {
    if (err.status) return res.status(err.status).json({ success: false, errorCode: err.errorCode });
    next(err);
  } finally {
    if (tmpPath) fs.unlink(tmpPath, () => { /* best-effort cleanup */ });
  }
}

module.exports = { uploadMiddleware, transcribe };
