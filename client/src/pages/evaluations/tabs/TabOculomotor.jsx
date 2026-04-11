export default function TabOculomotor({ data, onChange }) {
  const movements = [
    { key: 'rightEyeTracking', label: 'Tracking', expected: '>75' },
    { key: 'rightEyeSaccadic', label: 'Saccadic', expected: '>75' },
    { key: 'rightEyeFixation', label: 'Fixation', expected: '>75' },
    { key: 'rightEyeGlobal', label: 'Global', expected: '>75' },
  ];

  return (
    <div>
      <div style={sectionStyle}>
        <h3 style={h3Style}>RIGHTEYE READING TEST</h3>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={{ ...thStyle, textAlign: 'left', width: 160 }}>Movement</th>
              <th style={thStyle}>Score</th>
              <th style={thStyle}>Expected</th>
            </tr>
          </thead>
          <tbody>
            {movements.map((m) => (
              <tr key={m.key}>
                <td style={tdLabelStyle}>{m.label}</td>
                <td style={tdStyle}>
                  <input
                    type="number"
                    value={data[m.key] || ''}
                    onChange={(e) => onChange(m.key, e.target.value)}
                    style={cellInput}
                  />
                </td>
                <td style={tdStyle}>
                  <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>{m.expected}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
