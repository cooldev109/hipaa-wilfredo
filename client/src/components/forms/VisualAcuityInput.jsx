export default function VisualAcuityInput({ label, value, onChange }) {
  return (
    <div>
      {label && <label style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>{label}</label>}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <span style={{ fontSize: 'var(--text-base)', fontWeight: 500, color: 'var(--color-text-secondary)', whiteSpace: 'nowrap' }}>20/</span>
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="20"
          style={{ width: '70px', textAlign: 'center' }}
        />
      </div>
    </div>
  );
}
