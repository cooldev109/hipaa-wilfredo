import ClinicalSelect from '../../../components/forms/ClinicalSelect';
import { VA_OPTIONS, COLOR_VISION_OPTIONS, STEREO_OPTIONS, COVER_TEST_OPTIONS } from '../../../utils/clinicalOptions';

export default function TabVisualAcuity({ data, onChange }) {
  const methods = ['Snellen', 'LEA', 'BW', 'PL'];

  const renderVATable = (title, prefix) => (
    <div style={sectionStyle}>
      <h3 style={h3Style}>{title}</h3>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        {methods.map((m) => (
          <label key={m} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 'var(--text-sm)', cursor: 'pointer' }}>
            <input
              type="radio"
              name={`${prefix}Method`}
              value={m.toLowerCase()}
              checked={(data[`${prefix}Method`] || 'snellen') === m.toLowerCase()}
              onChange={(e) => onChange(`${prefix}Method`, e.target.value)}
              style={{ width: 'auto' }}
            />
            {m}
          </label>
        ))}
      </div>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={{ ...thStyle, textAlign: 'left', width: 120 }} />
            <th style={thStyle}>OD</th>
            <th style={thStyle}>OS</th>
            <th style={thStyle}>OU</th>
          </tr>
        </thead>
        <tbody>
          {['Aided', 'Unaided'].map((row) => (
            <tr key={row}>
              <td style={tdLabelStyle}>{row.toUpperCase()}</td>
              {['Od', 'Os', 'Ou'].map((eye) => (
                <td key={eye} style={tdStyle}>
                  <select
                    value={data[`${prefix}${eye}${row}`] || ''}
                    onChange={(e) => onChange(`${prefix}${eye}${row}`, e.target.value)}
                    style={cellSelect}
                  >
                    <option value="">—</option>
                    {VA_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div>
      {renderVATable('NEAR VA', 'vaNear')}
      {renderVATable('DISTANCE VA', 'vaDistance')}

      {/* Color Vision & Stereo */}
      <div style={sectionStyle}>
        <h3 style={h3Style}>COLOR VISION</h3>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 12 }}>
          <div style={{ flex: 1, minWidth: 160 }}>
            <label style={labelStyle}>Test</label>
            <input
              type="text"
              value={data.colorVisionTest || 'Ishihara'}
              onChange={(e) => onChange('colorVisionTest', e.target.value)}
              style={{ width: '100%' }}
            />
          </div>
          <div style={{ flex: 1, minWidth: 160 }}>
            <ClinicalSelect
              label="Results"
              value={data.colorVisionResult || ''}
              onChange={(v) => onChange('colorVisionResult', v)}
              options={COLOR_VISION_OPTIONS}
              placeholder="Select result..."
              allowCustom
            />
          </div>
        </div>

        <h3 style={{ ...h3Style, marginTop: 16 }}>STEREO</h3>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 160 }}>
            <label style={labelStyle}>Test</label>
            <input
              type="text"
              value={data.stereoTest || 'Randot'}
              onChange={(e) => onChange('stereoTest', e.target.value)}
              style={{ width: '100%' }}
            />
          </div>
          <div style={{ flex: 1, minWidth: 160 }}>
            <ClinicalSelect
              label="Results (arc sec)"
              value={data.stereoResult || ''}
              onChange={(v) => onChange('stereoResult', v)}
              options={STEREO_OPTIONS}
              placeholder="Select result..."
              allowCustom
            />
          </div>
        </div>
      </div>

      {/* Cover Test */}
      <div style={sectionStyle}>
        <h3 style={h3Style}>COVER TEST</h3>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
              <div style={{ flex: 1 }}>
                <ClinicalSelect
                  label="Distance"
                  value={data.coverTestDistanceType || ''}
                  onChange={(v) => onChange('coverTestDistanceType', v)}
                  options={COVER_TEST_OPTIONS}
                  placeholder="Select..."
                  allowCustom
                />
              </div>
              <div style={{ width: 80 }}>
                <label style={labelStyle}>PD</label>
                <input
                  type="number"
                  value={data.coverTestDistancePd || ''}
                  onChange={(e) => onChange('coverTestDistancePd', e.target.value)}
                  placeholder="0"
                  style={cellInput}
                />
              </div>
            </div>
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
              <div style={{ flex: 1 }}>
                <ClinicalSelect
                  label="Near"
                  value={data.coverTestNearType || ''}
                  onChange={(v) => onChange('coverTestNearType', v)}
                  options={COVER_TEST_OPTIONS}
                  placeholder="Select..."
                  allowCustom
                />
              </div>
              <div style={{ width: 80 }}>
                <label style={labelStyle}>PD</label>
                <input
                  type="number"
                  value={data.coverTestNearPd || ''}
                  onChange={(e) => onChange('coverTestNearPd', e.target.value)}
                  placeholder="0"
                  style={cellInput}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pursuits & Saccades */}
      <div style={sectionStyle}>
        <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', marginBottom: 12 }}>
          <div>
            <h3 style={h3Style}>PURSUITS OU</h3>
            <div style={{ display: 'flex', gap: 6 }}>
              {[4, 3, 2, 1].map((n) => (
                <label key={n} style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 'var(--text-sm)', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="pursuitsOu"
                    value={n}
                    checked={Number(data.pursuitsOu) === n}
                    onChange={() => onChange('pursuitsOu', n)}
                    style={{ width: 'auto' }}
                  />
                  {n}
                </label>
              ))}
            </div>
          </div>
          <div>
            <h3 style={h3Style}>SACCADES OU</h3>
            <div style={{ display: 'flex', gap: 6 }}>
              {[4, 3, 2, 1].map((n) => (
                <label key={n} style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 'var(--text-sm)', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="saccadesOu"
                    value={n}
                    checked={Number(data.saccadesOu) === n}
                    onChange={() => onChange('saccadesOu', n)}
                    style={{ width: 'auto' }}
                  />
                  {n}
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* NPC */}
      <div style={sectionStyle}>
        <h3 style={h3Style}>NPC (x2)</h3>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={{ ...thStyle, textAlign: 'left', width: 60 }} />
              <th style={thStyle}>Blur</th>
              <th style={thStyle}>Break</th>
              <th style={thStyle}>Recovery</th>
            </tr>
          </thead>
          <tbody>
            {['1', '2'].map((num) => (
              <tr key={num}>
                <td style={tdLabelStyle}>#{num}</td>
                {['Blur', 'Break', 'Recovery'].map((f) => (
                  <td key={f} style={tdStyle}>
                    <input
                      type="text"
                      value={data[`npc${num}${f}`] || ''}
                      onChange={(e) => onChange(`npc${num}${f}`, e.target.value)}
                      style={cellInput}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* NPA, Sheard's, Minimum AOA */}
      <div style={sectionStyle}>
        <h3 style={h3Style}>NPA</h3>
        <div style={{ display: 'flex', gap: 16, marginBottom: 12 }}>
          <div>
            <label style={labelStyle}>OD</label>
            <input
              type="text"
              value={data.npaOd || ''}
              onChange={(e) => onChange('npaOd', e.target.value)}
              style={cellInput}
            />
          </div>
          <div>
            <label style={labelStyle}>OS</label>
            <input
              type="text"
              value={data.npaOs || ''}
              onChange={(e) => onChange('npaOs', e.target.value)}
              style={cellInput}
            />
          </div>
        </div>

        <h3 style={{ ...h3Style, marginTop: 16 }}>SHEARD'S</h3>
        <div style={{ display: 'flex', gap: 16, marginBottom: 12 }}>
          <div>
            <label style={labelStyle}>OD</label>
            <input
              type="text"
              value={data.sheardsOd || ''}
              onChange={(e) => onChange('sheardsOd', e.target.value)}
              style={cellInput}
            />
          </div>
          <div>
            <label style={labelStyle}>OS</label>
            <input
              type="text"
              value={data.sheardsOs || ''}
              onChange={(e) => onChange('sheardsOs', e.target.value)}
              style={cellInput}
            />
          </div>
        </div>

        <h3 style={{ ...h3Style, marginTop: 16 }}>MINIMUM AOA (15 - [AGE/4])</h3>
        <input
          type="text"
          value={data.minimumAoa || ''}
          readOnly
          style={{ ...cellInput, backgroundColor: 'var(--color-surface-alt)', cursor: 'not-allowed' }}
        />
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
const cellSelect = { textAlign: 'center', padding: '4px 4px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', width: '100px', fontSize: 'var(--text-sm)', cursor: 'pointer' };
const labelStyle = { fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 4, display: 'block' };
