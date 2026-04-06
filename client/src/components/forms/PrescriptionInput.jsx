export default function PrescriptionInput({ label, value = {}, onChange }) {
  const update = (field, val) => {
    onChange({ ...value, [field]: val });
  };

  return (
    <div style={{ marginBottom: 'var(--space-md)' }}>
      {label && <label style={{ marginBottom: 'var(--space-sm)', fontWeight: 500 }}>{label}</label>}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-sm)' }}>
        <div>
          <label style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>Sphere</label>
          <input
            type="number"
            step="0.25"
            value={value.sphere || ''}
            onChange={(e) => update('sphere', e.target.value)}
            placeholder="+/- 0.00"
          />
        </div>
        <div>
          <label style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>Cylinder</label>
          <input
            type="number"
            step="0.25"
            value={value.cylinder || ''}
            onChange={(e) => update('cylinder', e.target.value)}
            placeholder="+/- 0.00"
          />
        </div>
        <div>
          <label style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>Axis</label>
          <input
            type="number"
            min="0"
            max="180"
            value={value.axis || ''}
            onChange={(e) => update('axis', e.target.value)}
            placeholder="0-180"
          />
        </div>
      </div>
    </div>
  );
}
