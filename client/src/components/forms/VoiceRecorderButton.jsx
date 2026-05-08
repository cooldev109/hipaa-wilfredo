import { useState, useRef } from 'react';
import { Mic, Square, Loader2 } from 'lucide-react';
import api from '../../services/api';

/**
 * Microphone button that records audio in the browser, ships it to
 * /voice/transcribe, and calls onResult(text) with the transcript.
 *
 * Usage:
 *   <VoiceRecorderButton lang="es" onResult={(text) => onChange('field', text)} />
 *
 * If `appendMode` is true and `existingValue` is set, the new transcript is
 * appended to the existing text instead of replacing it.
 */
export default function VoiceRecorderButton({ lang = 'es', onResult, appendMode = true, existingValue = '', size = 14 }) {
  const [state, setState] = useState('idle'); // 'idle' | 'recording' | 'transcribing' | 'error'
  const [error, setError] = useState('');
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const start = async () => {
    setError('');
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError('Tu navegador no soporta grabación de audio.');
      setState('error');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Pick whichever opus codec the browser supports
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : (MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : '');
      const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      recorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        await sendBlob(new Blob(chunksRef.current, { type: recorder.mimeType || 'audio/webm' }));
      };
      mediaRecorderRef.current = recorder;
      recorder.start();
      setState('recording');
    } catch (err) {
      const msg = err && err.name === 'NotAllowedError'
        ? 'Permiso de micrófono denegado.'
        : 'No se pudo iniciar la grabación.';
      setError(msg);
      setState('error');
    }
  };

  const stop = () => {
    const r = mediaRecorderRef.current;
    if (r && r.state !== 'inactive') {
      setState('transcribing');
      r.stop();
    }
  };

  const sendBlob = async (blob) => {
    try {
      const fd = new FormData();
      const filename = `voice.${(blob.type.split('/')[1] || 'webm').split(';')[0]}`;
      fd.append('audio', blob, filename);
      fd.append('lang', lang);
      const res = await api.post('/voice/transcribe', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 60000
      });
      if (res.data && res.data.success && res.data.data && res.data.data.text) {
        const text = res.data.data.text;
        const final = appendMode && existingValue
          ? `${existingValue.trim()} ${text}`.trim()
          : text;
        onResult(final);
        setState('idle');
      } else {
        setError('Transcripción vacía.');
        setState('error');
      }
    } catch (err) {
      const code = err.response && err.response.data && err.response.data.errorCode;
      if (code === 'OPENAI_KEY_MISSING') setError('Falta configurar la API de OpenAI.');
      else if (code === 'AUDIO_TOO_LARGE') setError('El audio es demasiado largo.');
      else if (code === 'TRANSCRIPTION_FAILED') setError('Falló la transcripción. Intenta de nuevo.');
      else setError('Error al transcribir.');
      setState('error');
    }
  };

  const handleClick = () => {
    if (state === 'idle' || state === 'error') start();
    else if (state === 'recording') stop();
  };

  const isBusy = state === 'transcribing';
  const recording = state === 'recording';

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
      <button
        type="button"
        onClick={handleClick}
        disabled={isBusy}
        title={recording ? 'Detener grabación' : 'Grabar voz'}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 4,
          padding: '4px 8px',
          border: `1px solid ${recording ? 'var(--color-error)' : 'var(--color-primary)'}`,
          borderRadius: 'var(--radius-sm)',
          backgroundColor: recording ? 'var(--color-error-bg)' : 'transparent',
          color: recording ? 'var(--color-error)' : 'var(--color-primary)',
          cursor: isBusy ? 'wait' : 'pointer',
          fontSize: 'var(--text-xs)',
          fontWeight: 500
        }}
      >
        {isBusy
          ? <Loader2 size={size} style={{ animation: 'spin 1s linear infinite' }} />
          : recording
          ? <Square size={size} fill="currentColor" />
          : <Mic size={size} />}
        <span>{isBusy ? 'Transcribiendo…' : recording ? 'Detener' : 'Voz'}</span>
      </button>
      {error && <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-error)' }}>{error}</span>}
    </span>
  );
}
