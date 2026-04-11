import { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success', duration = 4000) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    if (duration > 0) {
      setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = {
    success: (msg) => addToast(msg, 'success'),
    error: (msg) => addToast(msg, 'error', 6000),
    info: (msg) => addToast(msg, 'info')
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

function ToastContainer({ toasts, onRemove }) {
  if (toasts.length === 0) return null;

  return (
    <div style={{
      position: 'fixed', top: 16, right: 16, zIndex: 9999,
      display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 380
    }}>
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onRemove={() => onRemove(t.id)} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onRemove }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  const config = {
    success: { bg: 'var(--color-success-bg)', color: 'var(--color-success)', border: 'var(--color-success)', icon: <CheckCircle size={18} /> },
    error: { bg: 'var(--color-error-bg)', color: 'var(--color-error)', border: 'var(--color-error)', icon: <AlertCircle size={18} /> },
    info: { bg: 'var(--color-info-bg)', color: 'var(--color-info)', border: 'var(--color-info)', icon: <Info size={18} /> }
  };

  const c = config[toast.type] || config.info;

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '12px 16px',
      backgroundColor: c.bg, color: c.color,
      border: `1px solid ${c.border}`,
      borderRadius: 'var(--radius-md)',
      boxShadow: 'var(--shadow-md)',
      fontSize: 'var(--text-sm)', fontWeight: 500,
      transform: visible ? 'translateX(0)' : 'translateX(100%)',
      opacity: visible ? 1 : 0,
      transition: 'all 0.3s ease'
    }}>
      {c.icon}
      <span style={{ flex: 1 }}>{toast.message}</span>
      <button onClick={onRemove} style={{ background: 'none', border: 'none', cursor: 'pointer', color: c.color, padding: 0 }}>
        <X size={14} />
      </button>
    </div>
  );
}
