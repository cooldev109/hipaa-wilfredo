import VisualAcuityInput from '../../../components/forms/VisualAcuityInput';

const sectionStyle = {
  marginBottom: 'var(--space-lg)',
  padding: 'var(--space-md)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-md)'
};

const gridRow = {
  display: 'grid',
  gridTemplateColumns: '60px 1fr 1fr',
  gap: 'var(--space-sm)',
  alignItems: 'end',
  marginBottom: 'var(--space-sm)'
};

const methodOptions = ['snellen', 'lea', 'bw', 'pl'];

function VABlock({ label, prefix, data, onChange, t }) {
  return (
    <div style={sectionStyle}>
      <h3 style={{ marginBottom: 'var(--space-md)' }}>{label}</h3>

      <div style={{ marginBottom: 'var(--space-md)' }}>
        <label style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>{t('eval.method')}</label>
        <select
          value={data[`${prefix}Method`] || 'snellen'}
          onChange={(e) => onChange(`${prefix}Method`, e.target.value)}
          style={{ maxWidth: '200px' }}
        >
          {methodOptions.map((m) => (
            <option key={m} value={m}>{m.charAt(0).toUpperCase() + m.slice(1)}</option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: 'var(--space-sm)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr 1fr', gap: 'var(--space-sm)', marginBottom: 'var(--space-xs)' }}>
          <div />
          <label style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', fontWeight: 600 }}>{t('eval.aided')}</label>
          <label style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', fontWeight: 600 }}>{t('eval.unaided')}</label>
        </div>
        {['Od', 'Os', 'Ou'].map((eye) => (
          <div key={eye} style={gridRow}>
            <span style={{ fontWeight: 600, fontSize: 'var(--text-sm)', paddingBottom: '6px' }}>{eye.toUpperCase()}</span>
            <VisualAcuityInput
              value={data[`${prefix}${eye}Aided`]}
              onChange={(v) => onChange(`${prefix}${eye}Aided`, v)}
            />
            <VisualAcuityInput
              value={data[`${prefix}${eye}Unaided`]}
              onChange={(v) => onChange(`${prefix}${eye}Unaided`, v)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function TabVisualAcuity({ data, onChange, t }) {
  return (
    <div>
      <VABlock label={t('eval.vaNear')} prefix="vaNear" data={data} onChange={onChange} t={t} />
      <VABlock label={t('eval.vaDistance')} prefix="vaDistance" data={data} onChange={onChange} t={t} />

      {/* Color Vision */}
      <div style={sectionStyle}>
        <h3 style={{ marginBottom: 'var(--space-md)' }}>{t('eval.colorVision')}</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
          <div>
            <label style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>{t('eval.testName')}</label>
            <input
              value={data.colorVisionTest || 'Ishihara'}
              onChange={(e) => onChange('colorVisionTest', e.target.value)}
            />
          </div>
          <div>
            <label style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>{t('eval.result')}</label>
            <input
              value={data.colorVisionResult || ''}
              onChange={(e) => onChange('colorVisionResult', e.target.value)}
              placeholder={t('eval.colorVisionPlaceholder')}
            />
          </div>
        </div>
      </div>

      {/* Stereo */}
      <div style={sectionStyle}>
        <h3 style={{ marginBottom: 'var(--space-md)' }}>{t('eval.stereo')}</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
          <div>
            <label style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>{t('eval.testName')}</label>
            <input
              value={data.stereoTest || 'Randot'}
              onChange={(e) => onChange('stereoTest', e.target.value)}
            />
          </div>
          <div>
            <label style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>{t('eval.result')}</label>
            <input
              value={data.stereoResult || ''}
              onChange={(e) => onChange('stereoResult', e.target.value)}
              placeholder={t('eval.arcSeconds')}
            />
          </div>
        </div>
      </div>

      {/* Cover Test */}
      <div style={sectionStyle}>
        <h3 style={{ marginBottom: 'var(--space-md)' }}>{t('eval.coverTest')}</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
          <div>
            <label style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>{t('eval.distance')}</label>
            <textarea
              value={data.coverTestDistance || ''}
              onChange={(e) => onChange('coverTestDistance', e.target.value)}
              rows={3}
              style={{ resize: 'vertical' }}
            />
          </div>
          <div>
            <label style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>{t('eval.near')}</label>
            <textarea
              value={data.coverTestNear || ''}
              onChange={(e) => onChange('coverTestNear', e.target.value)}
              rows={3}
              style={{ resize: 'vertical' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
