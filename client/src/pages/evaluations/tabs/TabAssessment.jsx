import PrescriptionInput from '../../../components/forms/PrescriptionInput';
import DiagnosisSelector from '../../../components/forms/DiagnosisSelector';

const sectionStyle = {
  marginBottom: 'var(--space-lg)',
  padding: 'var(--space-md)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-md)'
};

const RECOMMENDATION_OPTIONS = [
  { key: 'visionTherapy', label: 'eval.visionTherapy' },
  { key: 'therapeuticGlasses', label: 'eval.therapeuticGlasses' },
  { key: 'reEvaluation', label: 'eval.reEvaluation' }
];

export default function TabAssessment({ data, onChange, t, language }) {
  const toggleRecommendation = (key) => {
    const current = data.recommendations || {};
    onChange('recommendations', { ...current, [key]: !current[key] });
  };

  return (
    <div>
      {/* Assessment Notes */}
      <div style={sectionStyle}>
        <h3 style={{ marginBottom: 'var(--space-md)' }}>{t('eval.assessmentNotes')}</h3>
        <textarea
          value={data.assessmentNotes || ''}
          onChange={(e) => onChange('assessmentNotes', e.target.value)}
          rows={6}
          style={{ resize: 'vertical', width: '100%' }}
          placeholder={t('eval.assessmentNotesPlaceholder')}
        />
      </div>

      {/* Diagnoses */}
      <div style={sectionStyle}>
        <h3 style={{ marginBottom: 'var(--space-md)' }}>{t('eval.diagnoses')}</h3>
        <DiagnosisSelector
          value={data.diagnoses || []}
          onChange={(v) => onChange('diagnoses', v)}
          language={language}
        />
      </div>

      {/* Plan RX */}
      <div style={sectionStyle}>
        <h3 style={{ marginBottom: 'var(--space-md)' }}>{t('eval.planRx')}</h3>
        <PrescriptionInput
          label="OD"
          value={data.planRxOd || {}}
          onChange={(v) => onChange('planRxOd', v)}
        />
        <PrescriptionInput
          label="OS"
          value={data.planRxOs || {}}
          onChange={(v) => onChange('planRxOs', v)}
        />
        <div style={{ marginTop: 'var(--space-sm)' }}>
          <label style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>ADD</label>
          <input
            type="number"
            step="0.25"
            value={data.planRxAdd || ''}
            onChange={(e) => onChange('planRxAdd', e.target.value)}
            placeholder="+0.00"
            style={{ maxWidth: '150px' }}
          />
        </div>
      </div>

      {/* Recommendations */}
      <div style={sectionStyle}>
        <h3 style={{ marginBottom: 'var(--space-md)' }}>{t('eval.recommendationsTitle')}</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)', marginBottom: 'var(--space-md)' }}>
          {RECOMMENDATION_OPTIONS.map((opt) => (
            <label
              key={opt.key}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-sm)',
                padding: 'var(--space-sm) var(--space-md)',
                borderRadius: 'var(--radius-sm)',
                border: (data.recommendations || {})[opt.key]
                  ? '1px solid var(--color-primary)'
                  : '1px solid var(--color-border)',
                backgroundColor: (data.recommendations || {})[opt.key]
                  ? 'var(--color-surface-alt)'
                  : 'var(--color-surface)',
                cursor: 'pointer',
                transition: 'all 0.15s'
              }}
            >
              <input
                type="checkbox"
                checked={(data.recommendations || {})[opt.key] || false}
                onChange={() => toggleRecommendation(opt.key)}
                style={{ width: 'auto', accentColor: 'var(--color-primary)' }}
              />
              <span style={{ fontSize: 'var(--text-base)' }}>{t(opt.label)}</span>
            </label>
          ))}
        </div>

        <div>
          <label style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>{t('eval.additionalNotes')}</label>
          <textarea
            value={data.recommendationNotes || ''}
            onChange={(e) => onChange('recommendationNotes', e.target.value)}
            rows={3}
            style={{ resize: 'vertical', width: '100%' }}
            placeholder={t('eval.additionalNotesPlaceholder')}
          />
        </div>
      </div>
    </div>
  );
}
