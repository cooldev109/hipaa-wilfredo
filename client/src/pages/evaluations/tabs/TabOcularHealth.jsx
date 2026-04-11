import ClinicalSelect from '../../../components/forms/ClinicalSelect';
import {
  EXT_LIDS_OPTIONS, EXT_CONJ_OPTIONS, EXT_CORNEA_OPTIONS, EXT_IRIS_OPTIONS,
  EXT_ANGLES_OPTIONS, EXT_PUPILS_OPTIONS,
  INT_LENS_OPTIONS, INT_MEDIA_OPTIONS, INT_CD_OPTIONS, INT_AV_OPTIONS, INT_MACULA_OPTIONS
} from '../../../utils/clinicalOptions';

const EXTERNAL_FIELDS = [
  { key: 'lidsLash', label: 'LIDS/LASH', options: EXT_LIDS_OPTIONS },
  { key: 'conj', label: 'CONJ.', options: EXT_CONJ_OPTIONS },
  { key: 'cornea', label: 'CORNEA', options: EXT_CORNEA_OPTIONS },
  { key: 'iris', label: 'IRIS', options: EXT_IRIS_OPTIONS },
];

const INTERNAL_FIELDS = [
  { key: 'lens', label: 'LENS', options: INT_LENS_OPTIONS },
  { key: 'media', label: 'MEDIA', options: INT_MEDIA_OPTIONS },
  { key: 'cd', label: 'C/D', options: INT_CD_OPTIONS },
  { key: 'av', label: 'A/V', options: INT_AV_OPTIONS },
  { key: 'maculaFr', label: 'MACULA/FR', options: INT_MACULA_OPTIONS },
];

const ANGLE_LABELS = ['I', 'II', 'III', 'IV'];

const NORMAL_VALUES = {};
// External normal values
NORMAL_VALUES.lidsLashOd = 'Healthy';
NORMAL_VALUES.lidsLashOs = 'Healthy';
NORMAL_VALUES.conjOd = 'Clear';
NORMAL_VALUES.conjOs = 'Clear';
NORMAL_VALUES.corneaOd = 'Clear';
NORMAL_VALUES.corneaOs = 'Clear';
NORMAL_VALUES.irisOd = 'Healthy';
NORMAL_VALUES.irisOs = 'Healthy';
NORMAL_VALUES.pupilsOd = 'PERRLA';
NORMAL_VALUES.pupilsOs = 'PERRLA';
ANGLE_LABELS.forEach((_, i) => {
  const key = ['I', 'Ii', 'Iii', 'Iv'][i];
  NORMAL_VALUES[`angles${key}Od`] = 'Open';
  NORMAL_VALUES[`angles${key}Os`] = 'Open';
});
// Internal normal values
NORMAL_VALUES.lensOd = 'Clear';
NORMAL_VALUES.lensOs = 'Clear';
NORMAL_VALUES.mediaOd = 'Clear';
NORMAL_VALUES.mediaOs = 'Clear';
NORMAL_VALUES.cdOd = '0.3';
NORMAL_VALUES.cdOs = '0.3';
NORMAL_VALUES.avOd = '2:3';
NORMAL_VALUES.avOs = '2:3';
NORMAL_VALUES.maculaFrOd = 'Flat, good reflex';
NORMAL_VALUES.maculaFrOs = 'Flat, good reflex';

export default function TabOcularHealth({ data, onChange }) {
  const handleAllNormal = () => {
    Object.entries(NORMAL_VALUES).forEach(([key, val]) => {
      onChange(key, val);
    });
  };

  return (
    <div>
      <div style={{ marginBottom: 12 }}>
        <button
          type="button"
          onClick={handleAllNormal}
          style={{
            padding: '6px 16px',
            backgroundColor: 'var(--color-surface-alt)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
            fontSize: 'var(--text-sm)',
            fontWeight: 600,
            color: 'var(--color-text)',
          }}
        >
          All Normal
        </button>
      </div>

      <div style={sectionStyle}>
        <h3 style={h3Style}>OCULAR HEALTH</h3>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          {/* External */}
          <div style={{ flex: 1, minWidth: 300 }}>
            <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--color-primary)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>EXTERNAL</div>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={{ ...thStyle, textAlign: 'left', width: 120 }} />
                  <th style={thStyle}>OD</th>
                  <th style={thStyle}>OS</th>
                </tr>
              </thead>
              <tbody>
                {EXTERNAL_FIELDS.map((f) => (
                  <tr key={f.key}>
                    <td style={tdLabelStyle}>{f.label}</td>
                    <td style={tdStyle}>
                      <ClinicalSelect
                        value={data[`${f.key}Od`] || ''}
                        onChange={(v) => onChange(`${f.key}Od`, v)}
                        options={f.options}
                        placeholder="—"
                        allowCustom
                      />
                    </td>
                    <td style={tdStyle}>
                      <ClinicalSelect
                        value={data[`${f.key}Os`] || ''}
                        onChange={(v) => onChange(`${f.key}Os`, v)}
                        options={f.options}
                        placeholder="—"
                        allowCustom
                      />
                    </td>
                  </tr>
                ))}
                {/* Angles row */}
                <tr>
                  <td style={tdLabelStyle}>ANGLES</td>
                  <td style={tdStyle} colSpan={2}>
                    <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
                      {ANGLE_LABELS.map((lbl, i) => {
                        const key = ['I', 'Ii', 'Iii', 'Iv'][i];
                        return (
                          <div key={lbl} style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', fontWeight: 600 }}>{lbl}</div>
                            <div style={{ display: 'flex', gap: 4 }}>
                              <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: 9, color: 'var(--color-text-secondary)' }}>OD</div>
                                <ClinicalSelect
                                  value={data[`angles${key}Od`] || ''}
                                  onChange={(v) => onChange(`angles${key}Od`, v)}
                                  options={EXT_ANGLES_OPTIONS}
                                  placeholder="—"
                                  allowCustom={false}
                                />
                              </div>
                              <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: 9, color: 'var(--color-text-secondary)' }}>OS</div>
                                <ClinicalSelect
                                  value={data[`angles${key}Os`] || ''}
                                  onChange={(v) => onChange(`angles${key}Os`, v)}
                                  options={EXT_ANGLES_OPTIONS}
                                  placeholder="—"
                                  allowCustom={false}
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </td>
                </tr>
                {/* Pupils row */}
                <tr>
                  <td style={tdLabelStyle}>PUPILS</td>
                  <td style={tdStyle}>
                    <ClinicalSelect
                      value={data.pupilsOd || ''}
                      onChange={(v) => onChange('pupilsOd', v)}
                      options={EXT_PUPILS_OPTIONS}
                      placeholder="—"
                      allowCustom
                    />
                  </td>
                  <td style={tdStyle}>
                    <ClinicalSelect
                      value={data.pupilsOs || ''}
                      onChange={(v) => onChange('pupilsOs', v)}
                      options={EXT_PUPILS_OPTIONS}
                      placeholder="—"
                      allowCustom
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Internal */}
          <div style={{ flex: 1, minWidth: 300 }}>
            <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--color-primary)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>INTERNAL</div>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={{ ...thStyle, textAlign: 'left', width: 120 }} />
                  <th style={thStyle}>OD</th>
                  <th style={thStyle}>OS</th>
                </tr>
              </thead>
              <tbody>
                {INTERNAL_FIELDS.map((f) => (
                  <tr key={f.key}>
                    <td style={tdLabelStyle}>{f.label}</td>
                    <td style={tdStyle}>
                      <ClinicalSelect
                        value={data[`${f.key}Od`] || ''}
                        onChange={(v) => onChange(`${f.key}Od`, v)}
                        options={f.options}
                        placeholder="—"
                        allowCustom
                      />
                    </td>
                    <td style={tdStyle}>
                      <ClinicalSelect
                        value={data[`${f.key}Os`] || ''}
                        onChange={(v) => onChange(`${f.key}Os`, v)}
                        options={f.options}
                        placeholder="—"
                        allowCustom
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

const sectionStyle = { border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: 16, marginBottom: 16 };
const h3Style = { fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--color-primary)', letterSpacing: '0.5px', textTransform: 'uppercase', margin: 0, marginBottom: 8 };
const tableStyle = { width: '100%', borderCollapse: 'collapse' };
const thStyle = { padding: '6px 12px', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-secondary)', textAlign: 'center', borderBottom: '2px solid var(--color-primary)' };
const tdStyle = { padding: '4px 8px', borderBottom: '1px solid var(--color-border)', textAlign: 'center' };
const tdLabelStyle = { ...tdStyle, textAlign: 'left', fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--color-text)', width: '120px' };
const cellInput = { textAlign: 'center', padding: '4px 8px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', width: '80px', fontSize: 'var(--text-base)' };
const labelStyle = { fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 4, display: 'block' };
