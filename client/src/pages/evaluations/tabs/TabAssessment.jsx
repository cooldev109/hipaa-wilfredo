import PrescriptionInput from '../../../components/forms/PrescriptionInput';
import DiagnosisSelector from '../../../components/forms/DiagnosisSelector';
import ClinicalSelect from '../../../components/forms/ClinicalSelect';
import { RECOMMENDATION_OPTIONS, LENS_TYPE_OPTIONS } from '../../../utils/clinicalOptions';

export default function TabAssessment({ data, onChange, language }) {
  const toggleRecommendation = (key) => {
    const current = data.recommendations || {};
    onChange('recommendations', { ...current, [key]: !current[key] });
  };

  return (
    <div>
      {/* Assessment */}
      <div style={sectionStyle}>
        <h3 style={h3Style}>ASSESSMENT</h3>
        <textarea
          value={data.assessmentNotes || ''}
          onChange={(e) => onChange('assessmentNotes', e.target.value)}
          rows={6}
          style={{ resize: 'vertical', width: '100%', padding: '8px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-base)' }}
          placeholder="Clinical notes..."
        />
      </div>

      {/* Diagnoses */}
      <div style={sectionStyle}>
        <h3 style={h3Style}>DIAGNOSES (ICD-10)</h3>
        <DiagnosisSelector
          value={data.diagnoses || []}
          onChange={(v) => onChange('diagnoses', v)}
          language={language}
        />
      </div>

      {/* Plan RX */}
      <div style={sectionStyle}>
        <h3 style={h3Style}>PLAN: RX</h3>
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
        <div style={{ display: 'flex', gap: 16, marginTop: 8, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div>
            <label style={labelStyle}>ADD</label>
            <input
              type="number"
              step="0.25"
              value={data.planRxAdd || ''}
              onChange={(e) => onChange('planRxAdd', e.target.value)}
              placeholder="+0.00"
              style={{ ...cellInput, width: 120 }}
            />
          </div>
          <div style={{ flex: 1, minWidth: 200, maxWidth: 300 }}>
            <ClinicalSelect
              label="Lens Type"
              value={data.planRxLensType || ''}
              onChange={(v) => onChange('planRxLensType', v)}
              options={LENS_TYPE_OPTIONS}
              placeholder="Select lens type..."
              allowCustom
            />
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div style={sectionStyle}>
        <h3 style={h3Style}>RECOMMENDATIONS</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
          {RECOMMENDATION_OPTIONS.map((opt) => (
            <label
              key={opt.key}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 12px',
                borderRadius: 'var(--radius-sm)',
                border: (data.recommendations || {})[opt.key]
                  ? '1px solid var(--color-primary)'
                  : '1px solid var(--color-border)',
                backgroundColor: (data.recommendations || {})[opt.key]
                  ? 'var(--color-surface-alt)'
                  : 'var(--color-surface)',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              <input
                type="checkbox"
                checked={(data.recommendations || {})[opt.key] || false}
                onChange={() => toggleRecommendation(opt.key)}
                style={{ width: 'auto', accentColor: 'var(--color-primary)' }}
              />
              <span style={{ fontSize: 'var(--text-base)' }}>{opt.label}</span>
            </label>
          ))}
        </div>

        {/* Re-evaluation months */}
        {(data.recommendations || {}).reEvaluation && (
          <div style={{ marginBottom: 12 }}>
            <label style={labelStyle}>Re-evaluation in (months)</label>
            <input
              type="number"
              min="1"
              value={data.reEvaluationMonths || ''}
              onChange={(e) => onChange('reEvaluationMonths', e.target.value)}
              style={{ ...cellInput, width: 120 }}
            />
          </div>
        )}

        <div>
          <label style={labelStyle}>Additional notes</label>
          <textarea
            value={data.recommendationNotes || ''}
            onChange={(e) => onChange('recommendationNotes', e.target.value)}
            rows={3}
            style={{ resize: 'vertical', width: '100%', padding: '8px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-base)' }}
            placeholder="Additional recommendations..."
          />
        </div>
      </div>
    </div>
  );
}

const sectionStyle = { border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '14px 16px 16px', marginBottom: 16, backgroundColor: 'var(--color-surface)' };
const h3Style = { fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--color-primary)', letterSpacing: '0.8px', textTransform: 'uppercase', margin: '0 0 12px', paddingBottom: 8, borderBottom: '2px solid var(--color-primary)', display: 'block', lineHeight: 1.3 };
const tableStyle = { width: '100%', borderCollapse: 'collapse' };
const thStyle = { padding: '6px 12px', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-secondary)', textAlign: 'center', borderBottom: '2px solid var(--color-primary)' };
const tdStyle = { padding: '4px 8px', borderBottom: '1px solid var(--color-border)', textAlign: 'center' };
const tdLabelStyle = { ...tdStyle, textAlign: 'left', fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--color-text)', width: '120px' };
const cellInput = { textAlign: 'center', padding: '4px 8px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', width: '80px', fontSize: 'var(--text-base)' };
const labelStyle = { fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 4, display: 'block' };
