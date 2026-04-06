import { useRef, useState, useEffect } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { Eraser } from 'lucide-react';

export default function SignatureCanvas({ onSave, onCancel, title }) {
  const { t } = useLanguage();
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasContent, setHasContent] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  const getPos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if (e.touches) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  };

  const startDrawing = (e) => {
    e.preventDefault();
    const { x, y } = getPos(e);
    const ctx = canvasRef.current.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    e.preventDefault();
    const { x, y } = getPos(e);
    const ctx = canvasRef.current.getContext('2d');
    ctx.lineTo(x, y);
    ctx.stroke();
    setHasContent(true);
  };

  const stopDrawing = (e) => {
    if (e) e.preventDefault();
    setIsDrawing(false);
  };

  const clear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#1a1a1a';
    setHasContent(false);
  };

  const save = () => {
    if (!hasContent) return;
    const dataUrl = canvasRef.current.toDataURL('image/png');
    onSave(dataUrl);
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'var(--color-surface)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-lg)',
        width: '500px',
        maxWidth: '95vw',
        boxShadow: 'var(--shadow-lg)'
      }}>
        <h3 style={{ marginBottom: 'var(--space-md)' }}>{title || t('report.signHere')}</h3>

        <div style={{
          border: '2px dashed var(--color-border)',
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden',
          marginBottom: 'var(--space-md)',
          position: 'relative'
        }}>
          <canvas
            ref={canvasRef}
            width={460}
            height={200}
            style={{ display: 'block', width: '100%', cursor: 'crosshair', touchAction: 'none' }}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
          />
          {!hasContent && (
            <div style={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)',
              pointerEvents: 'none'
            }}>
              {t('report.drawSignature')}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <button onClick={clear} style={{
            display: 'flex', alignItems: 'center', gap: 'var(--space-sm)',
            padding: 'var(--space-sm) var(--space-md)',
            backgroundColor: 'transparent', color: 'var(--color-text)',
            border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)',
            cursor: 'pointer', fontSize: 'var(--text-sm)'
          }}>
            <Eraser size={14} /> {t('report.clear')}
          </button>

          <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
            <button onClick={onCancel} style={{
              padding: 'var(--space-sm) var(--space-lg)',
              backgroundColor: 'transparent', color: 'var(--color-text)',
              border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)',
              cursor: 'pointer', fontSize: 'var(--text-sm)'
            }}>
              {t('common.cancel')}
            </button>
            <button onClick={save} disabled={!hasContent} style={{
              padding: 'var(--space-sm) var(--space-lg)',
              backgroundColor: hasContent ? 'var(--color-primary)' : 'var(--color-border)',
              color: 'var(--color-text-on-primary)', border: 'none',
              borderRadius: 'var(--radius-sm)', cursor: hasContent ? 'pointer' : 'not-allowed',
              fontSize: 'var(--text-sm)', fontWeight: 500
            }}>
              {t('report.saveSignature')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
