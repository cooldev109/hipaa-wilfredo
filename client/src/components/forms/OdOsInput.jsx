export default function OdOsInput({ label, odValue, osValue, onOdChange, onOsChange, type = 'text', placeholder = '' }) {
  return (
    <div style={{ marginBottom: 'var(--space-md)' }}>
      {label && <label style={{ marginBottom: 'var(--space-sm)', fontWeight: 600 }}>{label}</label>}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
        <div>
          <label style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>OD</label>
          <input type={type} value={odValue || ''} onChange={(e) => onOdChange(e.target.value)} placeholder={placeholder} />
        </div>
        <div>
          <label style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>OS</label>
          <input type={type} value={osValue || ''} onChange={(e) => onOsChange(e.target.value)} placeholder={placeholder} />
        </div>
      </div>
    </div>
  );
}
