import { useLanguage } from '../../hooks/useLanguage';

export default function ScoredTestTable({ title, rawScore, chronologicalAge, perceptualAge, standardScore, percentile, onRawScoreChange, onChronologicalAgeChange, onPerceptualAgeChange, onStandardScoreChange, onPercentileChange }) {
  const { t } = useLanguage();

  return (
    <div style={{
      marginBottom: 'var(--space-lg)',
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden'
    }}>
      <div style={{
        backgroundColor: 'var(--color-surface-alt)',
        padding: 'var(--space-sm) var(--space-md)',
        fontWeight: 600,
        fontSize: 'var(--text-sm)',
        borderBottom: '1px solid var(--color-border)'
      }}>
        {title}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 'var(--space-sm)', padding: 'var(--space-md)' }}>
        <div>
          <label style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>{t('eval.rawScore')}</label>
          <input type="number" value={rawScore || ''} onChange={(e) => onRawScoreChange(e.target.value)} />
        </div>
        <div>
          <label style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>{t('eval.chronologicalAge')}</label>
          <input value={chronologicalAge || ''} onChange={(e) => onChronologicalAgeChange(e.target.value)} placeholder="Xa Ym" />
        </div>
        <div>
          <label style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>{t('eval.perceptualAge')}</label>
          <input value={perceptualAge || ''} onChange={(e) => onPerceptualAgeChange(e.target.value)} placeholder="Xa Ym" />
        </div>
        <div>
          <label style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>{t('eval.standardScore')}</label>
          <input type="number" value={standardScore || ''} onChange={(e) => onStandardScoreChange(e.target.value)} />
        </div>
        <div>
          <label style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>{t('eval.percentile')}</label>
          <input type="number" value={percentile || ''} onChange={(e) => onPercentileChange(e.target.value)} />
        </div>
      </div>
    </div>
  );
}
