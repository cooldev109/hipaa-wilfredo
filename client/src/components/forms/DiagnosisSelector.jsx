const ICD10_CODES = [
  { code: 'H55.81', name: 'Oculomotor Dysfunction', nameEs: 'Disfunción Oculomotora' },
  { code: 'H52.533', name: 'Accommodative Insufficiency', nameEs: 'Insuficiencia de Acomodación' },
  { code: 'H51.11', name: 'Convergence Insufficiency', nameEs: 'Insuficiencia de Convergencia' },
  { code: 'H51.12', name: 'Convergence Excess', nameEs: 'Exceso de Convergencia' },
  { code: 'H52.13', name: 'Myopia', nameEs: 'Miopía' },
  { code: 'H52.03', name: 'Hyperopia', nameEs: 'Hipermetropía' },
  { code: 'H52.23', name: 'Astigmatism', nameEs: 'Astigmatismo' }
];

export default function DiagnosisSelector({ value = [], onChange, language = 'en' }) {
  const toggleDiagnosis = (code) => {
    const existing = value.find((d) => d.code === code);
    if (existing) {
      onChange(value.filter((d) => d.code !== code));
    } else {
      const icd = ICD10_CODES.find((d) => d.code === code);
      onChange([...value, { code: icd.code, name: icd.name, active: true }]);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
      {ICD10_CODES.map((icd) => {
        const isSelected = value.some((d) => d.code === icd.code);
        return (
          <label
            key={icd.code}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-sm)',
              padding: 'var(--space-sm) var(--space-md)',
              borderRadius: 'var(--radius-sm)',
              border: isSelected ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
              backgroundColor: isSelected ? 'var(--color-surface-alt)' : 'var(--color-surface)',
              cursor: 'pointer',
              transition: 'all 0.15s'
            }}
          >
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => toggleDiagnosis(icd.code)}
              style={{ width: 'auto', accentColor: 'var(--color-primary)' }}
            />
            <span style={{ fontWeight: 500, fontSize: 'var(--text-sm)', color: 'var(--color-primary)', minWidth: '65px' }}>
              {icd.code}
            </span>
            <span style={{ fontSize: 'var(--text-base)' }}>
              {language === 'es' ? icd.nameEs : icd.name}
            </span>
          </label>
        );
      })}
    </div>
  );
}
