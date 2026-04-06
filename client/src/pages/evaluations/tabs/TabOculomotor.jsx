import ScaleRating from '../../../components/forms/ScaleRating';
import NpcInput from '../../../components/forms/NpcInput';
import OdOsInput from '../../../components/forms/OdOsInput';

const sectionStyle = {
  marginBottom: 'var(--space-lg)',
  padding: 'var(--space-md)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-md)'
};

const helperText = {
  fontSize: 'var(--text-xs)',
  color: 'var(--color-text-muted)',
  marginTop: '2px'
};

export default function TabOculomotor({ data, onChange, t }) {
  return (
    <div>
      {/* Pursuits & Saccades */}
      <div style={sectionStyle}>
        <h3 style={{ marginBottom: 'var(--space-md)' }}>{t('eval.eyeMovements')}</h3>
        <ScaleRating
          label={t('eval.pursuitsOu')}
          value={data.pursuitsOu}
          onChange={(v) => onChange('pursuitsOu', v)}
        />
        <ScaleRating
          label={t('eval.saccadesOu')}
          value={data.saccadesOu}
          onChange={(v) => onChange('saccadesOu', v)}
        />
      </div>

      {/* NPC */}
      <div style={sectionStyle}>
        <h3 style={{ marginBottom: 'var(--space-md)' }}>{t('eval.npc')}</h3>
        <NpcInput
          label={t('eval.npc1')}
          blur={data.npc1Blur}
          breakVal={data.npc1Break}
          recovery={data.npc1Recovery}
          onBlurChange={(v) => onChange('npc1Blur', v)}
          onBreakChange={(v) => onChange('npc1Break', v)}
          onRecoveryChange={(v) => onChange('npc1Recovery', v)}
        />
        <NpcInput
          label={t('eval.npc2')}
          blur={data.npc2Blur}
          breakVal={data.npc2Break}
          recovery={data.npc2Recovery}
          onBlurChange={(v) => onChange('npc2Blur', v)}
          onBreakChange={(v) => onChange('npc2Break', v)}
          onRecoveryChange={(v) => onChange('npc2Recovery', v)}
        />
      </div>

      {/* NPA & Sheard's */}
      <div style={sectionStyle}>
        <h3 style={{ marginBottom: 'var(--space-md)' }}>{t('eval.accommodation')}</h3>
        <OdOsInput
          label={t('eval.npa')}
          odValue={data.npaOd}
          osValue={data.npaOs}
          onOdChange={(v) => onChange('npaOd', v)}
          onOsChange={(v) => onChange('npaOs', v)}
          placeholder="cm"
        />
        <OdOsInput
          label={t('eval.sheards')}
          odValue={data.sheardsOd}
          osValue={data.sheardsOs}
          onOdChange={(v) => onChange('sheardsOd', v)}
          onOsChange={(v) => onChange('sheardsOs', v)}
          placeholder="D"
        />

        {/* Minimum AOA */}
        <div style={{ marginBottom: 'var(--space-md)' }}>
          <label style={{ marginBottom: 'var(--space-sm)', fontWeight: 500 }}>{t('eval.minimumAoa')}</label>
          <input
            type="text"
            value={data.minimumAoa || ''}
            readOnly
            style={{
              backgroundColor: 'var(--color-surface-alt)',
              cursor: 'not-allowed',
              maxWidth: '200px'
            }}
          />
          <div style={helperText}>{t('eval.autoCalculated')}</div>
        </div>
      </div>

      {/* RightEye Scores */}
      <div style={sectionStyle}>
        <h3 style={{ marginBottom: 'var(--space-md)' }}>{t('eval.rightEyeScores')}</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
          {[
            { key: 'rightEyeGlobal', label: t('eval.global') },
            { key: 'rightEyeTracking', label: t('eval.tracking') },
            { key: 'rightEyeSaccadic', label: t('eval.saccadic') },
            { key: 'rightEyeFixation', label: t('eval.fixation') }
          ].map(({ key, label }) => (
            <div key={key}>
              <label style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>{label}</label>
              <input
                type="number"
                value={data[key] || ''}
                onChange={(e) => onChange(key, e.target.value)}
              />
              <div style={helperText}>{t('eval.expected')}: &gt;75</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
