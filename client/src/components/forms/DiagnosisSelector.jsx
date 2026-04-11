import { useState } from 'react';
import { ICD10_CODES } from '../../utils/clinicalOptions';
import { Search } from 'lucide-react';

// Group codes by category
const CATEGORIES = [
  { key: 'functional', label: 'Functional Vision', codes: ['H55.81', 'H52.533', 'H52.523', 'H52.513', 'H51.11', 'H51.12', 'H51.0', 'H55.89'] },
  { key: 'refractive', label: 'Refractive', codes: ['H52.03', 'H52.01', 'H52.02', 'H52.13', 'H52.11', 'H52.12', 'H52.23', 'H52.21', 'H52.22', 'H52.33', 'H52.4', 'H52.7'] },
  { key: 'strabismus', label: 'Strabismus & Amblyopia', codes: ['H50.00', 'H50.10', 'H50.30', 'H50.40', 'H50.9', 'H53.001', 'H53.002', 'H53.003', 'H53.031', 'H53.032'] },
  { key: 'anterior', label: 'Anterior Segment', codes: ['H10.10', 'H10.45', 'H10.9', 'H11.00', 'H11.059', 'H16.009', 'H18.60', 'H04.121', 'H04.122', 'H04.123'] },
  { key: 'lens', label: 'Lens / Cataract', codes: ['H25.011', 'H25.012', 'H25.013', 'H25.041', 'H25.042', 'H25.10', 'H26.9'] },
  { key: 'glaucoma', label: 'Glaucoma', codes: ['H40.10', 'H40.11', 'H40.20', 'H40.051', 'H40.052', 'H40.053'] },
  { key: 'retina', label: 'Retina', codes: ['H35.30', 'H35.3110', 'H35.3120', 'H35.3210', 'H35.3220', 'H33.001', 'H33.002'] },
  { key: 'other', label: 'Other', codes: ['E11.319', 'E11.3211', 'E11.3212', 'H53.2', 'H53.14', 'H57.10', 'G43.909', 'R51.9', 'F90.9', 'F81.0', 'Z01.00', 'Z01.01'] }
];

export default function DiagnosisSelector({ value = [], onChange }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategory, setExpandedCategory] = useState('functional');

  const toggleDiagnosis = (code) => {
    const existing = value.find((d) => d.code === code);
    if (existing) {
      onChange(value.filter((d) => d.code !== code));
    } else {
      const icd = ICD10_CODES.find((d) => d.code === code);
      if (icd) onChange([...value, { code: icd.code, name: icd.name, active: true }]);
    }
  };

  const isSelected = (code) => value.some((d) => d.code === code);

  // Filter by search
  const filteredCodes = searchQuery.length >= 2
    ? ICD10_CODES.filter((c) =>
        c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : null;

  return (
    <div>
      {/* Selected diagnoses */}
      {value.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
          {value.map((d) => (
            <span key={d.code} style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '4px 10px', borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--color-primary)', color: 'white',
              fontSize: 'var(--text-xs)', fontWeight: 500
            }}>
              {d.code} — {d.name}
              <button
                type="button"
                onClick={() => toggleDiagnosis(d.code)}
                style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: 0, fontSize: '14px', lineHeight: 1 }}
              >×</button>
            </span>
          ))}
        </div>
      )}

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: 12 }}>
        <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search ICD-10 code or diagnosis name..."
          style={{ paddingLeft: 30, fontSize: 'var(--text-sm)' }}
        />
      </div>

      {/* Search results */}
      {filteredCodes ? (
        <div style={{ maxHeight: 250, overflowY: 'auto', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
          {filteredCodes.length === 0 ? (
            <div style={{ padding: 12, textAlign: 'center', color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>No matching codes found</div>
          ) : (
            filteredCodes.map((icd) => (
              <DiagnosisRow key={icd.code} icd={icd} selected={isSelected(icd.code)} onToggle={toggleDiagnosis} />
            ))
          )}
        </div>
      ) : (
        /* Category accordion */
        <div style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
          {CATEGORIES.map((cat) => {
            const catCodes = ICD10_CODES.filter((c) => cat.codes.includes(c.code));
            const selectedCount = catCodes.filter((c) => isSelected(c.code)).length;
            const isExpanded = expandedCategory === cat.key;

            return (
              <div key={cat.key}>
                <button
                  type="button"
                  onClick={() => setExpandedCategory(isExpanded ? null : cat.key)}
                  style={{
                    width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '8px 12px', backgroundColor: isExpanded ? 'var(--color-surface-alt)' : 'var(--color-surface)',
                    border: 'none', borderBottom: '1px solid var(--color-border)',
                    cursor: 'pointer', fontSize: 'var(--text-sm)', fontWeight: 600,
                    color: 'var(--color-text)', textAlign: 'left'
                  }}
                >
                  <span>{isExpanded ? '▼' : '▶'} {cat.label}</span>
                  {selectedCount > 0 && (
                    <span style={{
                      padding: '1px 8px', borderRadius: 'var(--radius-full)',
                      backgroundColor: 'var(--color-primary)', color: 'white',
                      fontSize: 'var(--text-xs)', fontWeight: 600
                    }}>{selectedCount}</span>
                  )}
                </button>
                {isExpanded && (
                  <div style={{ maxHeight: 220, overflowY: 'auto' }}>
                    {catCodes.map((icd) => (
                      <DiagnosisRow key={icd.code} icd={icd} selected={isSelected(icd.code)} onToggle={toggleDiagnosis} />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function DiagnosisRow({ icd, selected, onToggle }) {
  return (
    <label
      style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '6px 12px', cursor: 'pointer',
        backgroundColor: selected ? 'var(--color-surface-alt)' : 'transparent',
        borderBottom: '1px solid var(--color-border)',
        transition: 'background-color 0.1s'
      }}
      onMouseEnter={(e) => { if (!selected) e.currentTarget.style.backgroundColor = 'var(--color-surface-alt)'; }}
      onMouseLeave={(e) => { if (!selected) e.currentTarget.style.backgroundColor = 'transparent'; }}
    >
      <input
        type="checkbox"
        checked={selected}
        onChange={() => onToggle(icd.code)}
        style={{ width: 'auto', accentColor: 'var(--color-primary)' }}
      />
      <span style={{ fontWeight: 600, fontSize: 'var(--text-xs)', color: 'var(--color-primary)', minWidth: 70 }}>{icd.code}</span>
      <span style={{ fontSize: 'var(--text-sm)' }}>{icd.name}</span>
    </label>
  );
}
