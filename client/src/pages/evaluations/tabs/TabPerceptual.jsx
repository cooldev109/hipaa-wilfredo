const GARNER_ROWS = [
  { key: 'garnerUnknown', label: 'Unknown Letters/Numbers' },
  { key: 'garnerReversed', label: 'Reversed Letters/Nums' },
  { key: 'garnerRecognition', label: 'Recognition' },
];

const BEERY_COLS = [
  { key: 'RawScore', label: 'Raw Score' },
  { key: 'ChronologicalAge', label: 'Chron. Age' },
  { key: 'PerceptualAge', label: 'Percep. Age' },
  { key: 'StandardScore', label: 'Std Score' },
  { key: 'Percentile', label: 'Percentile' },
];

function BeeryTable({ title, prefix, data, onChange }) {
  return (
    <div style={sectionStyle}>
      <h3 style={h3Style}>{title}</h3>
      <table style={tableStyle}>
        <thead>
          <tr>
            {BEERY_COLS.map((col) => (
              <th key={col.key} style={thStyle}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {BEERY_COLS.map((col) => (
              <td key={col.key} style={tdStyle}>
                <input
                  type="text"
                  value={data[`${prefix}${col.key}`] || ''}
                  onChange={(e) => onChange(`${prefix}${col.key}`, e.target.value)}
                  style={cellInput}
                />
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default function TabPerceptual({ data, onChange }) {
  return (
    <div>
      {/* Garner Reversal Test */}
      <div style={sectionStyle}>
        <h3 style={h3Style}>GARNER REVERSAL TEST</h3>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={{ ...thStyle, textAlign: 'left', width: 200 }} />
              <th style={thStyle}># Errors</th>
              <th style={thStyle}>Mean</th>
              <th style={thStyle}>SD</th>
            </tr>
          </thead>
          <tbody>
            {GARNER_ROWS.map((row) => (
              <tr key={row.key}>
                <td style={tdLabelStyle}>{row.label}</td>
                <td style={tdStyle}>
                  <input
                    type="number"
                    value={data[`${row.key}Errors`] || ''}
                    onChange={(e) => onChange(`${row.key}Errors`, e.target.value)}
                    style={cellInput}
                  />
                </td>
                <td style={tdStyle}>
                  <input
                    type="number"
                    step="0.01"
                    value={data[`${row.key}Mean`] || ''}
                    onChange={(e) => onChange(`${row.key}Mean`, e.target.value)}
                    style={cellInput}
                  />
                </td>
                <td style={tdStyle}>
                  {row.key !== 'garnerRecognition' ? (
                    <input
                      type="number"
                      step="0.01"
                      value={data[`${row.key}Sd`] || ''}
                      onChange={(e) => onChange(`${row.key}Sd`, e.target.value)}
                      style={cellInput}
                    />
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Beery VMI */}
      <BeeryTable
        title="VISUAL-MOTOR INTEGRATION (Beery VMI)"
        prefix="beeryVmi"
        data={data}
        onChange={onChange}
      />

      {/* Visual Perception */}
      <BeeryTable
        title="VISUAL PERCEPTION (Beery VP)"
        prefix="visualPerception"
        data={data}
        onChange={onChange}
      />
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
