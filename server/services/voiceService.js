const OpenAI = require('openai');
const fs = require('fs');
const auditLogModel = require('../models/auditLogModel');
const { AUDIT_ACTIONS } = require('../utils/constants');
const logger = require('../utils/logger');

let _client;
function client() {
  if (!_client) {
    if (!process.env.OPENAI_API_KEY) {
      throw { status: 500, errorCode: 'OPENAI_KEY_MISSING' };
    }
    _client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return _client;
}

/**
 * Transcribe an audio file with Whisper.
 * @param {string} filePath - path to a temp audio file (webm/ogg/mp3/wav/m4a)
 * @param {string} lang - 'es' or 'en' (defaults to 'es' since the clinic dictates in Spanish)
 * @returns {Promise<string>} the transcript text
 */
async function transcribe(filePath, lang = 'es') {
  try {
    const result = await client().audio.transcriptions.create({
      file: fs.createReadStream(filePath),
      model: 'whisper-1',
      language: lang === 'en' ? 'en' : 'es',
      response_format: 'text'
    });
    // SDK returns plain text when response_format is 'text'
    return typeof result === 'string' ? result.trim() : (result.text || '').trim();
  } catch (err) {
    logger.error({ err: { message: err.message, status: err.status } }, 'Whisper transcription failed');
    throw { status: 502, errorCode: 'TRANSCRIPTION_FAILED' };
  }
}

async function transcribeAndLog({ filePath, lang, userId, ipAddress, userAgent }) {
  const text = await transcribe(filePath, lang);
  await auditLogModel.create({
    userId,
    action: AUDIT_ACTIONS.VOICE_TRANSCRIBE,
    resource: 'voice',
    resourceId: null,
    ipAddress,
    userAgent,
    details: { lang: lang || 'es', chars: text.length }
  });
  return text;
}

module.exports = { transcribe, transcribeAndLog };
