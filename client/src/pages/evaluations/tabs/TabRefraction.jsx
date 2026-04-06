import PrescriptionInput from '../../../components/forms/PrescriptionInput';
import VisualAcuityInput from '../../../components/forms/VisualAcuityInput';

const sectionStyle = {
  marginBottom: 'var(--space-lg)',
  padding: 'var(--space-md)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-md)'
};

const vaGridStyle = {
  display: 'grid',
  gridTemplateColumns: '60px 1fr 1fr 1fr',
  gap: 'var(--space-sm)',
  alignItems: 'end',
  marginBottom: 'var(--space-sm)'
};

function PostRefractionVA({ label, prefix, data, onChange }) {
  return (
    <div style={{ marginBottom: 'var(--space-md)' }}>
      <label style={{ fontSize: 'var(--text-sm)', fontWeight: 600, marginBottom: 'var(--space-sm)', display: 'block' }}>{label}</label>
      {['Od', 'Os', 'Ou'].map((eye) => (
        <div key={eye} style={vaGridStyle}>
          <span style={{ fontWeight: 600, fontSize: 'var(--text-sm)', paddingBottom: '6px' }}>{eye.toUpperCase()}</span>
          <VisualAcuityInput
            label="Distance"
            value={data[`${prefix}Va${eye}Distance`]}
            onChange={(v) => onChange(`${prefix}Va${eye}Distance`, v)}
          />
          <VisualAcuityInput
            label="Near"
            value={data[`${prefix}Va${eye}Near`]}
            onChange={(v) => onChange(`${prefix}Va${eye}Near`, v)}
          />
          <div />
        </div>
      ))}
    </div>
  );
}

export default function TabRefraction({ data, onChange, t }) {
  return (
    <div>
      {/* Retinoscopy */}
      <div style={sectionStyle}>
        <h3 style={{ marginBottom: 'var(--space-md)' }}>{t('eval.retinoscopy')}</h3>
        <PrescriptionInput
          label="OD"
          value={data.retinoscopyOd || {}}
          onChange={(v) => onChange('retinoscopyOd', v)}
        />
        <PrescriptionInput
          label="OS"
          value={data.retinoscopyOs || {}}
          onChange={(v) => onChange('retinoscopyOs', v)}
        />
      </div>

      {/* Subjective Refraction */}
      <div style={sectionStyle}>
        <h3 style={{ marginBottom: 'var(--space-md)' }}>{t('eval.subjectiveRefraction')}</h3>
        <PrescriptionInput
          label="OD"
          value={data.subjectiveOd || {}}
          onChange={(v) => onChange('subjectiveOd', v)}
        />
        <PrescriptionInput
          label="OS"
          value={data.subjectiveOs || {}}
          onChange={(v) => onChange('subjectiveOs', v)}
        />
      </div>

      {/* Final Prescription */}
      <div style={sectionStyle}>
        <h3 style={{ marginBottom: 'var(--space-md)' }}>{t('eval.finalPrescription')}</h3>
        <PrescriptionInput
          label="OD"
          value={data.finalRxOd || {}}
          onChange={(v) => onChange('finalRxOd', v)}
        />
        <PrescriptionInput
          label="OS"
          value={data.finalRxOs || {}}
          onChange={(v) => onChange('finalRxOs', v)}
        />
        <div style={{ marginTop: 'var(--space-sm)' }}>
          <label style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>ADD</label>
          <input
            type="number"
            step="0.25"
            value={data.finalRxAdd || ''}
            onChange={(e) => onChange('finalRxAdd', e.target.value)}
            placeholder="+0.00"
            style={{ maxWidth: '150px' }}
          />
        </div>
      </div>

      {/* Post-Refraction VA */}
      <div style={sectionStyle}>
        <h3 style={{ marginBottom: 'var(--space-md)' }}>{t('eval.postRefractionVa')}</h3>
        <PostRefractionVA label={t('eval.retinoscopy')} prefix="retinoscopy" data={data} onChange={onChange} />
        <PostRefractionVA label={t('eval.subjectiveRefraction')} prefix="subjective" data={data} onChange={onChange} />
        <PostRefractionVA label={t('eval.finalPrescription')} prefix="finalRx" data={data} onChange={onChange} />
      </div>
    </div>
  );
}
