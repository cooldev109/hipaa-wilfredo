import { useState } from 'react';

export default function ClinicalSelect({ value, onChange, options, placeholder = 'Select...', allowCustom = true, label }) {
  const [showCustom, setShowCustom] = useState(false);

  const isCustom = value && !options.includes(value) && value !== '';

  const handleChange = (e) => {
    const val = e.target.value;
    if (val === '__custom__') {
      setShowCustom(true);
      onChange('');
    } else {
      setShowCustom(false);
      onChange(val);
    }
  };

  if (showCustom || (isCustom && !showCustom)) {
    return (
      <div>
        {label && <label style={labelStyle}>{label}</label>}
        <div style={{ display: 'flex', gap: 4 }}>
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Type custom value..."
            style={{ flex: 1 }}
          />
          <button
            type="button"
            onClick={() => { setShowCustom(false); onChange(''); }}
            style={backBtnStyle}
            title="Back to dropdown"
          >
            ×
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {label && <label style={labelStyle}>{label}</label>}
      <select value={value || ''} onChange={handleChange} style={{ width: '100%' }}>
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
        {allowCustom && <option value="__custom__">— Other (type custom) —</option>}
      </select>
    </div>
  );
}

const labelStyle = { fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 4, display: 'block' };
const backBtnStyle = { padding: '4px 8px', backgroundColor: 'var(--color-surface-alt)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontSize: '16px', lineHeight: 1, color: 'var(--color-text-muted)' };
