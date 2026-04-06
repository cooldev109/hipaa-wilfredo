const sectionStyle = {
  marginBottom: 'var(--space-lg)',
  padding: 'var(--space-md)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-md)'
};

const tableHeaderStyle = {
  display: 'grid',
  gap: 'var(--space-sm)',
  padding: 'var(--space-sm) var(--space-md)',
  backgroundColor: 'var(--color-surface-alt)',
  borderBottom: '1px solid var(--color-border)',
  fontWeight: 600,
  fontSize: 'var(--text-sm)'
};

const tableRowStyle = {
  display: 'grid',
  gap: 'var(--space-sm)',
  padding: 'var(--space-sm) var(--space-md)',
  borderBottom: '1px solid var(--color-border)',
  alignItems: 'center'
};

const EXTERNAL_FIELDS = [
  { key: 'lidsLash', label: 'eval.lidsLash' },
  { key: 'conj', label: 'eval.conj' },
  { key: 'cornea', label: 'eval.cornea' },
  { key: 'iris', label: 'eval.iris' },
  { key: 'pupils', label: 'eval.pupils' }
];

const ANGLES_FIELDS = [
  { key: 'anglesI', label: 'I' },
  { key: 'anglesIi', label: 'II' },
  { key: 'anglesIii', label: 'III' },
  { key: 'anglesIv', label: 'IV' }
];

const INTERNAL_FIELDS = [
  { key: 'lens', label: 'eval.lens' },
  { key: 'media', label: 'eval.media' },
  { key: 'cd', label: 'eval.cdRatio' },
  { key: 'av', label: 'eval.avRatio' },
  { key: 'maculaFr', label: 'eval.maculaFr' }
];

const NORMAL_VALUES = {};
[...EXTERNAL_FIELDS, ...INTERNAL_FIELDS].forEach((f) => {
  NORMAL_VALUES[`${f.key}Od`] = 'WNL';
  NORMAL_VALUES[`${f.key}Os`] = 'WNL';
});
ANGLES_FIELDS.forEach((f) => {
  NORMAL_VALUES[`${f.key}Od`] = 'Open';
  NORMAL_VALUES[`${f.key}Os`] = 'Open';
});

function HealthTable({ fields, data, onChange, t, cols = '150px 1fr 1fr' }) {
  return (
    <div style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', overflow: 'hidden', marginBottom: 'var(--space-md)' }}>
      <div style={{ ...tableHeaderStyle, gridTemplateColumns: cols }}>
        <span>{t('eval.structure')}</span>
        <span>OD</span>
        <span>OS</span>
      </div>
      {fields.map((field) => (
        <div key={field.key} style={{ ...tableRowStyle, gridTemplateColumns: cols }}>
          <span style={{ fontSize: 'var(--text-sm)', fontWeight: 500 }}>{t(field.label)}</span>
          <input
            value={data[`${field.key}Od`] || ''}
            onChange={(e) => onChange(`${field.key}Od`, e.target.value)}
          />
          <input
            value={data[`${field.key}Os`] || ''}
            onChange={(e) => onChange(`${field.key}Os`, e.target.value)}
          />
        </div>
      ))}
    </div>
  );
}

export default function TabOcularHealth({ data, onChange, t }) {
  const handleAllNormal = () => {
    Object.entries(NORMAL_VALUES).forEach(([key, val]) => {
      onChange(key, val);
    });
  };

  return (
    <div>
      {/* Quick Fill */}
      <div style={{ marginBottom: 'var(--space-lg)' }}>
        <button
          type="button"
          onClick={handleAllNormal}
          style={{
            padding: 'var(--space-sm) var(--space-lg)',
            backgroundColor: 'var(--color-surface-alt)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
            fontSize: 'var(--text-sm)',
            fontWeight: 500,
            color: 'var(--color-text)'
          }}
        >
          {t('eval.allNormal')}
        </button>
      </div>

      {/* External */}
      <div style={sectionStyle}>
        <h3 style={{ marginBottom: 'var(--space-md)' }}>{t('eval.external')}</h3>
        <HealthTable fields={EXTERNAL_FIELDS} data={data} onChange={onChange} t={t} />

        <h4 style={{ marginBottom: 'var(--space-sm)', fontSize: 'var(--text-sm)' }}>{t('eval.angles')}</h4>
        <HealthTable fields={ANGLES_FIELDS} data={data} onChange={onChange} t={t} cols="150px 1fr 1fr" />
      </div>

      {/* Internal */}
      <div style={sectionStyle}>
        <h3 style={{ marginBottom: 'var(--space-md)' }}>{t('eval.internal')}</h3>
        <HealthTable fields={INTERNAL_FIELDS} data={data} onChange={onChange} t={t} />
      </div>
    </div>
  );
}
