import { AlertTriangle } from 'lucide-react';

export default function ConfirmDialog({ title, message, confirmLabel = 'Confirm', cancelLabel = 'Cancel', onConfirm, onCancel, danger = false }) {
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
        width: '420px', maxWidth: '90vw',
        boxShadow: 'var(--shadow-lg)'
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 'var(--space-lg)' }}>
          <div style={{
            width: 40, height: 40, borderRadius: 'var(--radius-full)',
            backgroundColor: danger ? 'var(--color-error-bg)' : 'var(--color-warning-bg)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
          }}>
            <AlertTriangle size={20} style={{ color: danger ? 'var(--color-error)' : 'var(--color-warning)' }} />
          </div>
          <div>
            <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 600, marginBottom: 4 }}>{title}</h3>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>{message}</p>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <button onClick={onCancel} style={{
            padding: '8px 20px', backgroundColor: 'transparent',
            color: 'var(--color-text)', border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontSize: 'var(--text-sm)', fontWeight: 500
          }}>
            {cancelLabel}
          </button>
          <button onClick={onConfirm} style={{
            padding: '8px 20px',
            backgroundColor: danger ? 'var(--color-error)' : 'var(--color-primary)',
            color: 'var(--color-text-on-primary)', border: 'none',
            borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontSize: 'var(--text-sm)', fontWeight: 500
          }}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
