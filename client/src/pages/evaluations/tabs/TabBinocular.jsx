import ClinicalSelect from '../../../components/forms/ClinicalSelect';
import { PHORIA_H_OPTIONS, PHORIA_V_OPTIONS } from '../../../utils/clinicalOptions';

export default function TabBinocular({ data, onChange }) {
  return (
    <div>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        {/* Phorias */}
        <div style={{ ...sectionStyle, flex: 1, minWidth: 280 }}>
          <h3 style={h3Style}>PHORIAS</h3>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={{ ...thStyle, textAlign: 'left', width: 100 }} />
                <th style={thStyle}>H:</th>
                <th style={thStyle}>V:</th>
              </tr>
            </thead>
            <tbody>
              {['Distance', 'Near'].map((dist) => (
                <tr key={dist}>
                  <td style={tdLabelStyle}>{dist.toUpperCase()}</td>
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', gap: 4, justifyContent: 'center', alignItems: 'center' }}>
                      <ClinicalSelect
                        value={data[`phoria${dist}HType`] || ''}
                        onChange={(v) => onChange(`phoria${dist}HType`, v)}
                        options={PHORIA_H_OPTIONS}
                        placeholder="—"
                        allowCustom={false}
                      />
                      <input
                        type="number"
                        value={data[`phoria${dist}HAmount`] || ''}
                        onChange={(e) => onChange(`phoria${dist}HAmount`, e.target.value)}
                        placeholder="0"
                        style={{ ...cellInput, width: 50 }}
                      />
                    </div>
                  </td>
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', gap: 4, justifyContent: 'center', alignItems: 'center' }}>
                      <ClinicalSelect
                        value={data[`phoria${dist}VType`] || ''}
                        onChange={(v) => onChange(`phoria${dist}VType`, v)}
                        options={PHORIA_V_OPTIONS}
                        placeholder="—"
                        allowCustom={false}
                      />
                      <input
                        type="number"
                        value={data[`phoria${dist}VAmount`] || ''}
                        onChange={(e) => onChange(`phoria${dist}VAmount`, e.target.value)}
                        placeholder="0"
                        style={{ ...cellInput, width: 50 }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Vergences */}
        <div style={{ ...sectionStyle, flex: 1.5, minWidth: 400 }}>
          <h3 style={h3Style}>VERGENCES</h3>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={{ ...thStyle, textAlign: 'left', width: 100 }} />
                <th style={thStyle} colSpan={2}>BI:</th>
                <th style={thStyle} colSpan={2}>BU:</th>
              </tr>
            </thead>
            <tbody>
              {/* Distance BI / BU */}
              <tr>
                <td style={tdLabelStyle} rowSpan={2}>DISTANCE</td>
                <td style={tdStyle} colSpan={2}>
                  <div style={{ display: 'flex', gap: 4, justifyContent: 'center', flexWrap: 'wrap' }}>
                    {['Blur', 'Break', 'Rec'].map((f) => (
                      <div key={f} style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>{f}</div>
                        <input
                          type="text"
                          value={data[`vergDistBi${f === 'Rec' ? 'Recovery' : f}`] || ''}
                          onChange={(e) => onChange(`vergDistBi${f === 'Rec' ? 'Recovery' : f}`, e.target.value)}
                          style={{ ...cellInput, width: 50 }}
                        />
                      </div>
                    ))}
                  </div>
                </td>
                <td style={tdStyle} colSpan={2}>
                  <input
                    type="text"
                    value={data.vergDistBu || ''}
                    onChange={(e) => onChange('vergDistBu', e.target.value)}
                    style={cellInput}
                  />
                </td>
              </tr>
              {/* Distance BO / BD */}
              <tr>
                <td style={tdStyle} colSpan={2}>
                  <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 2 }}>BO:</div>
                  <div style={{ display: 'flex', gap: 4, justifyContent: 'center', flexWrap: 'wrap' }}>
                    {['Blur', 'Break', 'Rec'].map((f) => (
                      <div key={f} style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>{f}</div>
                        <input
                          type="text"
                          value={data[`vergDistBo${f === 'Rec' ? 'Recovery' : f}`] || ''}
                          onChange={(e) => onChange(`vergDistBo${f === 'Rec' ? 'Recovery' : f}`, e.target.value)}
                          style={{ ...cellInput, width: 50 }}
                        />
                      </div>
                    ))}
                  </div>
                </td>
                <td style={tdStyle} colSpan={2}>
                  <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 2 }}>BD:</div>
                  <input
                    type="text"
                    value={data.vergDistBd || ''}
                    onChange={(e) => onChange('vergDistBd', e.target.value)}
                    style={cellInput}
                  />
                </td>
              </tr>
              {/* Near BI / BU */}
              <tr>
                <td style={tdLabelStyle} rowSpan={2}>NEAR</td>
                <td style={tdStyle} colSpan={2}>
                  <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 2 }}>BI:</div>
                  <div style={{ display: 'flex', gap: 4, justifyContent: 'center', flexWrap: 'wrap' }}>
                    {['Blur', 'Break', 'Rec'].map((f) => (
                      <div key={f} style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>{f}</div>
                        <input
                          type="text"
                          value={data[`vergNearBi${f === 'Rec' ? 'Recovery' : f}`] || ''}
                          onChange={(e) => onChange(`vergNearBi${f === 'Rec' ? 'Recovery' : f}`, e.target.value)}
                          style={{ ...cellInput, width: 50 }}
                        />
                      </div>
                    ))}
                  </div>
                </td>
                <td style={tdStyle} colSpan={2}>
                  <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 2 }}>BU:</div>
                  <input
                    type="text"
                    value={data.vergNearBu || ''}
                    onChange={(e) => onChange('vergNearBu', e.target.value)}
                    style={cellInput}
                  />
                </td>
              </tr>
              {/* Near BO / BD */}
              <tr>
                <td style={tdStyle} colSpan={2}>
                  <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 2 }}>BO:</div>
                  <div style={{ display: 'flex', gap: 4, justifyContent: 'center', flexWrap: 'wrap' }}>
                    {['Blur', 'Break', 'Rec'].map((f) => (
                      <div key={f} style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>{f}</div>
                        <input
                          type="text"
                          value={data[`vergNearBo${f === 'Rec' ? 'Recovery' : f}`] || ''}
                          onChange={(e) => onChange(`vergNearBo${f === 'Rec' ? 'Recovery' : f}`, e.target.value)}
                          style={{ ...cellInput, width: 50 }}
                        />
                      </div>
                    ))}
                  </div>
                </td>
                <td style={tdStyle} colSpan={2}>
                  <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 2 }}>BD:</div>
                  <input
                    type="text"
                    value={data.vergNearBd || ''}
                    onChange={(e) => onChange('vergNearBd', e.target.value)}
                    style={cellInput}
                  />
                </td>
              </tr>
            </tbody>
          </table>
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
