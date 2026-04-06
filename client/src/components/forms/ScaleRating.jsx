export default function ScaleRating({ label, value, onChange }) {
  const options = [4, 3, 2, 1];

  return (
    <div style={{ marginBottom: 'var(--space-md)' }}>
      {label && <label style={{ marginBottom: 'var(--space-sm)' }}>{label}</label>}
      <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            style={{
              width: '44px',
              height: '40px',
              borderRadius: 'var(--radius-sm)',
              border: value === opt ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
              backgroundColor: value === opt ? 'var(--color-primary)' : 'var(--color-surface)',
              color: value === opt ? 'var(--color-text-on-primary)' : 'var(--color-text)',
              fontSize: 'var(--text-base)',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s'
            }}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
