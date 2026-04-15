import PrescriptionInput from '../../../components/forms/PrescriptionInput';

export default function TabRefraction({ data, onChange }) {
  const sections = [
    { title: 'RETINOSCOPY', odKey: 'retinoscopyOd', osKey: 'retinoscopyOs', vaPrefix: 'retinoscopy' },
    { title: 'SUBJECTIVE REFRACTION', odKey: 'subjectiveOd', osKey: 'subjectiveOs', vaPrefix: 'subjective' },
    { title: 'FINAL PRESCRIPTION', odKey: 'finalRxOd', osKey: 'finalRxOs', vaPrefix: 'finalRx' },
  ];

  return (
    <div>
      <div style={sectionStyle}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={{ ...thStyle, textAlign: 'left', width: '50%' }}>REFRACTION</th>
              <th style={{ ...thStyle, width: '50%' }}>VISUAL ACUITY</th>
            </tr>
          </thead>
          <tbody>
            {sections.map((sec) => (
              <tr key={sec.title} style={{ verticalAlign: 'top' }}>
                <td style={{ ...tdStyle, textAlign: 'left', padding: '12px 8px' }}>
                  <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--color-primary)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {sec.title}
                  </div>
                  <PrescriptionInput
                    label="OD"
                    value={data[sec.odKey] || {}}
                    onChange={(v) => onChange(sec.odKey, v)}
                  />
                  <PrescriptionInput
                    label="OS"
                    value={data[sec.osKey] || {}}
                    onChange={(v) => onChange(sec.osKey, v)}
                  />
                </td>
                <td style={{ ...tdStyle, padding: '12px 8px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center', marginTop: 28 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <label style={labelStyle}>OD 20/</label>
                      <input
                        type="text"
                        value={data[`${sec.vaPrefix}VaOd`] || ''}
                        onChange={(e) => onChange(`${sec.vaPrefix}VaOd`, e.target.value)}
                        style={cellInput}
                      />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', justifyContent: 'center' }}>
                      <label style={labelStyle}>OS 20/</label>
                      <input
                        type="text"
                        value={data[`${sec.vaPrefix}VaOs`] || ''}
                        onChange={(e) => onChange(`${sec.vaPrefix}VaOs`, e.target.value)}
                        style={cellInput}
                      />
                      <label style={{ ...labelStyle, marginLeft: 12 }}>OU 20/</label>
                      <input
                        type="text"
                        value={data[`${sec.vaPrefix}VaOu`] || ''}
                        onChange={(e) => onChange(`${sec.vaPrefix}VaOu`, e.target.value)}
                        style={cellInput}
                      />
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
