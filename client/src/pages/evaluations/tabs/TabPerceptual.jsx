import ScoredTestTable from '../../../components/forms/ScoredTestTable';

const sectionStyle = {
  marginBottom: 'var(--space-lg)',
  padding: 'var(--space-md)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-md)'
};

const garnerHeaderStyle = {
  display: 'grid',
  gridTemplateColumns: '140px 1fr 1fr 1fr',
  gap: 'var(--space-sm)',
  padding: 'var(--space-sm) var(--space-md)',
  backgroundColor: 'var(--color-surface-alt)',
  borderBottom: '1px solid var(--color-border)',
  fontWeight: 600,
  fontSize: 'var(--text-sm)'
};

const garnerRowStyle = {
  display: 'grid',
  gridTemplateColumns: '140px 1fr 1fr 1fr',
  gap: 'var(--space-sm)',
  padding: 'var(--space-sm) var(--space-md)',
  borderBottom: '1px solid var(--color-border)',
  alignItems: 'center'
};

const GARNER_ROWS = [
  { key: 'garnerUnknown', label: 'eval.unknown' },
  { key: 'garnerReversed', label: 'eval.reversed' },
  { key: 'garnerRecognition', label: 'eval.recognition' }
];

export default function TabPerceptual({ data, onChange, t }) {
  return (
    <div>
      {/* Garner Reversal Test */}
      <div style={sectionStyle}>
        <h3 style={{ marginBottom: 'var(--space-md)' }}>{t('eval.garnerReversalTest')}</h3>
        <div style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
          <div style={garnerHeaderStyle}>
            <span />
            <span>{t('eval.errors')}</span>
            <span>{t('eval.mean')}</span>
            <span>{t('eval.sd')}</span>
          </div>
          {GARNER_ROWS.map((row) => (
            <div key={row.key} style={garnerRowStyle}>
              <span style={{ fontSize: 'var(--text-sm)', fontWeight: 500 }}>{t(row.label)}</span>
              <input
                type="number"
                value={data[`${row.key}Errors`] || ''}
                onChange={(e) => onChange(`${row.key}Errors`, e.target.value)}
              />
              <input
                type="number"
                step="0.01"
                value={data[`${row.key}Mean`] || ''}
                onChange={(e) => onChange(`${row.key}Mean`, e.target.value)}
              />
              <input
                type="number"
                step="0.01"
                value={data[`${row.key}Sd`] || ''}
                onChange={(e) => onChange(`${row.key}Sd`, e.target.value)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Beery VMI */}
      <div style={sectionStyle}>
        <h3 style={{ marginBottom: 'var(--space-md)' }}>{t('eval.beeryVmi')}</h3>
        <ScoredTestTable
          title={t('eval.beeryVmi')}
          rawScore={data.beeryVmiRawScore}
          chronologicalAge={data.beeryVmiChronologicalAge}
          perceptualAge={data.beeryVmiPerceptualAge}
          standardScore={data.beeryVmiStandardScore}
          percentile={data.beeryVmiPercentile}
          onRawScoreChange={(v) => onChange('beeryVmiRawScore', v)}
          onChronologicalAgeChange={(v) => onChange('beeryVmiChronologicalAge', v)}
          onPerceptualAgeChange={(v) => onChange('beeryVmiPerceptualAge', v)}
          onStandardScoreChange={(v) => onChange('beeryVmiStandardScore', v)}
          onPercentileChange={(v) => onChange('beeryVmiPercentile', v)}
        />
      </div>

      {/* Visual Perception */}
      <div style={sectionStyle}>
        <h3 style={{ marginBottom: 'var(--space-md)' }}>{t('eval.visualPerception')}</h3>
        <ScoredTestTable
          title={t('eval.visualPerception')}
          rawScore={data.visualPerceptionRawScore}
          chronologicalAge={data.visualPerceptionChronologicalAge}
          perceptualAge={data.visualPerceptionPerceptualAge}
          standardScore={data.visualPerceptionStandardScore}
          percentile={data.visualPerceptionPercentile}
          onRawScoreChange={(v) => onChange('visualPerceptionRawScore', v)}
          onChronologicalAgeChange={(v) => onChange('visualPerceptionChronologicalAge', v)}
          onPerceptualAgeChange={(v) => onChange('visualPerceptionPerceptualAge', v)}
          onStandardScoreChange={(v) => onChange('visualPerceptionStandardScore', v)}
          onPercentileChange={(v) => onChange('visualPerceptionPercentile', v)}
        />
      </div>
    </div>
  );
}
