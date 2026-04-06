import { useLanguage } from '../../hooks/useLanguage';

export default function NpcInput({ label, blur, breakVal, recovery, onBlurChange, onBreakChange, onRecoveryChange }) {
  const { t } = useLanguage();

  return (
    <div style={{ marginBottom: 'var(--space-md)' }}>
      {label && <label style={{ marginBottom: 'var(--space-sm)', fontWeight: 500 }}>{label}</label>}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-sm)' }}>
        <div>
          <label style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>{t('eval.blur')}</label>
          <input value={blur || ''} onChange={(e) => onBlurChange(e.target.value)} placeholder="cm" />
        </div>
        <div>
          <label style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>{t('eval.break')}</label>
          <input value={breakVal || ''} onChange={(e) => onBreakChange(e.target.value)} placeholder="cm" />
        </div>
        <div>
          <label style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>{t('eval.recovery')}</label>
          <input value={recovery || ''} onChange={(e) => onRecoveryChange(e.target.value)} placeholder="cm" />
        </div>
      </div>
    </div>
  );
}
