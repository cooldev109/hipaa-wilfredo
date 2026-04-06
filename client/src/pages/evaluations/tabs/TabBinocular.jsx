import NpcInput from '../../../components/forms/NpcInput';

const sectionStyle = {
  marginBottom: 'var(--space-lg)',
  padding: 'var(--space-md)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-md)'
};

const phoriaRowStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 120px',
  gap: 'var(--space-sm)',
  alignItems: 'end',
  marginBottom: 'var(--space-md)'
};

function PhoriaInput({ label, value, direction, onValueChange, onDirectionChange, showDirection = false, t }) {
  return (
    <div style={phoriaRowStyle}>
      <div>
        <label style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>{label}</label>
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onValueChange(e.target.value)}
          placeholder={t('eval.prismDiopters')}
        />
      </div>
      {showDirection ? (
        <div>
          <label style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>{t('eval.direction')}</label>
          <select value={direction || ''} onChange={(e) => onDirectionChange(e.target.value)}>
            <option value="">{t('eval.select')}</option>
            <option value="eso">Eso</option>
            <option value="exo">Exo</option>
          </select>
        </div>
      ) : (
        <div />
      )}
    </div>
  );
}

function VergenceSection({ title, prefix, data, onChange, t }) {
  return (
    <div style={sectionStyle}>
      <h3 style={{ marginBottom: 'var(--space-md)' }}>{title}</h3>

      <NpcInput
        label={t('eval.bi')}
        blur={data[`${prefix}BiBlur`]}
        breakVal={data[`${prefix}BiBreak`]}
        recovery={data[`${prefix}BiRecovery`]}
        onBlurChange={(v) => onChange(`${prefix}BiBlur`, v)}
        onBreakChange={(v) => onChange(`${prefix}BiBreak`, v)}
        onRecoveryChange={(v) => onChange(`${prefix}BiRecovery`, v)}
      />
      <NpcInput
        label={t('eval.bo')}
        blur={data[`${prefix}BoBlur`]}
        breakVal={data[`${prefix}BoBreak`]}
        recovery={data[`${prefix}BoRecovery`]}
        onBlurChange={(v) => onChange(`${prefix}BoBlur`, v)}
        onBreakChange={(v) => onChange(`${prefix}BoBreak`, v)}
        onRecoveryChange={(v) => onChange(`${prefix}BoRecovery`, v)}
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
        <div>
          <label style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>{t('eval.bu')}</label>
          <input
            value={data[`${prefix}Bu`] || ''}
            onChange={(e) => onChange(`${prefix}Bu`, e.target.value)}
            placeholder={t('eval.prismDiopters')}
          />
        </div>
        <div>
          <label style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>{t('eval.bd')}</label>
          <input
            value={data[`${prefix}Bd`] || ''}
            onChange={(e) => onChange(`${prefix}Bd`, e.target.value)}
            placeholder={t('eval.prismDiopters')}
          />
        </div>
      </div>
    </div>
  );
}

export default function TabBinocular({ data, onChange, t }) {
  return (
    <div>
      {/* Phorias */}
      <div style={sectionStyle}>
        <h3 style={{ marginBottom: 'var(--space-md)' }}>{t('eval.phorias')}</h3>

        <PhoriaInput
          label={t('eval.distanceH')}
          value={data.phoriaDistanceH}
          direction={data.phoriaDistanceHDir}
          onValueChange={(v) => onChange('phoriaDistanceH', v)}
          onDirectionChange={(v) => onChange('phoriaDistanceHDir', v)}
          showDirection
          t={t}
        />
        <PhoriaInput
          label={t('eval.distanceV')}
          value={data.phoriaDistanceV}
          direction={data.phoriaDistanceVDir}
          onValueChange={(v) => onChange('phoriaDistanceV', v)}
          onDirectionChange={() => {}}
          t={t}
        />
        <PhoriaInput
          label={t('eval.nearH')}
          value={data.phoriaNearH}
          direction={data.phoriaNearHDir}
          onValueChange={(v) => onChange('phoriaNearH', v)}
          onDirectionChange={(v) => onChange('phoriaNearHDir', v)}
          showDirection
          t={t}
        />
        <PhoriaInput
          label={t('eval.nearV')}
          value={data.phoriaNearV}
          direction={data.phoriaNearVDir}
          onValueChange={(v) => onChange('phoriaNearV', v)}
          onDirectionChange={() => {}}
          t={t}
        />
      </div>

      {/* Vergences */}
      <VergenceSection
        title={t('eval.vergencesDistance')}
        prefix="vergDist"
        data={data}
        onChange={onChange}
        t={t}
      />
      <VergenceSection
        title={t('eval.vergencesNear')}
        prefix="vergNear"
        data={data}
        onChange={onChange}
        t={t}
      />
    </div>
  );
}
